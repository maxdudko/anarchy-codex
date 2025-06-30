import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  LibraryFile,
  LibraryFileDocument,
} from './schemas/library-file.schema';
import { CreateLibraryFileDto } from './dto/create-library-file.dto';
import { UpdateLibraryFileDto } from './dto/update-library-file.dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(LibraryFile.name)
    private libraryFileModel: Model<LibraryFileDocument>,
  ) {}

  async create(
    createLibraryFileDto: CreateLibraryFileDto,
    fileInfo: any,
    authorId: string,
  ): Promise<LibraryFile> {
    const libraryFile = new this.libraryFileModel({
      ...createLibraryFileDto,
      filename: fileInfo.filename,
      originalName: fileInfo.originalname,
      mimeType: fileInfo.mimetype,
      size: fileInfo.size,
      fileId: fileInfo.id,
      author: new Types.ObjectId(authorId),
    });

    return libraryFile.save();
  }

  async findAll(publicOnly: boolean = true): Promise<LibraryFile[]> {
    const filter = publicOnly ? { isPublic: true } : {};
    return this.libraryFileModel
      .find(filter)
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
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
  ): Promise<LibraryFile> {
    const libraryFile = await this.libraryFileModel.findById(id).exec();

    if (!libraryFile) {
      throw new NotFoundException('Library file not found');
    }

    // Check if user is the author or has moderator/admin role
    if (libraryFile.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own files');
    }

    const updatedLibraryFile = await this.libraryFileModel
      .findByIdAndUpdate(id, updateLibraryFileDto, { new: true })
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!updatedLibraryFile) {
      throw new NotFoundException('Library file not found');
    }

    return updatedLibraryFile;
  }

  async remove(id: string, userId: string): Promise<void> {
    const libraryFile = await this.libraryFileModel.findById(id).exec();

    if (!libraryFile) {
      throw new NotFoundException('Library file not found');
    }

    // Check if user is the author or has moderator/admin role
    if (libraryFile.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own files');
    }

    await this.libraryFileModel.findByIdAndDelete(id).exec();
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
