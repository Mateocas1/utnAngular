import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chats',
    pathMatch: 'full',
  },
  {
    path: 'chats',
    loadComponent: () =>
      import('./features/chat-welcome/chat-welcome.component').then((m) => m.ChatWelcome),
  },
  {
    path: 'chats/:id',
    loadComponent: () =>
      import('./features/chat-window/chat-window.component').then((m) => m.ChatWindow),
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./features/new-chat/new-chat.component').then((m) => m.NewChat),
  },
  {
    path: '**',
    redirectTo: 'chats',
  },
];
