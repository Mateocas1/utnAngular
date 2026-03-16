import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth-page/auth-page.component').then((m) => m.AuthPage),
  },
  {
    path: 'chats',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/chat-welcome/chat-welcome.component').then((m) => m.ChatWelcome),
  },
  {
    path: 'chats/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/chat-window/chat-window.component').then((m) => m.ChatWindow),
  },
  {
    path: 'nuevo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/new-chat/new-chat.component').then((m) => m.NewChat),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
