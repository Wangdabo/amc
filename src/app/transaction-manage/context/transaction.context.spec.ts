import { TestBed, inject } from '@angular/core/testing';

import { TransactionContext } from './transaction.context';

describe('TransactionContext', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionContext]
    });
  });

  it('should be created', inject([TransactionContext], (service: TransactionContext) => {
    expect(service).toBeTruthy();
  }));
});
