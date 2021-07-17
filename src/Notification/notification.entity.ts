import { NotificationDetail } from 'src/NotificationDetail/notification-detail.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryColumn()
  NotificationId: string;

  @Column()
  SemesterId: string
  
  @Column()
  Title: string;

  @Column({ length: 500 })
  Content: string;

  @Column({ length: 500 })
  ContentId: string;

  @Column()
  Type: string;

  @Column('datetime')
  LastUpdate: Date

  @OneToMany((type) => NotificationDetail, (detail) => detail.header, {
    cascade: true,
  })
  details: NotificationDetail[];
}
