import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { Contact, ContactStatus } from '../../core/interfaces/chat';

@Component({
  selector: 'app-new-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.css',
})
export class NewChat {
  private readonly chatService = inject(ChatService);
  private readonly router = inject(Router);

  readonly statuses: { value: ContactStatus; label: string }[] = [
    { value: 'online', label: 'En línea' },
    { value: 'away', label: 'Ausente' },
    { value: 'offline', label: 'Desconectado' },
  ];

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(40),
    ]),
    status: new FormControl<ContactStatus>('online', Validators.required),
  });

  get nameErrors(): boolean {
    const ctrl = this.form.controls.name;
    return ctrl.invalid && ctrl.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, status } = this.form.value;
    const seed = encodeURIComponent(name!.replace(/\s+/g, ''));
    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: name!.trim(),
      avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`,
      status: status!,
    };

    this.chatService.addChat(newContact);
    this.router.navigate(['/chats', newContact.id]);
  }

  cancel(): void {
    this.router.navigate(['/chats']);
  }
}
