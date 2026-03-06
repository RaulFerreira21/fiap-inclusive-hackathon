import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { BoardService } from '../../services/board.service';
import { AppStateService } from '../../services/app-state.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockColumns = [
    { columnId: '1', name: 'Todo', color: '#fff' },
    { columnId: '2', name: 'Done', color: '#000' },
  ];

  const boardServiceMock = {
    columns: vi.fn(() => mockColumns),
    getTasksByColumn: vi.fn(() => []),
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    addColumn: vi.fn(),
    updateColumn: vi.fn(),
    deleteColumn: vi.fn(),
  };

  const appStateMock = {
    focusMode: vi.fn(() => false),
    fontSize: vi.fn(() => 'medium'),
    clearReading: vi.fn(() => false),
    lowAttention: vi.fn(() => false),
    guidedSteps: vi.fn(() => false),
    darkMode: vi.fn(() => false),
    highContrast: vi.fn(() => false),
    setOpenLists: vi.fn(),
  };

  beforeEach(async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('Deep Work');

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: BoardService, useValue: boardServiceMock },
        { provide: AppStateService, useValue: appStateMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return columns from boardService', () => {
    expect(component.columns.length).toBe(2);
  });

  it('should calculate openColumns correctly', () => {
    component.collapsedColumns.set(new Set(['1']));
    expect(component.openColumns.length).toBe(1);
  });

  it('should toggle column collapse', () => {
    component.toggleCollapse('1');
    expect(component.isCollapsed('1')).toBe(true);

    component.toggleCollapse('1');
    expect(component.isCollapsed('1')).toBe(false);
  });

  it('should open task modal for new task', () => {
    component.openTaskModal(mockColumns[0]);

    expect(component.showTaskModal()).toBe(true);
    expect(component.selectedColumn()?.columnId).toBe('1');
  });

  it('should save new task', () => {
    component.openTaskModal(mockColumns[0]);
    component.taskForm.set({
      name: 'Nova Task',
      description: 'Desc',
      columnId: '1',
    });

    component.saveTask();

    expect(boardServiceMock.addTask).toHaveBeenCalledWith('1', 'Nova Task', 'Desc');
  });

  it('should update existing task', () => {
    const task = { id: 't1', name: 'Old', description: 'Old desc' };

    component.openTaskModal(mockColumns[0], task as any);

    component.taskForm.set({
      name: 'Updated',
      description: 'Updated desc',
      columnId: '1',
    });

    component.saveTask();

    expect(boardServiceMock.updateTask).toHaveBeenCalledWith('t1', 'Updated', 'Updated desc');
  });

  it('should delete task when confirmed', () => {
    component.deleteTask('t1');

    expect(boardServiceMock.deleteTask).toHaveBeenCalledWith('t1');
  });

  it('should add new column', () => {
    component.openListModal();
    component.listForm.set({ name: 'Nova Lista', color: '#123456' });
    component.saveList();

    expect(boardServiceMock.addColumn).toHaveBeenCalledWith('Nova Lista', '#123456');
  });

  it('should update existing column', () => {
    component.openListModal(mockColumns[0]);
    component.listForm.set({ name: 'Atualizada', color: '#000000' });
    component.saveList();

    expect(boardServiceMock.updateColumn).toHaveBeenCalledWith('1', 'Atualizada', '#000000');
  });

  it('should delete column when confirmed', () => {
    component.deleteList('1');

    expect(boardServiceMock.deleteColumn).toHaveBeenCalledWith('1');
  });

  it('should return focusActivity from localStorage', () => {
    expect(component.focusActivity).toBe('Deep Work');
  });
});
