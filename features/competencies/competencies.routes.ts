import { Routes } from '@angular/router';

export const COMPETENCIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./competency-list/competency-list.component').then(m => m.CompetencyListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./competency-form/competency-form.component').then(m => m.CompetencyFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./competency-detail/competency-detail.component').then(m => m.CompetencyDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./competency-form/competency-form.component').then(m => m.CompetencyFormComponent)
  }
];
