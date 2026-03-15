import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';
import { ContactItem } from '../../shared/components/contact-item/contact-item.component';

@Component({
  selector: 'app-chat-list',
  imports: [RouterLink, RouterLinkActive, FormsModule, ContactItem],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatList {
  private readonly chatService = inject(ChatService);
  private readonly router = inject(Router);

  readonly chats = this.chatService.filteredChats;
  searchTerm = '';

  onSearchChange(): void {
    this.chatService.setSearchTerm(this.searchTerm);
  }

  navigateToNew(): void {
    this.router.navigate(['/nuevo']);
  }
}
