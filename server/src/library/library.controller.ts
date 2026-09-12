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
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { LibraryService } from './library.service';
import { CreateLibraryFileDto } from './dto/create-library-file.dto';
import { UpdateLibraryFileDto } from './dto/update-library-file.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createLibraryFileDto: CreateLibraryFileDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    return this.libraryService.create(createLibraryFileDto, file, req.user.id);
  }

  @Get()
  findAll(@Query('publicOnly') publicOnly?: string) {
    const isPublicOnly = publicOnly !== 'false';
    return this.libraryService.findAll(isPublicOnly);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.libraryService.search(query);
  }

  @Get('tag/:tag')
  findByTag(@Param('tag') tag: string) {
    return this.libraryService.findByTag(tag);
  }

  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.libraryService.findByAuthor(authorId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const file = await this.libraryService.findById(id);
    await this.libraryService.incrementViewCount(id);
    return file;
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.libraryService.findById(id);
    await this.libraryService.incrementDownloadCount(id);

    // In a real implementation, you would stream the file from GridFS or S3
    // For now, we'll just return the file metadata
    res.json({
      message: 'Download endpoint - file streaming would be implemented here',
      file: {
        id: file._id,
        title: file.title,
        filename: file.filename,
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
      },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateLibraryFileDto: UpdateLibraryFileDto,
    @Request() req,
  ) {
    return this.libraryService.update(id, updateLibraryFileDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.libraryService.remove(id, req.user.id);
  }
}
