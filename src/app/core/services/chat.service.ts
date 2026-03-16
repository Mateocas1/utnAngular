import { Injectable, computed, effect, signal } from '@angular/core';
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

const CHATS_STORAGE_KEY = 'chat-app:chats';

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

function createMessage(content: string, sender: 'user' | 'app', sentAt = new Date()): Message {
  return {
    id: crypto.randomUUID(),
    content,
    sender,
    sentAt,
  };
}

function createChat(contact: Contact, messages: Message[] = []): Chat {
  return {
    id: contact.id,
    contact,
    messages,
    lastMessageAt: messages.at(-1)?.sentAt ?? contact.lastSeen ?? new Date(),
  };
}

const INITIAL_CHATS: Chat[] = [
  createChat(INITIAL_CONTACTS[0], [
    createMessage('Hola, ¿tenés un minuto para revisar el trabajo práctico?', 'app', new Date(Date.now() - 18 * 60 * 1000)),
    createMessage('Sí, mandámelo y lo veo.', 'user', new Date(Date.now() - 15 * 60 * 1000)),
  ]),
  createChat(INITIAL_CONTACTS[1], [
    createMessage('Después te respondo, estoy saliendo de clase.', 'app', new Date(Date.now() - 32 * 60 * 1000)),
  ]),
  createChat(INITIAL_CONTACTS[2], [
    createMessage('Cuando puedas, avisame y retomamos la conversación.', 'app', new Date(Date.now() - 2 * 60 * 60 * 1000)),
  ]),
];

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly _chats = signal<Chat[]>(INITIAL_CHATS);
  private readonly _typingChatId = signal<string | null>(null);

  readonly chats = this._chats.asReadonly();
  readonly typingChatId = this._typingChatId.asReadonly();

  readonly filteredChats = computed(() => {
    const term = this._searchTerm().toLowerCase().trim();
    if (!term) return this._chats();
    return this._chats().filter((c) =>
      c.contact.name.toLowerCase().includes(term)
    );
  });

  private readonly _searchTerm = signal('');

  constructor() {
    const storedChats = this.loadChatsFromStorage();
    if (storedChats) {
      this._chats.set(storedChats);
    }

    effect(() => {
      this.saveChatsToStorage(this._chats());
    });
  }

  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  getChatById(id: string): Chat | undefined {
    return this._chats().find((c) => c.id === id);
  }

  addChat(contact: Contact): void {
    this._chats.update((chats) => [createChat(contact), ...chats]);
  }

  sendMessage(chatId: string, content: string): void {
    const message: Message = { ...this.buildMessage(content, 'user'), status: 'sent' };
    this.appendMessage(chatId, message);
    this.scheduleAutoReply(chatId);
  }

  private scheduleAutoReply(chatId: string): void {
    const delay = 1000 + Math.random() * 1500;
    this._typingChatId.set(chatId);
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const message = createMessage(reply, 'app');
      this._typingChatId.set(null);
      this.appendMessage(chatId, message);
    }, delay);
  }

  private appendMessage(chatId: string, message: Message): void {
    this._chats.update((chats) =>
      chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              contact:
                message.sender === 'app' && chat.contact.status !== 'online'
                  ? { ...chat.contact, lastSeen: message.sentAt }
                  : chat.contact,
              messages: [...chat.messages, message],
              lastMessageAt: message.sentAt,
            }
          : chat
      )
    );
  }

  private buildMessage(content: string, sender: 'user' | 'app'): Message {
    return createMessage(content, sender);
  }

  private saveChatsToStorage(chats: Chat[]): void {
    try {
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
    } catch {
      // Ignore write errors (private mode, quota exceeded, etc.).
    }
  }

  private loadChatsFromStorage(): Chat[] | null {
    try {
      const raw = localStorage.getItem(CHATS_STORAGE_KEY);
      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;

      const chats = parsed
        .map((item) => this.normalizeChat(item))
        .filter((chat): chat is Chat => chat !== null);

      return chats.length > 0 ? chats : null;
    } catch {
      return null;
    }
  }

  private normalizeChat(value: unknown): Chat | null {
    if (!value || typeof value !== 'object') return null;
    const rawChat = value as Record<string, unknown>;

    if (!rawChat['contact'] || typeof rawChat['contact'] !== 'object') return null;
    const rawContact = rawChat['contact'] as Record<string, unknown>;

    if (typeof rawChat['id'] !== 'string') return null;
    if (typeof rawContact['id'] !== 'string') return null;
    if (typeof rawContact['name'] !== 'string') return null;
    if (typeof rawContact['avatarUrl'] !== 'string') return null;

    const status = rawContact['status'];
    if (status !== 'online' && status !== 'offline' && status !== 'away') return null;

    const contactLastSeen = this.parseDate(rawContact['lastSeen']);
    const contact: Contact = {
      id: rawContact['id'],
      name: rawContact['name'],
      avatarUrl: rawContact['avatarUrl'],
      status,
      ...(contactLastSeen ? { lastSeen: contactLastSeen } : {}),
    };

    const rawMessages = Array.isArray(rawChat['messages']) ? rawChat['messages'] : [];
    const messages = rawMessages
      .map((message) => this.normalizeMessage(message))
      .filter((message): message is Message => message !== null);

    const parsedLastMessageAt = this.parseDate(rawChat['lastMessageAt']);
    const lastMessageAt =
      parsedLastMessageAt ?? messages.at(-1)?.sentAt ?? contact.lastSeen ?? new Date();

    return {
      id: rawChat['id'],
      contact,
      messages,
      lastMessageAt,
    };
  }

  private normalizeMessage(value: unknown): Message | null {
    if (!value || typeof value !== 'object') return null;
    const rawMessage = value as Record<string, unknown>;

    if (typeof rawMessage['id'] !== 'string') return null;
    if (typeof rawMessage['content'] !== 'string') return null;
    if (rawMessage['sender'] !== 'user' && rawMessage['sender'] !== 'app') return null;

    const sentAt = this.parseDate(rawMessage['sentAt']);
    if (!sentAt) return null;

    const status = rawMessage['status'];
    const normalizedStatus = status === 'sending' || status === 'sent' ? status : undefined;

    return {
      id: rawMessage['id'],
      content: rawMessage['content'],
      sender: rawMessage['sender'],
      sentAt,
      ...(normalizedStatus ? { status: normalizedStatus } : {}),
    };
  }

  private parseDate(value: unknown): Date | null {
    if (value === undefined || value === null) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }
}
