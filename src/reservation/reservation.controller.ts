import {
  Controller,
  Get,
  Post,
  Body,
  Put,
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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Request() req, @Body() createReservationDto: CreateReservationDto) {
    console.log(req.user);
    const user = req.user; // Assuming the user ID is in req.user.id
    return this.reservationService.create(createReservationDto, user);
  }

  @Roles(Role.ADMIN)
  @Get('/all')
  findAll() {
    return this.reservationService.findAll();
  }

  @Get('/myreservations')
  findMy(@Request() req) {
    const userId = req.user.userId;
    console.log(userId);
    return this.reservationService.findMy(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Get('/my-history')
  findMyHistory(@Request() req) {
    const userId = req.user.userId;
    return this.reservationService.findMyHistory(userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const user = req.user;
    return this.reservationService.update(id, updateReservationDto, user);
  }

  @Put(':id/checkin')
  checkin(
    @Request() req,
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    const userId = req.user.userId;
    console.log(userId);
    return this.reservationService.checkin(id, userId, updateReservationDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    return this.reservationService.remove(id, userId, userRole);
  }

  @Roles(Role.ADMIN)
  @Delete()
  removeAll() {
    return this.reservationService.removeAll();
  }
}
