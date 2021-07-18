export interface Subscription {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}
