import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  create(@Body() createNewsDto: CreateArticleDto, @Request() req) {
    return this.articlesService.create(createNewsDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('published') published?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('tag') tag?: string,
    @Query('search') search?: string,
    @Query('q') q?: string,
  ) {
    const publishedOnly = published !== 'false';
    return this.articlesService.findAll(publishedOnly, page, limit, {
      tag,
      search: search || q,
    });
  }

  @Get('tag/:tag')
  findByTag(@Param('tag') tag: string) {
    return this.articlesService.findByTag(tag);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const articles = await this.articlesService.findById(id);
    await this.articlesService.incrementViewCount(id);
    return articles;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateArticleDto,
    @Request() req,
  ) {
    return this.articlesService.update(
      id,
      updateNewsDto,
      req.user.id,
      req.user.roles,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.articlesService.remove(id, req.user.id, req.user.roles);
  }
}
