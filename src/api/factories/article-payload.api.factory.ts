import { ArticlePayload } from '@_src/api/models/article-payload.api.model';
import { prepareRandomArticle } from '@_src/ui/factories/article.factory';

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();
  return {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: new Date().toISOString(),
    image: '.\\data\\images\\256\\mahdikordi-4hCYZT_zPu8-unsplash.jpg',
  };
}
