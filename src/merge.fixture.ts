import { requestObjectTest } from '@_src/api/fixtures/request-object.fixture';
import { requestExpect } from '@_src/api/fixtures/request.expect';
import { articleTest } from '@_src/ui/fixtures/article.fixture';
import { pageObjectTest } from '@_src/ui/fixtures/page-object.fixture';
import { mergeExpects, mergeTests } from '@playwright/test';

export const test = mergeTests(pageObjectTest, requestObjectTest, articleTest);
export const expect = mergeExpects(requestExpect);
