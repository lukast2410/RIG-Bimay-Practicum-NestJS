import { Notification } from 'src/Notification/notification.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class NotificationDetail {
  @PrimaryColumn()
  NotificationId: string;

  @PrimaryColumn({ length: 100 })
  StudentId: string;

  @Column('text')
  StudentName: string;

  @Column('bit')
  IsRead: boolean;

  @ManyToOne((type) => Notification, (header) => header.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'NotificationId', referencedColumnName: 'NotificationId' }])
  header?: Notification;
}
