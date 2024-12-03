import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { GetAppointmentsDto } from './dto/get-appointments.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthRolesGuard } from 'src/roles/roles.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.USER)
  @UseGuards(AuthRolesGuard)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthRolesGuard)
  findAll(@Query() filters: GetAppointmentsDto) {
    return this.appointmentsService.findAll(filters);
  }

  @Get(':id')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthRolesGuard)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.USER)
  @UseGuards(AuthRolesGuard)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  @Roles(Role.USER)
  @UseGuards(AuthRolesGuard)
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
