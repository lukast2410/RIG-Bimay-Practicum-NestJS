import { NotificationDetail } from "./notification-detail";

export interface Notification {
	NotificationId: string
	Title: string
	Content: string
	ContentId: string
	Type: string
	LastUpdate: Date
  details?: NotificationDetail[]
}

