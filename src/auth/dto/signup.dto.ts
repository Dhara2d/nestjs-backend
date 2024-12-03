import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Role } from '../../roles/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDTO {
  @ApiProperty({ description: 'the name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'the email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the user' })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least one number',
  })
  password: string;

  @ApiProperty({ description: 'Role of the user', required: false })
  @IsEnum(Role)
  @IsOptional()
  role: Role;
}
