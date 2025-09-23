import { LoginPage } from '../src/pages/login.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { testUser } from '../src/test.data/user.credentials.data';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('User login with correct credentials @GAD-R02-01', async ({ page }) => {
    // Arrange
    const userEmail = testUser.userEmail;
    const userPassword = testUser.userPassword;
    const expectedPageTitle = 'Welcome';
    //Act
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    //Assert
    const welcomePage = new WelcomePage(page);
    const actualPageTitle = await welcomePage.title();
    expect.soft(actualPageTitle).toContain(expectedPageTitle);
    await expect.soft(welcomePage.logoutButton).toBeVisible();
    await expect.soft(welcomePage.welcomeMessage).toContainText(userEmail);
  });
  test('User login with incorrect credentials @GAD-R02-01', async ({
    page,
  }) => {
    // Arrange
    const userEmail = testUser.userEmail;
    const userPassword = 'incorrectPassword';
    const expectedPageTitle = 'Login';
    const expectedErrorMessage = 'Invalid username or password';
    //Act
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(userEmail, userPassword);
    //Assert
    await expect
      .soft(loginPage.loginErrorMessage)
      .toHaveText(expectedErrorMessage);
    const actualPageTitle = await loginPage.title();
    expect.soft(actualPageTitle).toContain(expectedPageTitle);
  });
});
