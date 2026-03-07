import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Column } from '../../../domain/models/column';
import { Task } from '../../../domain/models/tasks';
import { AppStateService } from '../../../services/app-state.service';
import { BoardService } from '../../../services/board.service';
import { GuidedStepsService } from '../../../services/guided-steps.service';
import { BoardComponent } from '../../components/board/board.component';
import { ListModalComponent } from '../../components/list-modal/list-modal.component';
import { TaskModalComponent } from '../../components/task-modal/task-modal.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskModalComponent, ListModalComponent, BoardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private boardService = inject(BoardService);
  private appStateService = inject(AppStateService);
  private guidedStepsService = inject(GuidedStepsService);

  showTaskModal = signal(false);
  showListModal = signal(false);
  showNewFocusModal = signal(false);
  selectedColumn = signal<Column | null>(null);
  selectedTask = signal<Task | null>(null);
  
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

  get currentGuidedStep(): number {
    return this.guidedStepsService.currentStep();
  }

  get darkMode(): boolean {
    return this.appStateService.darkMode();
  }

  get highContrast(): boolean {
    return this.appStateService.highContrast();
  }

  get hideAnimations(): boolean {
    return this.appStateService.hideAnimations();
  }

  get focusModeEnabled(): boolean {
    return this.appStateService.focusModeEnabled();
  }

  // ============ GETTERS DO BoardService ============
  get columns(): Column[] {
    return this.boardService.columns();
  }
  /** expose the raw signal for child inputs that expect a Signal */
  columnsSignal = this.boardService.columns;

  get focusActivity(): string {
    return localStorage.getItem('focusActivity') || '';
  }

  // Prevent unused import warnings for dynamically referenced components
  protected readonly TaskModal = TaskModalComponent;
  protected readonly ListModal = ListModalComponent;
  protected readonly Board = BoardComponent;

  onToggleColumnCollapse(_columnId: string): void {
    // Update openLists count when column collapse state changes
    const openCount = this.columns.length;
    this.appStateService.setOpenLists(openCount);
  }
  ngOnInit(): void {
    // Verifica se deve ativar o modo foco automaticamente
    this.checkFocusModeActivation();
  }

  private checkFocusModeActivation(): void {
    // Se o modo foco estiver habilitado e houver tarefas pendentes, ativa automaticamente
    if (this.focusModeEnabled && !this.focusMode) {
      const columnsWithPendingTasks = this.boardService.getColumnsWithPendingTasks();
      if (columnsWithPendingTasks.length > 0) {
        this.appStateService.setFocusMode(true);
      }
    }
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

    this.closeListModal();
  }

  deleteList(columnId: string): void {
    if (confirm('Tem certeza que deseja excluir esta lista? Todas as tarefas serão removidas.')) {
      this.boardService.deleteColumn(columnId);
    }
  }

  toggleTaskComplete(taskId: string): void {
    this.boardService.toggleTaskComplete(taskId);
    
    // Se estiver em modo foco, verifica se ainda há tarefas pendentes
    if (this.focusMode) {
      const columnsWithPendingTasks = this.boardService.getColumnsWithPendingTasks();
      if (columnsWithPendingTasks.length === 0) {
        // Não há mais tarefas pendentes, desativa o modo foco
        this.appStateService.setFocusMode(false);
      }
    }
  }

  nextGuidedStep(): void {
    this.guidedStepsService.nextStep();
  }
}
