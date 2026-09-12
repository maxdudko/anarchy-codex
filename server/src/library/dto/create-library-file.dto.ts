import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateLibraryFileDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsOptional()
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
