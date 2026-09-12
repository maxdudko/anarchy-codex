import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Thread, ThreadDocument } from './schemas/thread.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  PaginatedResult,
  parsePagination,
  toPaginated,
} from '../common/utils/pagination';
import { ListQuery, withListFilters } from '../common/utils/list-query';
import { assertOwnerOrModerator, isModerator } from '../common/utils/access';
import { ModerateThreadDto } from './dto/moderate-thread.dto';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  // Thread methods
  async createThread(
    createThreadDto: CreateThreadDto,
    authorId: string,
  ): Promise<Thread> {
    const thread = new this.threadModel({
      ...createThreadDto,
      author: new Types.ObjectId(authorId),
      lastActivityAt: new Date(),
    });

    const saved = await thread.save();
    return this.threadModel
      .findById(saved._id)
      .populate('author', 'pseudonym avatar')
      .exec() as Promise<Thread>;
  }

  async findAllThreads(
    page?: number,
    limit?: number,
    query?: ListQuery,
  ): Promise<PaginatedResult<Thread>> {
    const pagination = parsePagination(page, limit);
    const filter = withListFilters({}, query, ['title', 'content', 'tags']);
    const [data, total] = await Promise.all([
      this.threadModel
        .find(filter)
        .populate('author', 'pseudonym avatar')
        .populate('lastMessage')
        .sort({ isPinned: -1, lastActivityAt: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.threadModel.countDocuments(filter).exec(),
    ]);
    return toPaginated(data, total, pagination.page, pagination.limit);
  }

  async findThreadById(id: string): Promise<Thread> {
    const thread = await this.threadModel
      .findById(id)
      .populate('author', 'pseudonym avatar')
      .populate('lastMessage')
      .exec();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return thread;
  }

  async updateThread(
    id: string,
    updateThreadDto: UpdateThreadDto,
    userId: string,
    roles?: string[],
  ): Promise<Thread> {
    const thread = await this.threadModel.findById(id).exec();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    assertOwnerOrModerator(
      thread.author,
      userId,
      roles,
      'You can only edit your own threads',
    );

    const { isPinned, isLocked, ...contentUpdate } = updateThreadDto;
    const updateData: Record<string, unknown> = { ...contentUpdate };
    if (isModerator(roles)) {
      if (isPinned !== undefined) {
        updateData.isPinned = isPinned;
      }
      if (isLocked !== undefined) {
        updateData.isLocked = isLocked;
      }
    }

    const updatedThread = await this.threadModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('author', 'pseudonym avatar')
      .populate('lastMessage')
      .exec();

    if (!updatedThread) {
      throw new NotFoundException('Thread not found');
    }

    return updatedThread;
  }

  async removeThread(
    id: string,
    userId: string,
    roles?: string[],
  ): Promise<void> {
    const thread = await this.threadModel.findById(id).exec();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    assertOwnerOrModerator(
      thread.author,
      userId,
      roles,
      'You can only delete your own threads',
    );

    // Delete all messages in the thread first
    await this.messageModel
      .deleteMany({ thread: new Types.ObjectId(id) })
      .exec();

    // Then delete the thread
    await this.threadModel.findByIdAndDelete(id).exec();
  }

  async incrementThreadViewCount(id: string): Promise<void> {
    await this.threadModel
      .findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
      .exec();
  }

  async moderateThread(
    id: string,
    dto: ModerateThreadDto,
    roles?: string[],
  ): Promise<Thread> {
    if (!isModerator(roles)) {
      throw new ForbiddenException('Only moderators can pin or lock threads');
    }

    const thread = await this.threadModel
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('author', 'pseudonym avatar')
      .populate('lastMessage')
      .exec();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return thread;
  }

  // Message methods
  async createMessage(
    threadId: string,
    createMessageDto: CreateMessageDto,
    authorId: string,
  ): Promise<Message> {
    const thread = await this.threadModel.findById(threadId).exec();

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (thread.isLocked) {
      throw new ForbiddenException('This thread is locked');
    }

    const message = new this.messageModel({
      ...createMessageDto,
      thread: new Types.ObjectId(threadId),
      author: new Types.ObjectId(authorId),
      parentMessage: createMessageDto.parentMessage
        ? new Types.ObjectId(createMessageDto.parentMessage)
        : undefined,
    });

    const savedMessage = await message.save();

    // Update thread's last message and activity
    await this.threadModel
      .findByIdAndUpdate(threadId, {
        lastMessage: savedMessage._id,
        lastActivityAt: new Date(),
        $inc: { replyCount: 1 },
      })
      .exec();

    return this.messageModel
      .findById(savedMessage._id)
      .populate('author', 'pseudonym avatar')
      .exec() as Promise<Message>;
  }

  async findMessagesByThread(threadId: string): Promise<Message[]> {
    return this.messageModel
      .find({ thread: new Types.ObjectId(threadId), isDeleted: false })
      .populate('author', 'pseudonym avatar')
      .populate('parentMessage')
      .sort({ createdAt: 1 })
      .exec();
  }

  async findMessageById(id: string): Promise<Message> {
    const message = await this.messageModel
      .findById(id)
      .populate('author', 'pseudonym avatar')
      .populate('parentMessage')
      .exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async updateMessage(
    id: string,
    updateMessageDto: UpdateMessageDto,
    userId: string,
    roles?: string[],
  ): Promise<Message> {
    const message = await this.messageModel.findById(id).exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    assertOwnerOrModerator(
      message.author,
      userId,
      roles,
      'You can only edit your own messages',
    );

    const updatedMessage = await this.messageModel
      .findByIdAndUpdate(
        id,
        {
          ...updateMessageDto,
          isEdited: true,
          editedAt: new Date(),
        },
        { new: true },
      )
      .populate('author', 'pseudonym avatar')
      .populate('parentMessage')
      .exec();

    if (!updatedMessage) {
      throw new NotFoundException('Message not found');
    }

    return updatedMessage;
  }

  async removeMessage(
    id: string,
    userId: string,
    roles?: string[],
  ): Promise<void> {
    const message = await this.messageModel.findById(id).exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    assertOwnerOrModerator(
      message.author,
      userId,
      roles,
      'You can only delete your own messages',
    );

    await this.messageModel
      .findByIdAndUpdate(id, {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: new Types.ObjectId(userId),
      })
      .exec();
  }

  async likeMessage(messageId: string, userId: string): Promise<Message> {
    const message = await this.messageModel.findById(messageId).exec();

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const alreadyLiked = message.likedBy.some(
      (id) => id.toString() === userId,
    );
    const userIdObj = new Types.ObjectId(userId);

    if (alreadyLiked) {
      // Unlike
      const updatedMessage = await this.messageModel
        .findByIdAndUpdate(
          messageId,
          {
            $pull: { likedBy: userIdObj },
            $inc: { likeCount: -1 },
          },
          { new: true },
        )
        .populate('author', 'pseudonym avatar')
        .populate('parentMessage')
        .exec();

      if (!updatedMessage) {
        throw new NotFoundException('Message not found');
      }

      return updatedMessage;
    } else {
      // Like
      const updatedMessage = await this.messageModel
        .findByIdAndUpdate(
          messageId,
          {
            $push: { likedBy: userIdObj },
            $inc: { likeCount: 1 },
          },
          { new: true },
        )
        .populate('author', 'pseudonym avatar')
        .populate('parentMessage')
        .exec();

      if (!updatedMessage) {
        throw new NotFoundException('Message not found');
      }

      return updatedMessage;
    }
  }
}
