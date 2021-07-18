import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExtraClassDetailController } from './ExtraClassDetail/extra-class-detail.controller';
import { ExtraClassDetail } from './ExtraClassDetail/extra-class-detail.entity';
import { ExtraClassDetailService } from './ExtraClassDetail/extra-class-detail.service';
import { ExtraClassHeaderController } from './ExtraClassHeader/extra-class-header.controller';
import { ExtraClassHeader } from './ExtraClassHeader/extra-class-header.entity';
import { ExtraClassHeaderService } from './ExtraClassHeader/extra-class-header.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './Notification/notification.controller';
import { Notification } from './Notification/notification.entity';
import { NotificationService } from './Notification/notification.service';
import { NotificationDetailController } from './NotificationDetail/notification-detail.controller';
import { NotificationDetail } from './NotificationDetail/notification-detail.entity';
import { NotificationDetailService } from './NotificationDetail/notification-detail.service';
import { PushController } from './WebPush/push.controller';
import { PushService } from './WebPush/push.service';

// host: 'localhost',
// port: 1433,
// username: 'AdminLukas',
// password: 'admin24',
// database: 'BimayPRK',
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'mssql-39089-0.cloudclusters.net',
      port: 39089,
      username: 'AdminLCA',
      password: 'AdminBimay24',
      database: 'BimayPrk',
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    TypeOrmModule.forFeature([
      ExtraClassHeader,
      ExtraClassDetail,
      Notification,
      NotificationDetail,
    ]),
  ],
  controllers: [
    AppController,
    ExtraClassDetailController,
    ExtraClassHeaderController,
    NotificationController,
    NotificationDetailController,
    PushController,
  ],
  providers: [
    AppService,
    ExtraClassHeaderService,
    ExtraClassDetailService,
    NotificationGateway,
    NotificationService,
    NotificationDetailService,
    PushService,
  ],
})
export class AppModule {}
