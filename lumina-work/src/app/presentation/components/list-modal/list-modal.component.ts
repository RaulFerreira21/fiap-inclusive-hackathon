import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '../../../domain/models/column';
import { AppStateService } from '../../../services/app-state.service';

@Component({
  selector: 'app-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-modal.component.html',
  styleUrl: './list-modal.component.scss'
})
export class ListModalComponent {
  
  private appState = inject(AppStateService);  

  @Input() isOpen = signal(false);
  @Input() selectedColumn = signal<Column | null>(null);
  @Input() listForm = signal({
    name: '',
    color: '#E8F0FE'
  });

  @Output() modalClose = new EventEmitter<void>();
  @Output() modalSave = new EventEmitter<void>();

  hideAnimations = this.appState.hideAnimations;

  onClose(): void {
    this.modalClose.emit();
  }

  onSave(): void {
    this.modalSave.emit();
  }
}
