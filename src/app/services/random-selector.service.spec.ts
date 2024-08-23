import { TestBed } from '@angular/core/testing';

import { RandomSelectorService } from './random-selector.service';

describe('RandomSelectorService', () => {
  let service: RandomSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
