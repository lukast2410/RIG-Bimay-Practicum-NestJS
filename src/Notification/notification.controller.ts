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
import { checkCollabToken, checkStudentToken } from 'src/api/check-auth';
import { PushService } from 'src/WebPush/push.service';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';

@Controller('Notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService, private readonly pushService: PushService) {}

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
    const auth = await checkStudentToken(req.headers.authorization);
    if (auth != null) {
      notif.LastUpdate = new Date()
      notif.details.forEach(x => {
        x.IsRead = false
      })
      const data = await this.notificationService.insertNotification(notif)
      const result = this.pushService.sendNotificationToUsers(data)
      return {
        data: data,
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Delete('Group')
  async deleteGroupNotification(@Request() req, @Body() data: any) {
    const auth = await checkStudentToken(req.headers.authorization);
    if (auth != null) {
      let temp = await this.notificationService.findUserNotification(data.StudentId, data.SemesterId, data.Course, data.Type)
      if (!temp) {
        throw new NotFoundException({ message: 'ID not found! ' });
      }
      let result = await this.notificationService.deleteNotification(temp.NotificationId)
      return {
        data: result
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Delete(':id')
  async deleteNotification(@Request() req, @Param('id') id: string) {
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
