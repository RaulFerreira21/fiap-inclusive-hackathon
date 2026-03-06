import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board.service';
import { Column } from '../../domain/models/column';
import { Task } from '../../domain/models/tasks';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private boardService = inject(BoardService);
  private appStateService = inject(AppStateService);

  showTaskModal = signal(false);
  showListModal = signal(false);
  showNewFocusModal = signal(false);
  selectedColumn = signal<Column | null>(null);
  selectedTask = signal<Task | null>(null);
  collapsedColumns = signal<Set<string>>(new Set());
  
  taskForm = signal({
    name: '',
    description: '',
    columnId: ''
  });

  listForm = signal({
    name: '',
    color: '#E8F0FE'
  });

  get focusMode(): boolean {
    return this.appStateService.focusMode();
  }

  get fontSize(): 'small' | 'medium' | 'large' {
    return this.appStateService.fontSize();
  }

  get clearReading(): boolean {
    return this.appStateService.clearReading();
  }

  get lowAttention(): boolean {
    return this.appStateService.lowAttention();
  }

  get guidedSteps(): boolean {
    return this.appStateService.guidedSteps();
  }

  get darkMode(): boolean {
    return this.appStateService.darkMode();
  }

  get highContrast(): boolean {
    return this.appStateService.highContrast();
  }

  get columns(): Column[] {
    return this.boardService.columns();
  }

  get focusActivity(): string {
    return localStorage.getItem('focusActivity') || '';
  }

  get openColumns() {
    return this.columns.filter(c => !this.isCollapsed(c.columnId));
  }

  ngOnInit(): void {
    this.updateOpenLists();
  }

  updateOpenLists(): void {
    const openCount = Array.isArray(this.columns) ? this.columns.filter(c => !this.isCollapsed(c.columnId)).length : 0;
    this.appStateService.setOpenLists(openCount)
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
    this.updateOpenLists();
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.boardService.getTasksByColumn(columnId);
  }

  openNewActivityModal(): void {
    if (this.columns.length === 0) {
      alert('Crie uma lista primeiro para poder adicionar atividades!');
      return;
    }
    this.openTaskModal(this.columns[0]);
  }

  openTaskModal(column: Column, task?: Task): void {
    this.selectedColumn.set(column);
    if (task) {
      this.selectedTask.set(task);
      this.taskForm.set({
        name: task.name,
        description: task.description,
        columnId: column.columnId
      });
    } else {
      this.selectedTask.set(null);
      this.taskForm.set({ 
        name: '', 
        description: '',
        columnId: column.columnId
      });
    }
    this.showTaskModal.set(true);
  }

  closeTaskModal(): void {
    this.showTaskModal.set(false);
    this.selectedColumn.set(null);
    this.selectedTask.set(null);
    this.taskForm.set({ name: '', description: '', columnId: '' });
  }

  saveTask(): void {
    const form = this.taskForm();
    const task = this.selectedTask();

    if (!form.name.trim()) return;

    const targetColumnId = form.columnId || this.selectedColumn()?.columnId;
    if (!targetColumnId) return;

    if (task) {
      this.boardService.updateTask(task.id, form.name, form.description);
    } else {
      this.boardService.addTask(targetColumnId, form.name, form.description);
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
      this.boardService.updateColumn(column.columnId, form.name, form.color);
    } else {
      this.boardService.addColumn(form.name, form.color);
    }

    this.updateOpenLists();
    this.closeListModal();
  }

  deleteList(columnId: string): void {
    if (confirm('Tem certeza que deseja excluir esta lista? Todas as tarefas serão removidas.')) {
      this.boardService.deleteColumn(columnId);
      this.updateOpenLists();
    }
  }
}
