import { TestBed } from '@angular/core/testing';

import { Competency } from './competency';

describe('Competency', () => {
  let service: Competency;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Competency);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
