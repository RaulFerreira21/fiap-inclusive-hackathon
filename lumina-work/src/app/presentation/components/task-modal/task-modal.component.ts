import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '../../../domain/models/column';
import { Task } from '../../../domain/models/tasks';
import { AppStateService } from '../../../services/app-state.service';


@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent {
 
  private appState = inject(AppStateService);  

  @Input() isOpen = signal(false);
  @Input() columns = signal<Column[]>([]);
  @Input() selectedTask = signal<Task | null>(null);
  @Input() taskForm = signal({
    name: '',
    description: '',
    columnId: ''
  });

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  hideAnimations = this.appState.hideAnimations;

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.save.emit();
  }
}
