import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BoardService } from './board.service';

describe('BoardService', () => {
  let service: BoardService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [BoardService],
    });

    service = TestBed.inject(BoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create default column if none in storage', () => {
    const columns = service.columns();

    expect(columns.length).toBe(1);
    expect(columns[0].name).toBe('A Fazeres');
  });

  it('should add a column', () => {
    service.addColumn('Em Progresso', '#FFF');

    const columns = service.columns();

    expect(columns.length).toBe(2);
    expect(columns[1].name).toBe('Em Progresso');
  });

  it('should update a column', () => {
    const columnId = service.columns()[0].columnId;

    service.updateColumn(columnId, 'Novo Nome', '#000');

    const column = service.columns()[0];

    expect(column.name).toBe('Novo Nome');
    expect(column.color).toBe('#000');
  });

  it('should delete a column', () => {
    const columnId = service.columns()[0].columnId;

    service.deleteColumn(columnId);

    expect(service.columns().length).toBe(0);
  });

  it('should add a task', () => {
    const columnId = service.columns()[0].columnId;

    service.addTask(columnId, 'Task 1', 'Descrição');

    const tasks = service.tasks();

    expect(tasks.length).toBe(1);
    expect(tasks[0].name).toBe('Task 1');
  });

  it('should update a task', () => {
    const columnId = service.columns()[0].columnId;

    service.addTask(columnId, 'Task 1', 'Descrição');

    const taskId = service.tasks()[0].id;

    service.updateTask(taskId, 'Task Atualizada', 'Nova descrição');

    const task = service.tasks()[0];

    expect(task.name).toBe('Task Atualizada');
    expect(task.description).toBe('Nova descrição');
  });

  it('should move a task to another column', () => {
    const columnId = service.columns()[0].columnId;

    service.addColumn('Done', '#0f0');
    const newColumnId = service.columns()[1].columnId;

    service.addTask(columnId, 'Task 1', 'Descrição');

    const taskId = service.tasks()[0].id;

    service.moveTask(taskId, newColumnId);

    const task = service.tasks()[0];

    expect(task.columnId).toBe(newColumnId);
  });

  it('should delete a task', () => {
    const columnId = service.columns()[0].columnId;

    service.addTask(columnId, 'Task 1', 'Descrição');

    const taskId = service.tasks()[0].id;

    service.deleteTask(taskId);

    expect(service.tasks().length).toBe(0);
  });

  it('should return tasks by column', () => {
    const columnId = service.columns()[0].columnId;

    service.addTask(columnId, 'Task 1', 'Descrição');
    service.addTask(columnId, 'Task 2', 'Descrição');

    const tasks = service.getTasksByColumn(columnId);

    expect(tasks.length).toBe(2);
  });

  it('should remove tasks when deleting column', () => {
    const columnId = service.columns()[0].columnId;

    service.addTask(columnId, 'Task 1', 'Descrição');

    service.deleteColumn(columnId);

    expect(service.tasks().length).toBe(0);
  });
});
