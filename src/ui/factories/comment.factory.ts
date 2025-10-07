import { AddCommentModel } from '@_src/ui/models/comment.model';
import { faker } from '@faker-js/faker/locale/en';

export function prepareRandomComment(): AddCommentModel {
  const comment: AddCommentModel = { body: faker.lorem.sentence() };
  return comment;
}
