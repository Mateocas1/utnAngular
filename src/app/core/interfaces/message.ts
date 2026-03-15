export type MessageSender = 'user' | 'app';

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  sentAt: Date;
  status?: 'sending' | 'sent';
}
