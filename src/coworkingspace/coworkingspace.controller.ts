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
  Request,
  Put,
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

  // create new coworking space
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createCoworkingspaceDto: CreateCoworkingspaceDto) {
    return this.coworkingspaceService.create(createCoworkingspaceDto);
  }

  // get all coworking spaces for ADMIN
  @Get()
  findAll(@Request() req) {
    const role = req.user.role;
    const filter: any = {};
    const { address, date, startTime, endTime } = req.query;

    // Apply additional filters based on the query parameters
    if (address) filter.address = address;
    if (date) filter.date = date;
    if (startTime) filter.startTime = startTime;
    if (endTime) filter.endTime = endTime;
    return this.coworkingspaceService.findAll(filter, role);
  }

  // get coworking space by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coworkingspaceService.findOne(id);
  }

  // update coworking space
  @Roles(Role.ADMIN)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoworkingspaceDto: UpdateCoworkingspaceDto,
  ) {
    return this.coworkingspaceService.update(id, updateCoworkingspaceDto);
  }

  // delete coworking space
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coworkingspaceService.remove(id);
  }
}
