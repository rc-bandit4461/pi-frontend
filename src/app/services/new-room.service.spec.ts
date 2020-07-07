import { TestBed } from '@angular/core/testing';

import { NewRoomService } from './new-room.service';

describe('NewRoomService', () => {
  let service: NewRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
