export const apiEndpoints = {
  login: '/api/login',
  articles: '/api/articles',
  comments: '/api/comments',
};

export function timestamp(): number {
  return new Date().valueOf();
}
