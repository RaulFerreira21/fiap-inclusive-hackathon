import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board.service';
import { Column } from '../../domain/models/column';
import { Task } from '../../domain/models/tasks';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private boardService = inject(BoardService);

  showTaskModal = signal(false);
  showListModal = signal(false);
  selectedColumn = signal<Column | null>(null);
  selectedTask = signal<Task | null>(null);
  collapsedColumns = signal<Set<string>>(new Set());
  
  taskForm = signal({
    name: '',
    description: ''
  });

  listForm = signal({
    name: '',
    color: '#E8F0FE'
  });

  get columns(): Column[] {
    return this.boardService.columns();
  }

  get focusActivity(): string {
    return localStorage.getItem('focusActivity') || '';
  }

  isCollapsed(columnId: string): boolean {
    return this.collapsedColumns().has(columnId);
  }

  toggleCollapse(columnId: string): void {
    const current = new Set(this.collapsedColumns());
    if (current.has(columnId)) {
      current.delete(columnId);
    } else {
      current.add(columnId);
    }
    this.collapsedColumns.set(current);
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.boardService.getTasksByColumn(columnId);
  }

  openTaskModal(column: Column, task?: Task): void {
    this.selectedColumn.set(column);
    if (task) {
      this.selectedTask.set(task);
      this.taskForm.set({
        name: task.name,
        description: task.description
      });
    } else {
      this.selectedTask.set(null);
      this.taskForm.set({ name: '', description: '' });
    }
    this.showTaskModal.set(true);
  }

  closeTaskModal(): void {
    this.showTaskModal.set(false);
    this.selectedColumn.set(null);
    this.selectedTask.set(null);
    this.taskForm.set({ name: '', description: '' });
  }

  saveTask(): void {
    const form = this.taskForm();
    const column = this.selectedColumn();
    const task = this.selectedTask();

    if (!form.name.trim() || !column) return;

    if (task) {
      // Editar tarefa existente
      this.boardService.updateTask(task.id, form.name, form.description);
    } else {
      // Criar nova tarefa
      this.boardService.addTask(column.columnId, form.name, form.description);
    }

    this.closeTaskModal();
  }

  deleteTask(taskId: string): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.boardService.deleteTask(taskId);
    }
  }

  openListModal(column?: Column): void {
    if (column) {
      this.selectedColumn.set(column);
      this.listForm.set({
        name: column.name,
        color: column.color
      });
    } else {
      this.selectedColumn.set(null);
      this.listForm.set({ name: '', color: '#E8F0FE' });
    }
    this.showListModal.set(true);
  }

  closeListModal(): void {
    this.showListModal.set(false);
    this.selectedColumn.set(null);
    this.listForm.set({ name: '', color: '#E8F0FE' });
  }

  saveList(): void {
    const form = this.listForm();
    const column = this.selectedColumn();

    if (!form.name.trim()) return;

    if (column) {
      // Editar lista existente
      this.boardService.updateColumn(column.columnId, form.name, form.color);
    } else {
      // Criar nova lista
      this.boardService.addColumn(form.name, form.color);
    }

    this.closeListModal();
  }

 deleteList(columnId: string): void {
    if (confirm('Tem certeza que deseja excluir esta lista? Todas as tarefas serão removidas.')) {
      this.boardService.deleteColumn(columnId);
    }
  }
}
