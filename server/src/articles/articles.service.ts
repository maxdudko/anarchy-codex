import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article, ArticleDocument } from './schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  PaginatedResult,
  parsePagination,
  toPaginated,
} from '../common/utils/pagination';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    authorId: string,
  ): Promise<Article> {
    const articles = new this.articleModel({
      ...createArticleDto,
      author: new Types.ObjectId(authorId),
      publishedAt: createArticleDto.isPublished ? new Date() : undefined,
    });

    return articles.save();
  }

  async findAll(
    publishedOnly: boolean = true,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Article>> {
    const pagination = parsePagination(page, limit);
    const filter = publishedOnly ? { isPublished: true } : {};
    const [data, total] = await Promise.all([
      this.articleModel
        .find(filter)
        .populate('author', 'pseudonym avatar')
        .sort({ createdAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.articleModel.countDocuments(filter).exec(),
    ]);
    return toPaginated(data, total, pagination.page, pagination.limit);
  }

  async findById(id: string): Promise<Article> {
    const article = await this.articleModel
      .findById(id)
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async findByTag(tag: string): Promise<Article[]> {
    return this.articleModel
      .find({ tags: tag, isPublished: true })
      .populate('author', 'pseudonym avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
  ): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if user is the author or has moderator/admin role
    if (article.author.toString() !== userId) {
      throw new ForbiddenException('You can only edit your own articles');
    }

    const updateData: any = { ...updateArticleDto };

    // Set publishedAt if publishing for the first time
    if (updateArticleDto.isPublished && !article.isPublished) {
      updateData.publishedAt = new Date();
    }

    const updatedArticle = await this.articleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'pseudonym avatar')
      .exec();

    if (!updatedArticle) {
      throw new NotFoundException('Article not found');
    }

    return updatedArticle;
  }

  async remove(id: string, userId: string): Promise<void> {
    const article = await this.articleModel.findById(id).exec();

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Check if user is the author or has moderator/admin role
    if (article.author.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await this.articleModel.findByIdAndDelete(id).exec();
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.articleModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
      .exec();
  }
}
