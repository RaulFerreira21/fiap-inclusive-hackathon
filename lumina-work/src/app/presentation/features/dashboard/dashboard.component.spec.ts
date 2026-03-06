import { TestBed, ComponentFixture } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DashboardComponent } from './dashboard.component';
import { BoardService } from '../../../services/board.service';
import { AppStateService } from '../../../services/app-state.service';
import { Column } from '../../../domain/models/column';
import { Task } from '../../../domain/models/tasks';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockBoardService = {
    columns: vi.fn(() => [{ columnId: '1', name: 'Backlog', color: '#fff' }]),
    getTasksByColumn: vi.fn(() => []),

    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    addColumn: vi.fn(),
    updateColumn: vi.fn(),
    deleteColumn: vi.fn(),
  };

  const mockAppStateService = {
    focusMode: vi.fn(() => false),
    fontSize: vi.fn(() => 'medium'),
    clearReading: vi.fn(() => false),
    lowAttention: vi.fn(() => false),
    guidedSteps: vi.fn(() => false),
    darkMode: vi.fn(() => false),
    highContrast: vi.fn(() => false),
    hideAnimations: vi.fn(() => false),
    setOpenLists: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: AppStateService, useValue: mockAppStateService },
      ],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return columns from boardService', () => {
    const columns = component.columns;
    expect(columns.length).toBe(1);
    expect(columns[0].name).toBe('Backlog');
  });

  it('should return focusActivity from localStorage', () => {
    localStorage.setItem('focusActivity', 'Estudar Angular');
    expect(component.focusActivity).toBe('Estudar Angular');
  });

  it('should open task modal for new task', () => {
    const column: Column = { columnId: '1', name: 'Backlog', color: '#fff' };

    component.openTaskModal(column);

    expect(component.showTaskModal()).toBe(true);
    expect(component.selectedColumn()).toEqual(column);
  });

  it('should close task modal', () => {
    component.closeTaskModal();

    expect(component.showTaskModal()).toBe(false);
    expect(component.selectedColumn()).toBe(null);
  });

  it('should save new task', () => {
    const column: Column = { columnId: '1', name: 'Backlog', color: '#fff' };

    component.selectedColumn.set(column);
    component.taskForm.set({
      name: 'Nova tarefa',
      description: 'Descrição',
      columnId: '1',
    });

    component.saveTask();

    expect(mockBoardService.addTask).toHaveBeenCalled();
  });

  it('should update existing task', () => {
    const column: Column = { columnId: '1', name: 'Backlog', color: '#fff' };
    const task: Task = {
      id: '1',
      columnId: '1',
      name: 'Task',
      description: 'Desc',
    };

    component.selectedColumn.set(column);
    component.selectedTask.set(task);

    component.taskForm.set({
      name: 'Atualizada',
      description: 'Nova',
      columnId: '1',
    });

    component.saveTask();

    expect(mockBoardService.updateTask).toHaveBeenCalled();
  });

  it('should delete task when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteTask('1');

    expect(mockBoardService.deleteTask).toHaveBeenCalledWith('1');
  });

  it('should open list modal', () => {
    component.openListModal();

    expect(component.showListModal()).toBe(true);
  });

  it('should save new list', () => {
    component.listForm.set({
      name: 'Nova Lista',
      color: '#fff',
    });

    component.saveList();

    expect(mockBoardService.addColumn).toHaveBeenCalled();
  });

  it('should update existing list', () => {
    const column: Column = { columnId: '1', name: 'Backlog', color: '#fff' };

    component.selectedColumn.set(column);

    component.listForm.set({
      name: 'Atualizada',
      color: '#000',
    });

    component.saveList();

    expect(mockBoardService.updateColumn).toHaveBeenCalled();
  });

  it('should delete list when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.deleteList('1');

    expect(mockBoardService.deleteColumn).toHaveBeenCalledWith('1');
  });

  it('should update open lists count when column collapse toggles', () => {
    component.onToggleColumnCollapse('1');

    expect(mockAppStateService.setOpenLists).toHaveBeenCalled();
  });
});
