export interface NotificationProps {
  id: string;
  userId: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  title: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt: Date | null;
  createdAt: Date;
}

export class Notification {
  private readonly props: NotificationProps;

  constructor(props: NotificationProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get userId(): string { return this.props.userId; }
  get type(): NotificationProps['type'] { return this.props.type; }
  get status(): NotificationProps['status'] { return this.props.status; }

  markSent(): void {
    this.props.status = 'sent';
    this.props.sentAt = new Date();
  }

  markFailed(): void {
    this.props.status = 'failed';
  }
}
