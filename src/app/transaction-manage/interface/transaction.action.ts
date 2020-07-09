export interface TransactionAction {
  enter(): void;
  submit(data: {svcCode: string, tcFuncCode: string, funcCode: string, bdy: any}): void;
}
