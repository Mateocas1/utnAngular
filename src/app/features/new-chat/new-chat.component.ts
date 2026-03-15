import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../core/services/chat.service';
import { Contact, ContactStatus } from '../../core/interfaces/chat';

function requiredTrimmed(control: AbstractControl): ValidationErrors | null {
  return control.value?.trim() ? null : { requiredTrimmed: true };
}

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

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        requiredTrimmed,
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(40),
      ],
    }),
    status: new FormControl<ContactStatus>('online', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  get nameControl(): FormControl<string> {
    return this.form.controls.name;
  }

  get nameErrors(): boolean {
    return this.nameControl.invalid && this.nameControl.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const name = this.nameControl.value.trim();
    const status = this.form.controls.status.value;
    const seed = encodeURIComponent(name.replace(/\s+/g, ''));
    const newContact: Contact = {
      id: crypto.randomUUID(),
      name,
      avatarUrl: `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}`,
      status,
      lastSeen: status === 'online' ? undefined : new Date(),
    };

    this.chatService.addChat(newContact);
    this.router.navigate(['/chats', newContact.id]);
  }

  cancel(): void {
    this.router.navigate(['/chats']);
  }
}
