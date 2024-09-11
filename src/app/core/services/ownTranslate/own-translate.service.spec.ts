import { TestBed } from '@angular/core/testing';

import { OwnTranslateService } from './own-translate.service';

describe('OwnTranslateService', () => {
  let service: OwnTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
