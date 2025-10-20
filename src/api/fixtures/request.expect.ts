import { ArticlesRequest } from '@_src/api/requests/articles.request';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { MatcherReturnType, expect as baseExpect } from '@playwright/test';

export const requestExpect = baseExpect.extend({
  async getToReturnStatus(
    requestObject: ArticlesRequest | CommentsRequest,
    objectId: number,
    expectedResponseStatus: number,
  ): Promise<MatcherReturnType> {
    let message = '';
    const response = await requestObject.get(objectId);
    const actualResponseStatus = response.status();
    const isStatusCorrect = actualResponseStatus === expectedResponseStatus;
    if (!isStatusCorrect) {
      message = `Expected status code: ${expectedResponseStatus}, but received: ${actualResponseStatus}`;
    }
    return {
      message: () => message,
      pass: isStatusCorrect,
    };
  },
});
