import { NotificationDetail } from "./NotificationDetail";

export interface Notification {
	NotificationId: string
	Title: string
	Content: string
	ContentId: string
	Type: string
	LastUpdate: Date
  details?: NotificationDetail[]
}

