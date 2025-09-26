import { AddArticleModel } from '../models/article.model';
import { faker } from '@faker-js/faker/locale/en';

export function randomNewArticleData(): AddArticleModel {
  const article: AddArticleModel = {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(10),
  };
  return article;
}
