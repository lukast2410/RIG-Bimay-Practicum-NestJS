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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mssql",
      host: "localhost",
      port: 1433,
      username: "AdminLukas",
      password: "admin24",
      database: "BimayPRK",
      entities: ["dist/**/*.entity{.ts,.js}"],
      autoLoadEntities: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    TypeOrmModule.forFeature([ExtraClassHeader, ExtraClassDetail])
  ],
  controllers: [
    AppController,
    ExtraClassDetailController,
    ExtraClassHeaderController,
  ],
  providers: [
    AppService,
    ExtraClassHeaderService,
    ExtraClassDetailService,
  ],
})
export class AppModule {}
