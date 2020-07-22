import { TestBed } from '@angular/core/testing';

import { ChatCreateGroupService } from './chat-create-group.service';

describe('ChatCreateGroupService', () => {
  let service: ChatCreateGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatCreateGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
