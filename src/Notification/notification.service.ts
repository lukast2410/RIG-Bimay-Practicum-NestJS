import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationDetail } from 'src/NotificationDetail/notification-detail.entity';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  findNotification(id: string) {
    return this.notificationRepository
      .createQueryBuilder('header')
      .where('header.NotificationId = :id', { id: id })
      .leftJoinAndSelect('header.details', 'NotificationDetail')
      .orderBy('IsRead', 'ASC')
      .getOne();
  }

  findUserNotification(userId: string, semesterId: string) {
    return this.notificationRepository
      .createQueryBuilder('header')
      .innerJoinAndSelect('header.details', 'detail')
      .where('StudentId = :id', { id: userId })
      .andWhere('SemesterId = :semesterId', { semesterId: semesterId })
      .take(5)
      .getMany();
  }

  findUserNotificationLimit(
    userId: string,
    semesterId: string,
    start: number,
    max: number,
  ) {
    return this.notificationRepository
      .createQueryBuilder('header')
      .innerJoinAndSelect('header.details', 'detail')
      .where('StudentId = :id', { id: userId })
      .andWhere('SemesterId = :semesterId', { semesterId: semesterId })
      .offset(start)
      .limit(max)
      .getMany();
  }

  findNotificationByContentId(contentId: string) {
    return this.notificationRepository.findOne({
      ContentId: contentId,
    });
  }

  countUserNotification(userId: string, semesterId: string) {
    return this.notificationRepository
      .createQueryBuilder('header')
      .where('SemesterId = :semesterId', { semesterId: semesterId })
      .andWhere((qb) => {
        const subquery = qb
          .subQuery()
          .select('detail.NotificationId')
          .from(NotificationDetail, 'detail')
          .where('detail.StudentId = :id', { id: userId })
          .getQuery();
        return 'header.NotificationId IN ' + subquery;
      })
      .getCount();
  }

  updateNotification(id: string, notif: Notification) {
    return this.notificationRepository.save({ ...notif, NotificationId: id });
  }

  insertNotification(notif: Notification) {
    return this.notificationRepository.save(notif);
  }

  deleteNotification(id: string) {
    return this.notificationRepository.delete({ NotificationId: id });
  }

  deleteNotificationByContentId(contentId: string) {
    return this.notificationRepository.delete({ ContentId: contentId });
  }
}
