import {
  IsOptional,
  IsString,
  MinLength,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  pseudonym?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsArray()
  roles?: UserRole[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
