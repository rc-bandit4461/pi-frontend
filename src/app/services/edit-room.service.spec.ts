import { TestBed } from '@angular/core/testing';

import { EditRoomService } from './edit-room.service';

describe('EditRoomService', () => {
  let service: EditRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
