import { TestBed } from '@angular/core/testing';

import { StorgeServicesService } from './storge-services.service';

describe('StorgeServicesService', () => {
  let service: StorgeServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorgeServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
