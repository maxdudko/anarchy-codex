import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LibraryFileDocument = LibraryFile & Document;

@Schema({ timestamps: true })
export class LibraryFile {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  language?: string;

  @Prop()
  format?: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop({ default: 0 })
  downloadCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop()
  fileId?: string; // GridFS file ID

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  _id: any;
}

export const LibraryFileSchema = SchemaFactory.createForClass(LibraryFile);
