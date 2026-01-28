import { PartialType } from '@nestjs/swagger'; // Or @nestjs/mapped-types if Swagger is not used
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
