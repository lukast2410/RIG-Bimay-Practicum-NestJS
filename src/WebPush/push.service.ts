import { Injectable } from '@nestjs/common';
import { NotificationData } from 'src/classes/notification-data';
import * as webpush from 'web-push';

@Injectable()
export class PushService {
  private vapidKeys = {
    publicKey:
      'BJKekXcDQgJ_y0kO7Wb2oYMWLodN-79U9d3ydfgTlOmxwkGB7IPU9tuObaQRfhSGuLAa9sIFt1mFhkVggjQBOKY',
    privateKey: '6kkMxnw8hazwrTqNn-hD0ydP96EBRWsYsZyXK6qKRZI',
  };
  private subscriptions: any = {};

  constructor() {
    this.setupWebPush();
  }

  pushSubcription(key: string, sub: any) {
    const temp = Object.keys(this.subscriptions).find(
      (key) => this.subscriptions[key] == sub,
    );
    if (temp && temp != key) delete this.subscriptions[temp];
    this.subscriptions[key] = sub;
    return 'Success'
  }

  setupWebPush(): void {
    webpush.setVapidDetails(
      'mailto:ltdxcv@bimayprk.com',
      this.vapidKeys.publicKey,
      this.vapidKeys.privateKey,
    );
  }

  sendNotificationToUsers(data: NotificationData) {
    data.details.forEach((x) => {
      if (this.subscriptions[x.StudentId]) {
        const notif = {
          title: data.Title,
          body: data.Content,
          vibrate: [300, 100, 400],
          data: {
            link: data.ContentId,
            type: data.Type
          },
        };
        this.sendNotification(this.subscriptions[x.StudentId], notif)
      }
    });
    return 'Success'
  }

  sendNotification(subscription, data) {
    webpush
      .sendNotification(subscription, JSON.stringify(data))
      .then((res) => res.data)
      .catch((error) => console.error(error));
  }
}
