import { Injectable, signal } from '@angular/core';
import { Column } from '../domain/models/column';
import { Task } from '../domain/models/tasks';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly STORAGE_KEY_COLUMNS = 'lumina_columns';
  private readonly STORAGE_KEY_TASKS = 'lumina_tasks';

  columns = signal<Column[]>([]);
  tasks = signal<Task[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const savedColumns = localStorage.getItem(this.STORAGE_KEY_COLUMNS);
    const savedTasks = localStorage.getItem(this.STORAGE_KEY_TASKS);

    if (savedColumns) {
      this.columns.set(JSON.parse(savedColumns));
    } else {
      // Criar colunas padrão
      const defaultColumns: Column[] = [
        { columnId: '1', name: 'A Fazeres', color: '#E8F0FE' },
      ];
      this.columns.set(defaultColumns);
      this.saveColumns();
    }

    if (savedTasks) {
      this.tasks.set(JSON.parse(savedTasks));
    }
  }

  private saveColumns(): void {
    localStorage.setItem(this.STORAGE_KEY_COLUMNS, JSON.stringify(this.columns()));
  }

  private saveTasks(): void {
    localStorage.setItem(this.STORAGE_KEY_TASKS, JSON.stringify(this.tasks()));
  }

  // CRUD de Colunas
  addColumn(name: string, color: string): void {
    const newColumn: Column = {
      columnId: this.generateId(),
      name,
      color
    };
    this.columns.update(cols => [...cols, newColumn]);
    this.saveColumns();
  }

  updateColumn(columnId: string, name: string, color: string): void {
    this.columns.update(cols =>
      cols.map(col =>
        col.columnId === columnId ? { ...col, name, color } : col
      )
    );
    this.saveColumns();
  }

  deleteColumn(columnId: string): void {
    // Remover todas as tarefas da coluna
    this.tasks.update(tasks => tasks.filter(t => t.columnId !== columnId));
    this.saveTasks();
    
    // Remover coluna
    this.columns.update(cols => cols.filter(col => col.columnId !== columnId));
    this.saveColumns();
  }

  // CRUD de Tarefas
  addTask(columnId: string, name: string, description: string): void {
    const newTask: Task = {
      id: this.generateId(),
      columnId,
      name,
      description
    };
    this.tasks.update(tasks => [...tasks, newTask]);
    this.saveTasks();
  }

  updateTask(taskId: string, name: string, description: string): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, name, description } : task
      )
    );
    this.saveTasks();
  }

  moveTask(taskId: string, newColumnId: string): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, columnId: newColumnId } : task
      )
    );
    this.saveTasks();
  }

  deleteTask(taskId: string): void {
    this.tasks.update(tasks => tasks.filter(t => t.id !== taskId));
    this.saveTasks();
  }

  getTasksByColumn(columnId: string): Task[] {
    return this.tasks().filter(task => task.columnId === columnId);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
