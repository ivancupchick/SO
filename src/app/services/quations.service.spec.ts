import { TestBed } from '@angular/core/testing';

import { QuationsService } from './quations.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';

describe('QuationsService', () => {
  const FirestoreStub = {
    collection: (name: string) => ({
      doc: (_id: string) => ({
        valueChanges: () => new BehaviorSubject({ foo: 'bar' }),
        set: (_d: any) => new Promise((resolve, _reject) => resolve()),
      }),
    }),
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      AngularFireDatabaseModule
    ],
    providers: [
    { provide: AngularFireAuth, useValue: FirestoreStub },
    { provide: AngularFireDatabase, useValue: FirestoreStub }
    ]
  }));

  it('should be created', () => {
    const service: QuationsService = TestBed.get(QuationsService);
    expect(service).toBeTruthy();
  });
});
