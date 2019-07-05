import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatequastionComponent } from './createquastion.component';
import { MatCardModule, MatFormFieldModule, MatIconModule, MatChipsModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

describe('CreatequastionComponent', () => {
  let component: CreatequastionComponent;
  let fixture: ComponentFixture<CreatequastionComponent>;

  beforeEach(async(() => {
    const FirestoreStub = {
      collection: (name: string) => ({
        doc: (_id: string) => ({
          valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
          set: (_d: any) => new Promise((resolve, _reject) => resolve()),
        }),
      }),
    };
    
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        MatIconModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
      declarations: [ CreatequastionComponent ],
      providers: [
        { provide: AngularFireAuth, useValue: FirestoreStub },
        { provide: AngularFireDatabase, useValue: FirestoreStub }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatequastionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
