import { Component } from '@angular/core';

@Component({
  selector: 'app-typing-indicator',
  standalone: true,
  template: `
    <div class="typing-indicator">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    </div>
  `,
  styles: [`
    .typing-indicator {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--bubble-app-bg, #f0f0f0);
      backdrop-filter: blur(8px);
      border-radius: 18px 18px 18px 4px;
      padding: 12px 16px;
      align-self: flex-start;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-secondary, #888);
      animation: typing-bounce 1.2s ease-in-out infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing-bounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }
  `],
})
export class TypingIndicator {}
