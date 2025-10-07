import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiEndpoints } from '@_src/api/utils/api.util';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function createCommentViaApi(
  request: APIRequestContext,
  headers: Headers,
  commentData: CommentPayload,
): Promise<APIResponse> {
  const commentResponse = await request.post(apiEndpoints.comments, {
    headers: headers,
    data: commentData,
  });
  //Verify comment exists
  const comment = await commentResponse.json();
  await expect(async () => {
    const responseVerify = await request.get(
      `${apiEndpoints.comments}/${comment.id}`,
    );
    await expect(responseVerify).toBeOK();
  }).toPass();
  return commentResponse;
}
