import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-welcome',
  template: `
    <div class="welcome">
      <div class="welcome__card">
        <div class="welcome__icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p class="welcome__eyebrow">Todo listo</p>
        <h2 class="welcome__title">Seleccioná un chat para comenzar</h2>
        <p class="welcome__copy">Elegí una conversación existente o creá una nueva desde la barra lateral para empezar a intercambiar mensajes.</p>
      </div>
    </div>
  `,
  styles: [`
    .welcome {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px;
      background:
        radial-gradient(circle at top left, rgba(216, 100, 61, 0.08), transparent 24%),
        radial-gradient(circle at bottom right, rgba(45, 143, 104, 0.08), transparent 24%),
        linear-gradient(180deg, rgba(255, 252, 247, 0.96), rgba(250, 247, 241, 0.92));
    }

    .welcome__card {
      max-width: 520px;
      padding: 36px;
      border: 1px solid rgba(36, 52, 60, 0.08);
      border-radius: 32px;
      background: rgba(255, 255, 255, 0.62);
      box-shadow: var(--shadow-soft);
      text-align: center;
    }

    .welcome__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 84px;
      height: 84px;
      border-radius: 28px;
      margin-bottom: 18px;
      background: linear-gradient(135deg, rgba(216, 100, 61, 0.14), rgba(45, 143, 104, 0.14));
      color: var(--accent);
    }

    .welcome__eyebrow {
      margin: 0 0 6px;
      font-size: 0.74rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: var(--text-muted);
    }

    .welcome__title {
      margin: 0;
      font-family: 'Fraunces', Georgia, serif;
      font-size: 2rem;
      line-height: 1.1;
      color: var(--text-primary);
    }

    .welcome__copy {
      margin: 14px 0 0;
      color: var(--text-muted);
      line-height: 1.7;
      font-size: 0.96rem;
    }

    @media (max-width: 767px) {
      .welcome {
        padding: 20px;
      }

      .welcome__card {
        padding: 26px 22px;
        border-radius: 24px;
      }

      .welcome__title {
        font-size: 1.6rem;
      }
    }
  `],
})
export class ChatWelcome {}
