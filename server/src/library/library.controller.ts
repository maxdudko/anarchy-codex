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
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { existsSync, createReadStream, unlink } from 'fs';
import { join, basename } from 'path';
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
    if (!file) {
      throw new BadRequestException('A file is required');
    }
    return this.libraryService.create(createLibraryFileDto, file, req.user.id);
  }

  @Get()
  findAll(
    @Query('publicOnly') publicOnly?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const isPublicOnly = publicOnly !== 'false';
    return this.libraryService.findAll(isPublicOnly, page, limit);
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
    const dest = process.env.UPLOAD_DEST || './uploads';
    const filePath = join(dest, basename(file.filename));

    if (!existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: 'File is not available for download' });
    }

    await this.libraryService.incrementDownloadCount(id);
    res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.originalName)}"`,
    );
    return createReadStream(filePath).pipe(res);
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
  async remove(@Param('id') id: string, @Request() req) {
    const file = await this.libraryService.remove(id, req.user.id);
    const dest = process.env.UPLOAD_DEST || './uploads';
    const filePath = join(dest, basename(file.filename));
    if (existsSync(filePath)) {
      unlink(filePath, () => undefined);
    }
    return { deleted: true };
  }
}
