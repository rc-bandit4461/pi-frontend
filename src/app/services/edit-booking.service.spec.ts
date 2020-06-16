import { TestBed } from '@angular/core/testing';

import { EditBookingService } from './edit-booking.service';

describe('EditBookingService', () => {
  let service: EditBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
