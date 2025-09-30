import { AddArticleModel } from '@_src/models/article.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomArticle(titleLength?: number): AddArticleModel {
  const article: AddArticleModel = {
    title: titleLength
      ? faker.string.alpha(titleLength)
      : faker.lorem.sentence(),
    body: faker.lorem.paragraph(10),
  };
  return article;
}
