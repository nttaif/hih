import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createDto: CreateUserDto, user: User): Promise<User> {
    const newItem = this.repository.create({
      ...createDto,
      creator: user,
    });
    return await this.repository.save(newItem);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`User with id ${id} not found`);
    return item;
  }

  async update(id: number, updateDto: UpdateUserDto): Promise<User> {
    const item = await this.findOne(id); // Check exist
    this.repository.merge(item, updateDto);
    return await this.repository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.softDelete(id); // Soft delete
    if (result.affected === 0) {
       throw new NotFoundException(`User with id ${id} not found to delete`);
    }
  }
}
