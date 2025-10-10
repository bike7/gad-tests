import { STORAGE_STATE } from '@_pw-config';
import { expect, test as setup } from '@_src/merge.fixture';
import { testUser } from '@_src/ui/test.data/user.credentials.data';

setup('Login and save session', async ({ loginPage, page }) => {
  //Act
  const welcomePage = await loginPage.loginAs(testUser);
  //Assert
  await expect(welcomePage.welcomeMessage).toContainText(testUser.userEmail);
  await page.context().storageState({ path: STORAGE_STATE });
});
