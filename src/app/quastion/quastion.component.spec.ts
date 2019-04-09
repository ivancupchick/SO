import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuastionComponent } from './quastion.component';

describe('QuastionComponent', () => {
  let component: QuastionComponent;
  let fixture: ComponentFixture<QuastionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuastionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuastionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
