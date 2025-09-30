import { STORAGE_STATE } from '../../playwright.config';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser } from '../../src/test.data/user.credentials.data';
import { expect, test as setup } from '@playwright/test';

setup('Login with correct credentials', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  const welcomePage = new WelcomePage(page);
  //Act
  await loginPage.goTo();
  await loginPage.loginAs(testUser);
  //Assert
  await expect(welcomePage.welcomeMessage).toContainText(testUser.userEmail);
  await page.context().storageState({ path: STORAGE_STATE });
});
