export interface TransactionActionHook {
  onEnterAfter(): void;
  onSubmitBefore(): boolean;
}
