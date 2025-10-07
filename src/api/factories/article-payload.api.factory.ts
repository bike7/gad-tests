import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { prepareRandomArticle } from '@_src/ui/factories/article.factory';

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();
  return {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: '2025-10-06T12:34:28.190Z',
    image: '.\\data\\images\\256\\mahdikordi-4hCYZT_zPu8-unsplash.jpg',
  };
}
