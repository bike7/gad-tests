import { LoginPage } from '../src/pages/login.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test('User login', async ({ page }) => {
  // Arrange
  const userEmail = 'Lenore.Hoeger@test.net';
  const userPassword = '6Selina95';
  const expectedPageTitle = 'Welcome';
  //Act
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(userEmail, userPassword);
  //Assert
  const welcomePage = new WelcomePage(page);
  const actualPageTitle = await welcomePage.title();
  expect(actualPageTitle).toContain(expectedPageTitle);
  await expect(welcomePage.welcomeMessage).toContainText(userEmail);
});
