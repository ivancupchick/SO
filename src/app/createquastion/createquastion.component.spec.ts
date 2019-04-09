import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatequastionComponent } from './createquastion.component';

describe('CreatequastionComponent', () => {
  let component: CreatequastionComponent;
  let fixture: ComponentFixture<CreatequastionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatequastionComponent ]
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
