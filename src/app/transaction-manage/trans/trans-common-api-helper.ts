import {BaseTransaction} from './base-transaction';

export class TransCommonApiHelper {
  private static TRANS_CODE_COMMONCRUD = 'TX001';

  /**
   * 条件查询
   * @param {BaseTransaction} ref
   * @param {string} tcFuncCode
   * @param {{tablename: string; page: string; pageSize: string; condition: Array<any>}} params
   */
  public static conditionQuery(ref: BaseTransaction,
                                tcFuncCode: string,
                                params: {tablename: string, page: string,
                                         pagesize: string, params?: Array<any>, joinOps?: Array<any>}): void {
    ref.submit(TransCommonApiHelper.TRANS_CODE_COMMONCRUD, tcFuncCode, 'conditionQuery', params);
  }

  /**
   * 单表查询
   * @param {BaseTransaction} ref
   * @param {string} tcFuncCode
   * @param {{tablename: string}} params
   */
  public static query(ref: BaseTransaction,
                       tcFuncCode: string,
                       params: {tablename: string}): void {
    ref.submit(TransCommonApiHelper.TRANS_CODE_COMMONCRUD, tcFuncCode, 'query', params);
  }

  /**
   * 插入数据
   * @param {BaseTransaction} ref
   * @param {string} tcFuncCode
   * @param {{tablename: string; data: any}} params
   */
  public static insert(ref: BaseTransaction,
                               tcFuncCode: string,
                               params: {tablename: string, data: any}): void {
    ref.submit(TransCommonApiHelper.TRANS_CODE_COMMONCRUD, tcFuncCode, 'insert', params);
  }

  /**
   * 删除数据
   * @param {BaseTransaction} ref
   * @param {string} tcFuncCode
   * @param {{tablename: string; id: Array<string>}} params
   */
  public static delete(ref: BaseTransaction,
                       tcFuncCode: string,
                       params: {tablename: string, id: Array<string>}): void {
    ref.submit(TransCommonApiHelper.TRANS_CODE_COMMONCRUD, tcFuncCode, 'delete', params);
  }

  /**
   * 更新数据
   * @param {BaseTransaction} ref
   * @param {string} tcFuncCode
   * @param {{tablename: string; data: any}} params
   */
  public static update(ref: BaseTransaction,
                       tcFuncCode: string,
                       params: {tablename: string, data: any}): void {
    ref.submit(TransCommonApiHelper.TRANS_CODE_COMMONCRUD, tcFuncCode, 'update', params);
  }
}
