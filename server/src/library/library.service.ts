import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  LibraryFile,
  LibraryFileDocument,
} from './schemas/library-file.schema';
import { CreateLibraryFileDto } from './dto/create-library-file.dto';
import { UpdateLibraryFileDto } from './dto/update-library-file.dto';
import {
  PaginatedResult,
  parsePagination,
  toPaginated,
} from '../common/utils/pagination';
import { ListQuery, withListFilters } from '../common/utils/list-query';
import { assertOwnerOrModerator } from '../common/utils/access';

@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(LibraryFile.name)
    private libraryFileModel: Model<LibraryFileDocument>,
  ) {}

  async create(
    createLibraryFileDto: CreateLibraryFileDto,
    fileInfo: Express.Multer.File,
    authorId: string,
  ): Promise<LibraryFile> {
    if (!fileInfo) {
      throw new BadRequestException('A file is required');
    }

    const libraryFile = new this.libraryFileModel({
      ...createLibraryFileDto,
      filename: fileInfo.filename,
      originalName: fileInfo.originalname,
      mimeType: fileInfo.mimetype,
      size: fileInfo.size,
      author: new Types.ObjectId(authorId),
    });

    const saved = await libraryFile.save();
    return this.libraryFileModel
      .findById(saved._id)
      .populate('author', 'pseudonym avatar')
      .exec() as Promise<LibraryFile>;
  }

  async findAll(
    publicOnly: boolean = true,
    page?: number,
    limit?: number,
    query?: ListQuery,
  ): Promise<PaginatedResult<LibraryFile>> {
    const pagination = parsePagination(page, limit);
    const filter = withListFilters(
      publicOnly ? { isPublic: true } : {},
      query,
      ['title', 'description', 'sourceAuthor', 'tags'],
    );
    const [data, total] = await Promise.all([
      this.libraryFileModel
        .find(filter)
        .populate('author', 'pseudonym avatar')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.libraryFileModel.countDocuments(filter).exec(),
    ]);
    return toPaginated(data, total, pagination.page, pagination.limit);
  }

  async findById(id: string): Promise<LibraryFile> {
    const libraryFile = await this.libraryFileModel
      .findById(id)
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!libraryFile) {
      throw new NotFoundException('Library file not found');
    }

    return libraryFile;
  }

  async findByTag(tag: string): Promise<LibraryFile[]> {
    return this.libraryFileModel
      .find({ tags: tag, isPublic: true })
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByAuthor(authorId: string): Promise<LibraryFile[]> {
    return this.libraryFileModel
      .find({ author: new Types.ObjectId(authorId) })
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateLibraryFileDto: UpdateLibraryFileDto,
    userId: string,
    roles?: string[],
  ): Promise<LibraryFile> {
    const libraryFile = await this.libraryFileModel.findById(id).exec();

    if (!libraryFile) {
      throw new NotFoundException('Library file not found');
    }

    assertOwnerOrModerator(
      libraryFile.author,
      userId,
      roles,
      'You can only edit your own files',
    );

    const updatedLibraryFile = await this.libraryFileModel
      .findByIdAndUpdate(id, updateLibraryFileDto, { new: true })
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!updatedLibraryFile) {
      throw new NotFoundException('Library file not found');
    }

    return updatedLibraryFile;
  }

  async remove(
    id: string,
    userId: string,
    roles?: string[],
  ): Promise<LibraryFile> {
    const libraryFile = await this.libraryFileModel.findById(id).exec();

    if (!libraryFile) {
      throw new NotFoundException('Library file not found');
    }

    assertOwnerOrModerator(
      libraryFile.author,
      userId,
      roles,
      'You can only delete your own files',
    );

    await this.libraryFileModel.findByIdAndDelete(id).exec();
    return libraryFile;
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.libraryFileModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
      .exec();
  }

  async incrementDownloadCount(id: string): Promise<void> {
    await this.libraryFileModel
      .findByIdAndUpdate(id, { $inc: { downloadCount: 1 } })
      .exec();
  }

  async search(query: string): Promise<LibraryFile[]> {
    const searchRegex = new RegExp(query, 'i');
    return this.libraryFileModel
      .find({
        $and: [
          { isPublic: true },
          {
            $or: [
              { title: searchRegex },
              { description: searchRegex },
              { tags: searchRegex },
            ],
          },
        ],
      })
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
  }
}
