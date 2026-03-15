import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-welcome',
  template: `
    <div class="welcome">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
           stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <p>Seleccioná un chat para comenzar</p>
    </div>
  `,
  styles: [`
    .welcome {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--text-muted);
      font-size: 0.95rem;
      background-color: var(--main-bg);
    }
  `],
})
export class ChatWelcome {}
