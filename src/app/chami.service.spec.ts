import { TestBed } from '@angular/core/testing';

import { ChamiService } from './chami.service';

describe('ChamiService', () => {
  let service: ChamiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChamiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
