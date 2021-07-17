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
import { Notification } from './classes/Notification';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationGateway');
  private users: any = {};

  @SubscribeMessage('contentToServer')
  handleMessage(client: Socket, payload: any): void {
    console.log(payload);
    this.server.emit('sendMessage', payload);
  }

  @SubscribeMessage('broadcastExtraClass')
  handleExtraClass(client: Socket, payload: Notification): void {
    let notif: Notification = { ...payload, details: [] };
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
    console.log('connect');
    console.log(payload);
    this.users[id] = client;
    for (const prop in this.users) {
      console.log(`${prop}: ${this.users[prop].id}`);
    }
  }

  @SubscribeMessage('userSignout')
  handleUserSignout(client: Socket, payload: any): void {
    const id = payload.id;
    console.log('signout: ' + id);
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
      (key) => this.users[key] === client,
    );
    delete this.users[prop];
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
