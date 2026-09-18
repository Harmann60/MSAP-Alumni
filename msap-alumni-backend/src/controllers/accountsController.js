import { AccountsService } from '../services/accountsService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class AccountsController {
  static async getSummary(_req, res, next) {
    try {
      const summary = await AccountsService.getSummary();
      return ApiResponse.success(res, summary, 'Financial summary retrieved');
    } catch (error) {
      next(error);
    }
  }
}
