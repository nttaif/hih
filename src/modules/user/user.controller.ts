import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; 

@ApiTags('User')
@ApiBearerAuth()
@Controller('users') // Plural route
export class UserController {
  constructor(private readonly service: UserService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create new User' })
  create(@Body() createDto: CreateUserDto, @Req() req) {
    // Assuming req.user exists after passing Guard
    return this.service.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of User' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of User' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUserDto) {
    return this.service.update(id, updateDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete (Soft delete) User' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
