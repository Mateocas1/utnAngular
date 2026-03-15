import { Message } from './message';

export type ContactStatus = 'online' | 'offline' | 'away';

export interface Contact {
  id: string;
  name: string;
  avatarUrl: string;
  status: ContactStatus;
  lastSeen?: Date;
}

export interface Chat {
  id: string;
  contact: Contact;
  messages: Message[];
  lastMessageAt: Date;
}
