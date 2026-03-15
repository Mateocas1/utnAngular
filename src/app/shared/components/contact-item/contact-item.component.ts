import { Component, input } from '@angular/core';
import { Chat } from '../../../core/interfaces/chat';
import { TimeFormat } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-contact-item',
  imports: [TimeFormat],
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css',
})
export class ContactItem {
  chat = input.required<Chat>();
}
