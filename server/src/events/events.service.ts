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
import {
  PaginatedResult,
  parsePagination,
  toPaginated,
} from '../common/utils/pagination';

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
      organizer: new Types.ObjectId(organizerId),
    });

    const saved = await event.save();
    return this.eventModel
      .findById(saved._id)
      .populate('organizer', 'pseudonym avatar')
      .populate('attendees', 'pseudonym avatar')
      .exec() as Promise<Event>;
  }

  async findAll(
    publicOnly: boolean = true,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResult<Event>> {
    const pagination = parsePagination(page, limit);
    const filter = publicOnly ? { isPublic: true } : {};
    const [data, total] = await Promise.all([
      this.eventModel
        .find(filter)
        .populate('organizer', 'pseudonym avatar')
        .sort({ startDate: 1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .exec(),
      this.eventModel.countDocuments(filter).exec(),
    ]);
    return toPaginated(data, total, pagination.page, pagination.limit);
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventModel
      .findById(id)
      .populate('organizer', 'pseudonym avatar')
      .populate('attendees', 'pseudonym avatar')
      .exec();

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
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

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('organizer', 'pseudonym avatar')
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

    const alreadyJoined = event.attendees.some(
      (id) => id.toString() === userId,
    );

    if (alreadyJoined) {
      throw new ForbiddenException('You are already registered for this event');
    }

    const attendeeId = new Types.ObjectId(userId);

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
    const isJoined = event.attendees.some((id) => id.toString() === userId);

    if (!isJoined) {
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
      .populate('attendees', 'pseudonym avatar')
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException('Event not found');
    }

    return updatedEvent;
  }
}
