import { Component, ElementRef, computed, effect, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { MessageBubble } from '../../shared/components/message-bubble/message-bubble.component';
import { Chat } from '../../core/interfaces/chat';
import { TimeFormat } from '../../shared/pipes/time-format.pipe';

function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim() ? null : { requiredTrimmed: true };
}

@Component({
  selector: 'app-chat-window',
  imports: [ReactiveFormsModule, MessageBubble, TimeFormat],
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css',
})
export class ChatWindow {
  private readonly chatService = inject(ChatService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly chatId = computed(() => this.routeParams().get('id') ?? '');

  readonly chat = computed<Chat | undefined>(() => this.chatService.getChatById(this.chatId()));

  readonly messageControl = new FormControl('', {
    nonNullable: true,
    validators: [requiredTrimmed, Validators.required, Validators.maxLength(500)],
  });

  readonly messageForm = new FormGroup({
    content: this.messageControl,
  });

  private readonly messagesEnd = viewChild<ElementRef>('messagesEnd');

  constructor() {
    effect(() => {
      this.chat()?.messages.length;
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  send(): void {
    if (this.messageForm.invalid) {
      this.messageControl.markAsTouched();
      return;
    }

    const content = this.messageControl.value.trim();
    if (!content) {
      this.messageControl.markAsTouched();
      return;
    }

    this.chatService.sendMessage(this.chatId(), content);
    this.messageControl.reset('');
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

  get showMessageError(): boolean {
    return this.messageControl.invalid && (this.messageControl.touched || this.messageControl.dirty);
  }

  private scrollToBottom(): void {
    this.messagesEnd()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
