import { Component, input } from '@angular/core';
import { Contact } from '../../../core/interfaces/chat';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css',
})
export class ContactItem {
  contact = input.required<Contact>();
  active = input(false);
}
