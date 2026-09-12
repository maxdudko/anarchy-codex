import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateThreadDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @IsOptional()
  @IsBoolean()
  isLocked?: boolean;
}
