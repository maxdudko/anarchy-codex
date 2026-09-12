import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('publicOnly') publicOnly?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('q') q?: string,
  ) {
    const isPublicOnly = publicOnly !== 'false';
    return this.eventsService.findAll(isPublicOnly, page, limit, {
      search: search || q,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(
      id,
      updateEventDto,
      req.user.id,
      req.user.roles,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.MODERATOR, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user.id, req.user.roles);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  joinEvent(@Param('id') id: string, @Request() req) {
    return this.eventsService.joinEvent(id, req.user.id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  leaveEvent(@Param('id') id: string, @Request() req) {
    return this.eventsService.leaveEvent(id, req.user.id);
  }
}
