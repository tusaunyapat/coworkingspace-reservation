import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Role } from 'src/shared/enums/roles.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { CoworkingspaceService } from 'src/coworkingspace/coworkingspace.service';
import { Coworkingspace } from 'src/coworkingspace/schemas/coworkingspace.schema';
import { Reservation } from './schema/reservation.schema';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    console.log(req.user);
    const userId = req.user.userId; // Assuming the user ID is in req.user.id
    return this.reservationService.create(createReservationDto, userId);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }
}
