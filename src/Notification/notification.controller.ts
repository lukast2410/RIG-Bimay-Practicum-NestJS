import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { checkCollabToken } from 'src/api/check-auth';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Controller('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':id')
  async findNotification(@Request() req, @Param('id') id: string) {
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      let data = await this.notificationService.findNotification(id);
      if (data == null) {
        throw new NotFoundException({ message: 'ID not found! ' });
      }
      return {
        data,
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Get('UserNotification/Limit')
  async findUserNotificationLimit(@Request() req, @Body() data, @Query() query) {
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      return {
        count: await this.notificationService.countUserNotification(data.StudentId, data.SemesterId),
        data: await this.notificationService.findUserNotificationLimit(data.StudentId, data.SemesterId, query.start, query.max),
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Post()
  async insertNotification(@Request() req, @Body() notif: Notification) {
    const auth = await checkCollabToken(req.headers.authorization);
    notif.LastUpdate = new Date()
    if (auth != null) {
      return {
        data: await this.notificationService.insertNotification(notif),
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Delete(':id')
  async deleteExtraClass(@Request() req, @Param('id') id: string) {
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      let temp = await this.notificationService.deleteNotification(id);
      if (temp.affected == 0) {
        throw new NotFoundException({ message: 'ID not found! ' });
      }
      return {
        data: temp
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }
}
