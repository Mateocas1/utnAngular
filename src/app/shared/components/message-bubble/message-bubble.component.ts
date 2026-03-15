import { Component, input } from '@angular/core';
import { Message } from '../../../core/interfaces/message';
import { TimeFormat } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-message-bubble',
  imports: [TimeFormat],
  templateUrl: './message-bubble.component.html',
  styleUrl: './message-bubble.component.css',
})
export class MessageBubble {
  message = input.required<Message>();
}
