import { TestBed } from '@angular/core/testing';

import { OwnerAuthGuard } from './owner-auth-guard.service';

describe('OwnerAuthGaurdService', () => {
  let service: OwnerAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerAuthGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
