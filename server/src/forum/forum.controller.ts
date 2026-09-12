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
import { ForumService } from './forum.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  // Thread endpoints
  @Post('threads')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  createThread(@Body() createThreadDto: CreateThreadDto, @Request() req) {
    return this.forumService.createThread(createThreadDto, req.user.id);
  }

  @Get('threads')
  findAllThreads(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.forumService.findAllThreads(page, limit);
  }

  @Get('threads/:id')
  async findThreadById(@Param('id') id: string) {
    const thread = await this.forumService.findThreadById(id);
    await this.forumService.incrementThreadViewCount(id);
    return thread;
  }

  @Patch('threads/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  updateThread(
    @Param('id') id: string,
    @Body() updateThreadDto: UpdateThreadDto,
    @Request() req,
  ) {
    return this.forumService.updateThread(id, updateThreadDto, req.user.id);
  }

  @Delete('threads/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  removeThread(@Param('id') id: string, @Request() req) {
    return this.forumService.removeThread(id, req.user.id);
  }

  // Message endpoints
  @Post('threads/:threadId/messages')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  createMessage(
    @Param('threadId') threadId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    return this.forumService.createMessage(
      threadId,
      createMessageDto,
      req.user.id,
    );
  }

  @Get('threads/:threadId/messages')
  findMessagesByThread(@Param('threadId') threadId: string) {
    return this.forumService.findMessagesByThread(threadId);
  }

  @Get('messages/:id')
  findMessageById(@Param('id') id: string) {
    return this.forumService.findMessageById(id);
  }

  @Patch('messages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  updateMessage(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @Request() req,
  ) {
    return this.forumService.updateMessage(id, updateMessageDto, req.user.id);
  }

  @Delete('messages/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  removeMessage(@Param('id') id: string, @Request() req) {
    return this.forumService.removeMessage(id, req.user.id);
  }

  @Post('messages/:id/like')
  @UseGuards(JwtAuthGuard)
  likeMessage(@Param('id') id: string, @Request() req) {
    return this.forumService.likeMessage(id, req.user.id);
  }
}
