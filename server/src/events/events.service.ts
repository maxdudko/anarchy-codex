import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from './schemas/event.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    organizerId: string,
  ): Promise<Event> {
    const event = new this.eventModel({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      endDate: createEventDto.endDate
        ? new Date(createEventDto.endDate)
        : undefined,
      newsArticle: new Types.ObjectId(createEventDto.newsArticle),
      organizer: new Types.ObjectId(organizerId),
    });

    return event.save();
  }

  async findAll(publicOnly: boolean = true): Promise<Event[]> {
    const filter = publicOnly ? { isPublic: true } : {};
    return this.eventModel
      .find(filter)
      .populate('organizer', 'pseudonym avatar')
      .populate('newsArticle', 'title')
      .sort({ startDate: 1 })
      .exec();
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate('organizer', 'pseudonym avatar')
      .populate('newsArticle', 'title content')
      .populate('attendees', 'pseudonym avatar')
      .exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async findByNewsArticle(newsId: string): Promise<Event[]> {
    return this.eventModel
      .find({ newsArticle: new Types.ObjectId(newsId) })
      .populate('organizer', 'pseudonym avatar')
      .sort({ startDate: 1 })
      .exec();
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if user is the organizer or has moderator/admin role
    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException('You can only edit events you organized');
    }

    const updateData: any = { ...updateEventDto };

    if (updateEventDto.startDate) {
      updateData.startDate = new Date(updateEventDto.startDate);
    }

    if (updateEventDto.endDate) {
      updateData.endDate = new Date(updateEventDto.endDate);
    }

    if (updateEventDto.newsArticle) {
      updateData.newsArticle = new Types.ObjectId(updateEventDto.newsArticle);
    }

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('organizer', 'pseudonym avatar')
      .populate('newsArticle', 'title')
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    return updatedEvent;
  }

  async remove(id: string, userId: string): Promise<void> {
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if user is the organizer or has moderator/admin role
    if (event.organizer.toString() !== userId) {
      throw new ForbiddenException('You can only delete events you organized');
    }

    await this.eventModel.findByIdAndDelete(id).exec();
  }

  async joinEvent(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId).exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.isPublic) {
      throw new ForbiddenException('This event is not public');
    }

    const attendeeId = new Types.ObjectId(userId);

    if (event.attendees.includes(attendeeId)) {
      throw new ForbiddenException('You are already registered for this event');
    }

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(
        eventId,
        {
          $push: { attendees: attendeeId },
          $inc: { attendeeCount: 1 },
        },
        { new: true },
      )
      .populate('organizer', 'pseudonym avatar')
      .populate('newsArticle', 'title')
      .populate('attendees', 'pseudonym avatar')
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    return updatedEvent;
  }

  async leaveEvent(eventId: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findById(eventId).exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const attendeeId = new Types.ObjectId(userId);

    if (!event.attendees.includes(attendeeId)) {
      throw new ForbiddenException('You are not registered for this event');
    }

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(
        eventId,
        {
          $pull: { attendees: attendeeId },
          $inc: { attendeeCount: -1 },
        },
        { new: true },
      )
      .populate('organizer', 'pseudonym avatar')
      .populate('newsArticle', 'title')
      .populate('attendees', 'pseudonym avatar')
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    return updatedEvent;
  }
}
