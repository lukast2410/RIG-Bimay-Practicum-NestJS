import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationData } from './classes/notification-data';
import * as webpush from 'web-push'

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationGateway');
  private users: any = {};

  @SubscribeMessage('contentToServer')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('sendMessage', payload);
  }

  @SubscribeMessage('broadcastExtraClass')
  handleExtraClass(client: Socket, payload: NotificationData): void {
    let notif: NotificationData = { ...payload, details: [] };
    payload.details.forEach((x) => {
      if (this.users[x.StudentId]) {
        notif.details = [
          {
            NotificationId: notif.NotificationId,
            StudentId: x.StudentId,
            IsRead: false,
            StudentName: x.StudentId,
          },
        ];
        this.users[x.StudentId].emit('sendMessage', notif);
      }
    });
  }

  @SubscribeMessage('userConnected')
  handleUserConnected(client: Socket, payload: any): void {
    const id = payload.id;
    const temp = Object.keys(this.users).find(
      (key) => this.users[key].id == client.id,
    );
    if (temp && temp != id) delete this.users[temp];
    this.users[id] = client;
  }

  @SubscribeMessage('userSignout')
  handleUserSignout(client: Socket, payload: any): void {
    const id = payload.id;
    delete this.users[id];
    this.logger.log(`Client signout: ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('Initialize Server');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const prop = Object.keys(this.users).find(
      (key) => this.users[key] == client,
    );
    delete this.users[prop];
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
