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

  // reactive inputs (Angular 21 signals) where appropriate
  @Input() columns = signal<Column[]>([]);
  @Input() focusMode = false; // plain boolean still OK
  @Input() focusActivity = '';

  @Output() toggleColumnCollapse = new EventEmitter<string>();
  @Output() addColumn = new EventEmitter<void>();
  @Output() editColumn = new EventEmitter<Column>();
  @Output() deleteColumn = new EventEmitter<string>();
  @Output() addTask = new EventEmitter<Column>();
  @Output() editTask = new EventEmitter<{ column: Column; task: Task }>();
  @Output() deleteTask = new EventEmitter<string>();

  collapsedColumns = signal<Set<string>>(new Set());

  isCollapsed(columnId: string): boolean {
    return this.collapsedColumns().has(columnId);
  }

  onToggleCollapse(columnId: string): void {
    const current = new Set(this.collapsedColumns());
    if (current.has(columnId)) {
      current.delete(columnId);
    } else {
      current.add(columnId);
    }
    this.collapsedColumns.set(current);
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

  trackByColumnId(index: number, column: Column): string {
    return column.columnId;
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }
}
