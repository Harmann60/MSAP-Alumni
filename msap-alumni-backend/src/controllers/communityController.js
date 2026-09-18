import { CommunityService } from '../services/communityService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CommunityController {
  static async list(_req, res, next) {
    try {
      const groups = await CommunityService.list();
      return ApiResponse.success(res, groups, 'Community groups retrieved');
    } catch (error) {
      next(error);
    }
  }
}
