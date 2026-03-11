import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Column } from '../../../domain/models/column';
import { Task } from '../../../domain/models/tasks';
import { BoardService } from '../../../services/board.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  private boardService = inject(BoardService);


  @Input() columns = signal<Column[]>([]);
  @Input() focusMode = false; 
  @Input() focusActivity = '';
  @Input() hideAnimations = false;

  @Output() toggleColumnCollapse = new EventEmitter<string>();
  @Output() addColumn = new EventEmitter<void>();
  @Output() editColumn = new EventEmitter<Column>();
  @Output() deleteColumn = new EventEmitter<string>();
  @Output() addTask = new EventEmitter<Column>();
  @Output() editTask = new EventEmitter<{ column: Column; task: Task }>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() toggleTaskComplete = new EventEmitter<string>();

  get visibleColumns(): Column[] {
    if (this.focusMode) {
      return this.boardService.getColumnsWithPendingTasks();
    }
    return this.columns();
  }

  getVisibleTasksByColumn(columnId: string): Task[] {
    if (this.focusMode) {
      return this.boardService.getUncompletedTasksByColumn(columnId);
    }
    return this.boardService.getTasksByColumn(columnId);
  }

  isCollapsed(columnId: string): boolean {
    return this.boardService.isColumnCollapsed(columnId);
  }

  onToggleCollapse(columnId: string): void {
    if (this.focusMode) return; 
    
    this.boardService.toggleColumnCollapse(columnId);
    this.toggleColumnCollapse.emit(columnId);
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.boardService.getTasksByColumn(columnId);
  }

  onAddColumn(): void {
    this.addColumn.emit();
  }

  onEditColumn(column: Column): void {
    this.editColumn.emit(column);
  }

  onDeleteColumn(columnId: string): void {
    this.deleteColumn.emit(columnId);
  }

  onAddTask(column: Column): void {
    this.addTask.emit(column);
  }

  onEditTask(column: Column, task: Task): void {
    this.editTask.emit({ column, task });
  }

  onDeleteTask(taskId: string): void {
    this.deleteTask.emit(taskId);
  }

  onToggleTaskComplete(taskId: string): void {
    this.toggleTaskComplete.emit(taskId);
  }

  trackByColumnId(index: number, column: Column): string {
    return column.columnId;
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
