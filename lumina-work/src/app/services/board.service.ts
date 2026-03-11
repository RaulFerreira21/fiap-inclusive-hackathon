import { Injectable, signal } from '@angular/core';
import { Column } from '../domain/models/column';
import { Task } from '../domain/models/tasks';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly STORAGE_KEY_COLUMNS = 'lumina_columns';
  private readonly STORAGE_KEY_TASKS = 'lumina_tasks';
  private readonly STORAGE_KEY_COLLAPSED = 'lumina_collapsed_columns';

  columns = signal<Column[]>([]);
  tasks = signal<Task[]>([]);
  collapsedColumns = signal<Set<string>>(new Set());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const savedColumns = localStorage.getItem(this.STORAGE_KEY_COLUMNS);
    const savedTasks = localStorage.getItem(this.STORAGE_KEY_TASKS);
    const savedCollapsed = localStorage.getItem(this.STORAGE_KEY_COLLAPSED);

    if (savedColumns) {
      this.columns.set(JSON.parse(savedColumns));
    } else {
    
      const defaultColumns: Column[] = [
        { columnId: '1', name: 'Backlog', color: '#E8F0FE' },
        { columnId: '3', name: 'Desenvolvimento', color: '#9CA4A4' },
        { columnId: '4', name: 'Concluídas', color: '#E6F4EA' },
      ];
      this.columns.set(defaultColumns);
      this.saveColumns();
    }

    if (savedTasks) {
      this.tasks.set(JSON.parse(savedTasks));
    }

    if (savedCollapsed) {
      try {
        const collapsedArray = JSON.parse(savedCollapsed);
        this.collapsedColumns.set(new Set(collapsedArray));
      } catch (e) {
        console.error('[BoardService] Erro ao carregar estado de colapso:', e);
      }
    }
  }

  private saveColumns(): void {
    localStorage.setItem(this.STORAGE_KEY_COLUMNS, JSON.stringify(this.columns()));
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY_TASKS, JSON.stringify(this.tasks()));
  }

  private saveCollapsedState(): void {
    localStorage.setItem(this.STORAGE_KEY_COLLAPSED, JSON.stringify(Array.from(this.collapsedColumns())));
  }


  addColumn(name: string, color: string): void {
    const newColumn: Column = {
      columnId: this.generateId(),
      name,
      color,
    };
    this.columns.update((cols) => [...cols, newColumn]);
    this.saveColumns();
  }

  updateColumn(columnId: string, name: string, color: string): void {
    this.columns.update((cols) =>
      cols.map((col) => (col.columnId === columnId ? { ...col, name, color } : col)),
    );
    this.saveColumns();
  }

  deleteColumn(columnId: string): void {
    this.tasks.update((tasks) => tasks.filter((t) => t.columnId !== columnId));
    this.saveTasks();

    this.columns.update((cols) => cols.filter((col) => col.columnId !== columnId));
    this.saveColumns();
  }

  addTask(columnId: string, name: string, description: string): void {
    const newTask: Task = {
      id: this.generateId(),
      columnId,
      name,
      description,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
    this.saveTasks();
  }

  updateTask(taskId: string, name: string, description: string): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, name, description } : task)),
    );
    this.saveTasks();
  }

  moveTask(taskId: string, newColumnId: string): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, columnId: newColumnId } : task)),
    );
    this.saveTasks();
  }

  deleteTask(taskId: string): void {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== taskId));
    this.saveTasks();
  }

  toggleTaskComplete(taskId: string): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    this.saveTasks();
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.tasks().filter((task) => task.columnId === columnId);
  }

  getUncompletedTasksByColumn(columnId: string): Task[] {
    return this.tasks().filter(task => task.columnId === columnId && !task.completed);
  }

  getColumnsWithPendingTasks(): Column[] {
    return this.columns().filter(column => {
      const pendingTasks = this.getUncompletedTasksByColumn(column.columnId);
      return pendingTasks.length > 0;
    });
  }


  toggleColumnCollapse(columnId: string): void {
    const current = new Set(this.collapsedColumns());
    if (current.has(columnId)) {
      current.delete(columnId);
    } else {
      current.add(columnId);
    }
    this.collapsedColumns.set(current);
    this.saveCollapsedState();
  }

  isColumnCollapsed(columnId: string): boolean {
    return this.collapsedColumns().has(columnId);
  }


  hasExpandedColumnsWithPendingTasks(): boolean {
    return this.columns().some(column => {
      const isCollapsed = this.isColumnCollapsed(column.columnId);
      if (isCollapsed) return false;
      
      const pendingTasks = this.getUncompletedTasksByColumn(column.columnId);
      return pendingTasks.length > 0;
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
