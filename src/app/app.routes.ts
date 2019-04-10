import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, RoutesRecognized } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './header/login/login.component';
import { SignupComponent } from './header/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';
import { CreatequastionComponent } from './createquastion/createquastion.component';
import { QuastionsComponent } from './quastions/quastions.component';
import { QuastionComponent } from './quastion/quastion.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';

export const router: Routes = [
  { path: '', redirectTo: 'quastions', pathMatch: 'full' },
  { path: 'quastions', component: QuastionsComponent },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'quastion', component: CreatequastionComponent, canActivate: [AuthGuard] },
  { path: 'quastion/:id', component: QuastionComponent },
  { path: 'editquastion/:id', component: EditQuestionComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
