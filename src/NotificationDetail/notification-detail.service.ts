import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationDetail } from './notification-detail.entity';

@Injectable()
export class NotificationDetailService {
  constructor(
    @InjectRepository(NotificationDetail)
    private readonly notifDetailRepository: Repository<NotificationDetail>,
  ) {}

  findAllDetails(id: string) {
    return this.notifDetailRepository.find({ NotificationId: id });
  }

  findOne(notifId: string, studentId: string) {
    return this.notifDetailRepository.findOne({
      NotificationId: notifId,
      StudentId: studentId,
    });
  }

  markUserReadAllNotification(studentId: string, isRead: boolean) {
    return this.notifDetailRepository.update(
      { StudentId: studentId },
      { IsRead: isRead },
    );
  }

  updateStudentReadNotification(id: string, studentId: string, isRead: boolean) {
    return this.notifDetailRepository.update(
      { NotificationId: id, StudentId: studentId },
      { IsRead: isRead },
    );
  }

  updateNotificationRead(id: string, isRead: boolean) {
    return this.notifDetailRepository.update(
      { NotificationId: id },
      { IsRead: isRead },
    );
  }

  insertDetail(data: NotificationDetail) {
    return this.notifDetailRepository.save(data);
  }
}
