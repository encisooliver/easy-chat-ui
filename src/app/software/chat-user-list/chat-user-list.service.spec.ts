import { TestBed } from '@angular/core/testing';

import { ChatUserListService } from './chat-user-list.service';

describe('ChatUserListService', () => {
  let service: ChatUserListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatUserListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
