import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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

    return news.save();
  }

  async findAll(publishedOnly: boolean = true): Promise<Project[]> {
    const filter = publishedOnly ? { isPublished: true } : {};
    return this.newsModel
      .find(filter)
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
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
  ): Promise<Project> {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException('News not found');
    }

    // Check if user is the author or has moderator/admin role
    if (news.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own articles');
    }

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

  async remove(id: string, userId: string): Promise<void> {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException('News not found');
    }

    // Check if user is the author or has moderator/admin role
    if (news.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await this.newsModel.findByIdAndDelete(id).exec();
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.newsModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
      .exec();
  }
}
