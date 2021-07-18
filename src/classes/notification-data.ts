import { NotificationDetailData } from "./notification-detail-data";

export interface NotificationData {
	NotificationId: string
	Title: string
	Content: string
	ContentId: string
	Type: string
	LastUpdate: Date
  details?: NotificationDetailData[]
}

