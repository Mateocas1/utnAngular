import { Injectable, computed, signal } from '@angular/core';
import {
  AuthActionResult,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '../interfaces/auth';

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
}

const ACCOUNTS_STORAGE_KEY = 'chat-app:auth:accounts';
const SESSION_STORAGE_KEY = 'chat-app:auth:session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = signal<AuthUser | null>(this.loadSession());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  login(payload: LoginPayload): AuthActionResult {
    const email = this.normalizeEmail(payload.email);
    const password = payload.password.trim();

    if (!email || !password) {
      return { ok: false, message: 'Completá email y contraseña.' };
    }

    const account = this.getAccounts().find(
      (item) => item.email === email && item.password === password
    );

    if (!account) {
      return { ok: false, message: 'Credenciales inválidas.' };
    }

    this.startSession(account);
    return { ok: true };
  }

  register(payload: RegisterPayload): AuthActionResult {
    const name = payload.name.trim();
    const email = this.normalizeEmail(payload.email);
    const password = payload.password.trim();

    if (name.length < 2) {
      return { ok: false, message: 'El nombre debe tener al menos 2 caracteres.' };
    }

    if (!this.isValidEmail(email)) {
      return { ok: false, message: 'Ingresá un email válido.' };
    }

    if (password.length < 8) {
      return { ok: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    }

    const accounts = this.getAccounts();
    if (accounts.some((item) => item.email === email)) {
      return { ok: false, message: 'Ya existe una cuenta con ese email.' };
    }

    const newAccount: StoredAccount = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };

    this.saveAccounts([newAccount, ...accounts]);
    this.startSession(newAccount);
    return { ok: true };
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  private startSession(account: StoredAccount): void {
    const user: AuthUser = {
      id: account.id,
      name: account.name,
      email: account.email,
    };

    this._currentUser.set(user);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  }

  private getAccounts(): StoredAccount[] {
    try {
      const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (!raw) return [];

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .map((value) => this.normalizeStoredAccount(value))
        .filter((account): account is StoredAccount => account !== null);
    } catch {
      return [];
    }
  }

  private saveAccounts(accounts: StoredAccount[]): void {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  }

  private loadSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;

      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;

      const user = parsed as Record<string, unknown>;
      if (
        typeof user['id'] !== 'string' ||
        typeof user['name'] !== 'string' ||
        typeof user['email'] !== 'string'
      ) {
        return null;
      }

      return {
        id: user['id'],
        name: user['name'],
        email: user['email'],
      };
    } catch {
      return null;
    }
  }

  private normalizeStoredAccount(value: unknown): StoredAccount | null {
    if (!value || typeof value !== 'object') return null;

    const account = value as Record<string, unknown>;
    if (
      typeof account['id'] !== 'string' ||
      typeof account['name'] !== 'string' ||
      typeof account['email'] !== 'string' ||
      typeof account['password'] !== 'string'
    ) {
      return null;
    }

    return {
      id: account['id'],
      name: account['name'],
      email: account['email'],
      password: account['password'],
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
