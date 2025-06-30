import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop()
  location?: string;

  @Prop()
  url?: string;

  @Prop({ type: Types.ObjectId, ref: 'News', required: true })
  newsArticle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  organizer: Types.ObjectId;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: 0 })
  attendeeCount: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  attendees: Types.ObjectId[];

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
