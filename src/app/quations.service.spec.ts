import { TestBed } from '@angular/core/testing';

import { QuationsService } from './quations.service';

describe('QuationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuationsService = TestBed.get(QuationsService);
    expect(service).toBeTruthy();
  });
});
