import { CommentPayload } from '@_src/api/models/comment-payload.api.model';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  return {
    article_id: articleId,
    body: randomCommentData.body,
    date: new Date().toISOString(),
  };
}
