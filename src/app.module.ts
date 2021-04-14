import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
