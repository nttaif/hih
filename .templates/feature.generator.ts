import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

// --- UTILITIES ---
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert PascalCase to param-case (e.g., UserGroup -> user-group)
function toParamCase(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

async function main() {
  const arg = process.argv[2];
  if (!arg) return console.error('Error: Please provide a feature name (e.g., product or UserLog)');

  const featureName = toParamCase(arg); // Ensure folder name is kebab-case
  const className = capitalizeFirstLetter(arg); // Class name keeps user input or capitalizes first letter

  const featureDir = join(__dirname, '../src/modules', featureName);

  if (existsSync(featureDir)) {
    return console.error(`Error: Module "${featureName}" already exists!`);
  }

  console.log(`Initializing module: ${featureName} (${className})...`);
  await mkdir(featureDir, { recursive: true });

  await generateDto(featureDir, featureName, className);
  await generateEntity(featureDir, featureName, className);
  await generateService(featureDir, featureName, className);
  await generateController(featureDir, featureName, className);
  await generateModule(featureDir, featureName, className);
  
  // Bonus: Generate test files
  await generateServiceSpec(featureDir, featureName, className);
  await generateControllerSpec(featureDir, featureName, className);

  console.log(`\nSUCCEEDED! Module created at: src/modules/${featureName}`);
  console.log(`Don't forget to import ${className}Module into AppModule!`);
}

// --- GENERATORS ---

async function generateEntity(dir: string, name: string, cls: string) {
  const entitiesDir = join(dir, 'entities');
  await mkdir(entitiesDir);
  
  const content = `import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: '${name}s' })
export class ${cls} {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date; // Soft Delete: Crucial for real-world projects
}
`;
  await writeFile(join(entitiesDir, `${name}.entity.ts`), content);
}

async function generateDto(dir: string, name: string, cls: string) {
  const dtoDir = join(dir, 'dto');
  await mkdir(dtoDir);

  // 1. Create DTO
  const createDtoContent = `import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create${cls}Dto {
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
`;
  await writeFile(join(dtoDir, `create-${name}.dto.ts`), createDtoContent);

  // 2. Update DTO (Extends Create DTO)
  const updateDtoContent = `import { PartialType } from '@nestjs/swagger'; // Or @nestjs/mapped-types if Swagger is not used
import { Create${cls}Dto } from './create-${name}.dto';

export class Update${cls}Dto extends PartialType(Create${cls}Dto) {}
`;
  await writeFile(join(dtoDir, `update-${name}.dto.ts`), updateDtoContent);
}

async function generateService(dir: string, name: string, cls: string) {
  const content = `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${cls} } from './entities/${name}.entity';
import { Create${cls}Dto } from './dto/create-${name}.dto';
import { Update${cls}Dto } from './dto/update-${name}.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ${cls}Service {
  constructor(
    @InjectRepository(${cls})
    private readonly repository: Repository<${cls}>,
  ) {}

  async create(createDto: Create${cls}Dto, user: User): Promise<${cls}> {
    const newItem = this.repository.create({
      ...createDto,
      creator: user,
    });
    return await this.repository.save(newItem);
  }

  async findAll(): Promise<${cls}[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<${cls}> {
    const item = await this.repository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(\`${cls} with id \${id} not found\`);
    return item;
  }

  async update(id: number, updateDto: Update${cls}Dto): Promise<${cls}> {
    const item = await this.findOne(id); // Check exist
    this.repository.merge(item, updateDto);
    return await this.repository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.softDelete(id); // Soft delete
    if (result.affected === 0) {
       throw new NotFoundException(\`${cls} with id \${id} not found to delete\`);
    }
  }
}
`;
  await writeFile(join(dir, `${name}.service.ts`), content);
}

async function generateController(dir: string, name: string, cls: string) {
  const content = `import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ${cls}Service } from './${name}.service';
import { Create${cls}Dto } from './dto/create-${name}.dto';
import { Update${cls}Dto } from './dto/update-${name}.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; 

@ApiTags('${cls}')
@ApiBearerAuth()
@Controller('${name}s') // Plural route
export class ${cls}Controller {
  constructor(private readonly service: ${cls}Service) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create new ${cls}' })
  create(@Body() createDto: Create${cls}Dto, @Req() req) {
    // Assuming req.user exists after passing Guard
    return this.service.create(createDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of ${cls}' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of ${cls}' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update ${cls}' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: Update${cls}Dto) {
    return this.service.update(id, updateDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete (Soft delete) ${cls}' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
`;
  await writeFile(join(dir, `${name}.controller.ts`), content);
}

async function generateModule(dir: string, name: string, cls: string) {
  const content = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ${cls}Service } from './${name}.service';
import { ${cls}Controller } from './${name}.controller';
import { ${cls} } from './entities/${name}.entity';

@Module({
  imports: [TypeOrmModule.forFeature([${cls}])],
  controllers: [${cls}Controller],
  providers: [${cls}Service],
  exports: [${cls}Service], // Export for other modules to use
})
export class ${cls}Module {}
`;
  await writeFile(join(dir, `${name}.module.ts`), content);
}

// --- TEST FILES GENERATORS (Optional but recommended) ---
async function generateServiceSpec(dir: string, name: string, cls: string) {
    const content = `import { Test, TestingModule } from '@nestjs/testing';
import { ${cls}Service } from './${name}.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ${cls} } from './entities/${name}.entity';

describe('${cls}Service', () => {
  let service: ${cls}Service;
  
  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${cls}Service,
        {
          provide: getRepositoryToken(${cls}),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<${cls}Service>(${cls}Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
`;
    await writeFile(join(dir, `${name}.service.spec.ts`), content);
}

async function generateControllerSpec(dir: string, name: string, cls: string) {
    const content = `import { Test, TestingModule } from '@nestjs/testing';
import { ${cls}Controller } from './${name}.controller';
import { ${cls}Service } from './${name}.service';

describe('${cls}Controller', () => {
  let controller: ${cls}Controller;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${cls}Controller],
      providers: [
        {
          provide: ${cls}Service,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<${cls}Controller>(${cls}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
`;
    await writeFile(join(dir, `${name}.controller.spec.ts`), content);
}

main();