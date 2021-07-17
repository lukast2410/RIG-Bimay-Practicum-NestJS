import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { checkCollabToken } from 'src/api/check-auth';
import { NotificationDetail } from './notification-detail.entity';
import { NotificationDetailService } from './notification-detail.service';

@Controller('NotificationDetail')
export class NotificationDetailController {
  constructor(private readonly detailService: NotificationDetailService) {}

  @Get(':id')
  async findAllDetails(@Request() req, @Param() id: string) {
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      return {
        data: await this.detailService.findAllDetails(id),
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Post('Read')
  async readNotification(@Request() req, @Body() data: any) {
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      let temp = await this.detailService.findOne(
        data.NotificationId,
        data.StudentId,
      );
      if (temp != null) {
        return {
          data: await this.detailService.updateStudentReadNotification(
            data.NotificationId,
            data.StudentId,
            true,
          ),
        };
      } else {
        throw new NotFoundException({
          message: 'Notification Detail not found!',
        });
      }
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }

  @Post('MarkAllRead')
  async markAllRead(@Request() req, @Body() data: any) {
    const auth = await checkCollabToken(req.headers.authorization);
    if (auth != null) {
      return {
        data: await this.detailService.markUserReadAllNotification(
          data.StudentId,
          true,
        ),
      };
    } else {
      throw new UnauthorizedException({
        message: 'Authorization has been denied for this request.',
      });
    }
  }
}
