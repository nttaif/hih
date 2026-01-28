import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Identifier name', example: 'Summer Vacation 2024' })
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Detailed description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
