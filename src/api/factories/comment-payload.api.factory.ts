import { prepareRandomComment } from '@_src/ui/factories/comment.factory';

export interface CommentPayload {
  article_id: number;
  body: string;
  date: string;
}
export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  return {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2025-10-06T12:34:28.190Z',
  };
}
