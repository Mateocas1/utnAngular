import { Component, computed, effect, inject, Renderer2, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChatList } from './features/chat-list/chat-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);

  readonly isDark = signal(false);

  readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly isAuthRoute = computed(() => this.currentPath().startsWith('/auth'));
  readonly showSidebar = computed(() => this.currentPath() === '/chats');

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') this.isDark.set(true);

    effect(() => {
      const dark = this.isDark();
      if (dark) {
        this.renderer.setAttribute(document.documentElement, 'data-theme', 'dark');
      } else {
        this.renderer.removeAttribute(document.documentElement, 'data-theme');
      }
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.isDark.update((v) => !v);
  }
}
