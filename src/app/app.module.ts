import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './header/login/login.component';
import { SignupComponent } from './header/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';

import { FormsModule } from '@angular/forms';

import { routes } from './app.routes';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CreatequastionComponent } from './createquastion/createquastion.component';
import { QuastionsComponent } from './quastions/quastions.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { QuastionComponent } from './quastion/quastion.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EditQuestionComponent } from './edit-question/edit-question.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    CreatequastionComponent,
    QuastionsComponent,
    QuastionComponent,
    EditQuestionComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    FormsModule,
    routes,
    [BrowserAnimationsModule],
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatSidenavModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ LoginComponent, SignupComponent ]
})
export class AppModule { }
