import { Injectable, computed, signal } from '@angular/core';
import { Chat, Contact } from '../interfaces/chat';
import { Message } from '../interfaces/message';

const AUTO_REPLIES = [
  '¡Hola! ¿Cómo estás?',
  'Interesante, cuéntame más.',
  'Claro, entiendo perfectamente.',
  'Dame un momento para pensarlo.',
  '¡Excelente idea!',
  'Estoy de acuerdo contigo.',
  'No había pensado en eso antes.',
];

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Ana García',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=AnaGarcia',
    status: 'online',
  },
  {
    id: 'c2',
    name: 'Martín López',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=MartinLopez',
    status: 'away',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: 'c3',
    name: 'Sofía Romero',
    avatarUrl: 'https://api.dicebear.com/9.x/thumbs/svg?seed=SofiaRomero',
    status: 'offline',
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly _chats = signal<Chat[]>(
    INITIAL_CONTACTS.map((contact) => ({
      id: contact.id,
      contact,
      messages: [],
      lastMessageAt: new Date(),
    }))
  );

  readonly chats = this._chats.asReadonly();

  readonly filteredChats = computed(() => {
    const term = this._searchTerm().toLowerCase().trim();
    if (!term) return this._chats();
    return this._chats().filter((c) =>
      c.contact.name.toLowerCase().includes(term)
    );
  });

  private readonly _searchTerm = signal('');

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  getChatById(id: string): Chat | undefined {
    return this._chats().find((c) => c.id === id);
  }

  addChat(contact: Contact): void {
    const newChat: Chat = {
      id: contact.id,
      contact,
      messages: [],
      lastMessageAt: new Date(),
    };
    this._chats.update((chats) => [...chats, newChat]);
  }

  sendMessage(chatId: string, content: string): void {
    const message = this.buildMessage(content, 'user');
    this.appendMessage(chatId, message);
    this.scheduleAutoReply(chatId);
  }

  private scheduleAutoReply(chatId: string): void {
    const delay = 1000 + Math.random() * 1500;
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const message = this.buildMessage(reply, 'app');
      this.appendMessage(chatId, message);
    }, delay);
  }

  private appendMessage(chatId: string, message: Message): void {
    this._chats.update((chats) =>
      chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message], lastMessageAt: message.sentAt }
          : chat
      )
    );
  }

  private buildMessage(content: string, sender: 'user' | 'app'): Message {
    return {
      id: crypto.randomUUID(),
      content,
      sender,
      sentAt: new Date(),
    };
  }
}
