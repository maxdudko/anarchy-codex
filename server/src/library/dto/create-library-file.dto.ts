import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';

function toBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === 'on' || value === '1';
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim());
  }
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string');
      }
    } catch {
      // comma-separated
    }
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export class CreateLibraryFileDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sourceAuthor?: string;

  @Transform(({ value }) => toStringArray(value))
  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
