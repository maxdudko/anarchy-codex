import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { News, NewsDocument } from './schemas/news.schema';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<NewsDocument>) {}

  async create(createNewsDto: CreateNewsDto, authorId: string): Promise<News> {
    const news = new this.newsModel({
      ...createNewsDto,
      author: new Types.ObjectId(authorId),
      publishedAt: createNewsDto.isPublished ? new Date() : undefined,
    });

    return news.save();
  }

  async findAll(publishedOnly: boolean = true): Promise<News[]> {
    const filter = publishedOnly ? { isPublished: true } : {};
    return this.newsModel
      .find(filter)
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<News> {
    const news = await this.newsModel
      .findById(id)
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }

  async findByTag(tag: string): Promise<News[]> {
    return this.newsModel
      .find({ tags: tag, isPublished: true })
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateNewsDto: UpdateNewsDto,
    userId: string,
  ): Promise<News> {
    const news = await this.newsModel.findById(id).exec();

    if (!news) {
      throw new NotFoundException('News not found');
    }

    // Check if user is the author or has moderator/admin role
    if (news.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own news');
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
      throw new ForbiddenException('You can only delete your own news');
    }

    await this.newsModel.findByIdAndDelete(id).exec();
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.newsModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
      .exec();
  }
}
