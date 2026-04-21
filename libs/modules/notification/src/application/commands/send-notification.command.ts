export interface SendNotificationCommand {
  userId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  title: string;
  body: string;
}
