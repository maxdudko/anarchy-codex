import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateLibraryFileDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sourceAuthor?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
