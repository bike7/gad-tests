import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { CommentsRequest } from '@_src/api/requests/comments.request';
import { APIResponse, expect } from '@playwright/test';

export async function createCommentViaApi(
  commentsRequest: CommentsRequest,
  commentData: CommentPayload,
): Promise<APIResponse> {
  const commentResponse = await commentsRequest.post(commentData);
  //Verify comment exists
  const comment = await commentResponse.json();
  await expect(async () => {
    const responseVerify = await commentsRequest.get(comment.id);
    await expect(responseVerify).toBeOK();
  }).toPass();
  return commentResponse;
}
