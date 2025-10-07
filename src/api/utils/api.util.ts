import { prepareRandomArticle } from '@_src/ui/factories/article.factory';
import { prepareRandomComment } from '@_src/ui/factories/comment.factory';
import { testUser } from '@_src/ui/test.data/user.credentials.data';
import { APIRequestContext } from '@playwright/test';

export const apiEndpoints = {
  login: '/api/login',
  articles: '/api/articles',
  comments: '/api/comments',
};

export interface Headers {
  [key: string]: string;
}
export interface ArticlePayload {
  title: string;
  body: string;
  date: string;
  image: string;
}

export interface CommentPayload {
  article_id: number;
  body: string;
  date: string;
}

export async function getAuthorizationHeader(
  request: APIRequestContext,
): Promise<Headers> {
  const userData = {
    email: testUser.userEmail,
    password: testUser.userPassword,
  };
  const response = await request.post(apiEndpoints.login, {
    data: userData,
  });
  const body = await response.json();
  const accessToken = body.access_token;
  return { Authorization: `Bearer ${accessToken}` };
}

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();
  return {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: '2025-10-06T12:34:28.190Z',
    image: '.\\data\\images\\256\\mahdikordi-4hCYZT_zPu8-unsplash.jpg',
  };
}

export function prepareCommentPayload(articleId: number): CommentPayload {
  const randomCommentData = prepareRandomComment();
  return {
    article_id: articleId,
    body: randomCommentData.body,
    date: '2025-10-06T12:34:28.190Z',
  };
}
