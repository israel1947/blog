import { TestBed } from '@angular/core/testing';

import { VaidatorService } from './vaidator.service';

describe('VaidatorService', () => {
  let service: VaidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VaidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
