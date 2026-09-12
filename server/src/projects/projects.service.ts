import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  PaginatedResult,
  parsePagination,
  toPaginated,
} from '../common/utils/pagination';
import { ListQuery, withListFilters } from '../common/utils/list-query';
import { assertOwnerOrModerator } from '../common/utils/access';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private newsModel: Model<ProjectDocument>,
  ) {}

  async create(
    createNewsDto: CreateProjectDto,
    authorId: string,
  ): Promise<Project> {
    const news = new this.newsModel({
      ...createNewsDto,
      author: new Types.ObjectId(authorId),
      publishedAt: createNewsDto.isPublished ? new Date() : undefined,
    });

    const saved = await news.save();
    return this.newsModel
      .findById(saved._id)
      .populate('author', 'pseudonym avatar')
      .exec() as Promise<Project>;
  }

  async findAll(
    publishedOnly: boolean = true,
    page?: number,
    limit?: number,
    query?: ListQuery,
  ): Promise<PaginatedResult<Project>> {
    const pagination = parsePagination(page, limit);
    const filter = withListFilters(
      publishedOnly ? { isPublished: true } : {},
      query,
      ['title', 'description', 'tags'],
    );
    const [data, total] = await Promise.all([
      this.newsModel
        .find(filter)
        .populate('author', 'pseudonym avatar')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.newsModel.countDocuments(filter).exec(),
    ]);
    return toPaginated(data, total, pagination.page, pagination.limit);
  }

  async findById(id: string): Promise<Project> {
    const news = await this.newsModel
      .findById(id)
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }

  async findByTag(tag: string): Promise<Project[]> {
    return this.newsModel
      .find({ tags: tag, isPublished: true })
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateNewsDto: UpdateProjectDto,
    userId: string,
    roles?: string[],
  ): Promise<Project> {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException('News not found');
    }

    assertOwnerOrModerator(
      news.author,
      userId,
      roles,
      'You can only edit your own projects',
    );

    const updateData: any = { ...updateNewsDto };

    // Set publishedAt if publishing for the first time
    if (updateNewsDto.isPublished && !news.isPublished) {
      updateData.publishedAt = new Date();
    }

    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!updatedNews) {
      throw new NotFoundException('News not found');
    }

    return updatedNews;
  }

  async remove(id: string, userId: string, roles?: string[]): Promise<void> {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException('News not found');
    }

    assertOwnerOrModerator(
      news.author,
      userId,
      roles,
      'You can only delete your own projects',
    );

    await this.newsModel.findByIdAndDelete(id).exec();
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.newsModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
      .exec();
  }
}
