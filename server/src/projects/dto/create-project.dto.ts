import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
