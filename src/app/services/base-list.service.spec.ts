import { TestBed } from '@angular/core/testing';

import { BaseListService } from './base-list.service';

describe('BaseListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseListService = TestBed.get(BaseListService);
    expect(service).toBeTruthy();
  });
});
