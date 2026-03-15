import { Component, OnInit, computed, inject, viewChild, ElementRef, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { MessageBubble } from '../../shared/components/message-bubble/message-bubble.component';
import { Chat } from '../../core/interfaces/chat';

@Component({
  selector: 'app-chat-window',
  imports: [ReactiveFormsModule, MessageBubble],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindow implements OnInit {
  private readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private chatId = '';

  chat = computed<Chat | undefined>(() =>
    this.chatService.getChatById(this.chatId)
  );

  messageForm = new FormGroup({
    content: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  private readonly messagesEnd = viewChild<ElementRef>('messagesEnd');

  constructor() {
    effect(() => {
      const _ = this.chat()?.messages.length;
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.chatId = params.get('id') ?? '';
    });
  }

  send(): void {
    const content = this.messageForm.value.content?.trim();
    if (!content || this.messageForm.invalid) return;

    this.chatService.sendMessage(this.chatId, content);
    this.messageForm.reset();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  goBack(): void {
    this.router.navigate(['/chats']);
  }

  private scrollToBottom(): void {
    this.messagesEnd()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
