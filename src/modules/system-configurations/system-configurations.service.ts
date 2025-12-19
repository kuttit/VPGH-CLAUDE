import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SystemConfigurationsService {
  private readonly logger = new Logger(SystemConfigurationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateSystemConfigurationDto) {
    try {
      return await this.prisma.systemConfiguration.create({ data: createDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Configuration with this key already exists');
      }
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.systemConfiguration.findMany({ skip, take, orderBy: [{ category: 'asc' }, { configKey: 'asc' }] }),
      this.prisma.systemConfiguration.count(),
    ]);
    return { data, total, page: skip && take ? Math.floor(skip / take) + 1 : 1, limit: take || total, totalPages: take ? Math.ceil(total / take) : 1 };
  }

  async findOne(id: string) {
    const config = await this.prisma.systemConfiguration.findUnique({ where: { id } });
    if (!config) throw new NotFoundException(`System configuration with ID ${id} not found`);
    return config;
  }

  async findByKey(configKey: string) {
    const config = await this.prisma.systemConfiguration.findUnique({ where: { configKey } });
    if (!config) throw new NotFoundException(`System configuration with key ${configKey} not found`);
    return config;
  }

  async findByCategory(category: string) {
    return this.prisma.systemConfiguration.findMany({ where: { category }, orderBy: { configKey: 'asc' } });
  }

  async update(id: string, updateDto: UpdateSystemConfigurationDto) {
    try {
      return await this.prisma.systemConfiguration.update({ where: { id }, data: updateDto });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException(`System configuration with ID ${id} not found`);
        if (error.code === 'P2002') throw new ConflictException('Configuration with this key already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.systemConfiguration.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`System configuration with ID ${id} not found`);
      }
      throw error;
    }
  }
}
