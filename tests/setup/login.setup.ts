import { STORAGE_STATE } from '@_pw-config';
import { LoginPage } from '@_src/pages/login.page';
import { WelcomePage } from '@_src/pages/welcome.page';
import { testUser } from '@_src/test.data/user.credentials.data';
import { expect, test as setup } from '@playwright/test';

setup('Login and save session', async ({ page }) => {
  // Arrange
  const loginPage = await new LoginPage(page).goTo();
  const welcomePage = new WelcomePage(page);
  //Act
  await loginPage.loginAs(testUser);
  //Assert
  await expect(welcomePage.welcomeMessage).toContainText(testUser.userEmail);
  await page.context().storageState({ path: STORAGE_STATE });
});
