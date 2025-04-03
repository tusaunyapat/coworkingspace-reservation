import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CoworkingspaceService } from './coworkingspace.service';
import { CreateCoworkingspaceDto } from './dto/create-coworkingspace.dto';
import { UpdateCoworkingspaceDto } from './dto/update-coworkingspace.dto';
import { Role } from 'src/shared/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
@Controller('coworkingspace')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoworkingspaceController {
  constructor(private readonly coworkingspaceService: CoworkingspaceService) {}

  //create new coworking space
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCoworkingspaceDto: CreateCoworkingspaceDto) {
    return this.coworkingspaceService.create(createCoworkingspaceDto);
  }

  //get all coworking spaces for ADMIN
  @Roles(Role.ADMIN)
  @Get('/all')
  findAll() {
    return this.coworkingspaceService.findAll();
  }

  //get all available for USER
  @Get()
  @Roles(Role.USER)
  findAllAvailable(
    @Query('address') address?: string,
    @Query('date') date?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
  ) {
    const filter: any = {};

    if (address) filter.address = address;
    if (date) filter.date = new Date(date); // Convert date string to Date object
    if (startTime) filter.startTime = startTime;
    if (endTime) filter.endTime = endTime;

    console.log('Filter object before passing to service:', filter);
    return this.coworkingspaceService.findAllAvailable(filter);
  }

  //get coworking space
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coworkingspaceService.findOne(id);
  }

  //update coworking space
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoworkingspaceDto: UpdateCoworkingspaceDto,
  ) {
    return this.coworkingspaceService.update(id, updateCoworkingspaceDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coworkingspaceService.remove(id);
  }
}
