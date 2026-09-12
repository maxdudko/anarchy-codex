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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  create(@Body() createNewsDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createNewsDto, req.user.id);
  }

  @Get()
  findAll(@Query('published') published?: string) {
    const publishedOnly = published !== 'false';
    return this.projectsService.findAll(publishedOnly);
  }

  @Get('tag/:tag')
  findByTag(@Param('tag') tag: string) {
    return this.projectsService.findByTag(tag);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const news = await this.projectsService.findById(id);
    await this.projectsService.incrementViewCount(id);
    return news;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectsService.update(id, updateNewsDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.id);
  }
}
