import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuastionsComponent } from './quastions.component';

describe('QuastionsComponent', () => {
  let component: QuastionsComponent;
  let fixture: ComponentFixture<QuastionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuastionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuastionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
