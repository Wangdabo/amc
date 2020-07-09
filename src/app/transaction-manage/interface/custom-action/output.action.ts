import {ServiceResult} from 'tms-platform';

export interface OutputAction {
  customOutput(data: ServiceResult, tcFuncCode: string): void;
}

export function instanceOfOutputAction(object: any) {
  if ('customOutput' in object) {
    return true;
  }
  return false;
}
