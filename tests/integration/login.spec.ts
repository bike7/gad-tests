import { LoginUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser } from '../../src/test.data/user.credentials.data';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('User login with correct credentials @GAD-R02-01', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const welcomePage = new WelcomePage(page);
    //Act
    await loginPage.goTo();
    await loginPage.loginAs(testUser);
    //Assert
    const actualPageTitle = await welcomePage.getTitle();
    expect.soft(actualPageTitle).toContain(welcomePage.expectedPageTitle);
    await expect.soft(welcomePage.logoutButton).toBeVisible();
    await expect
      .soft(welcomePage.welcomeMessage)
      .toContainText(testUser.userEmail);
  });
  test('User login with incorrect credentials @GAD-R02-01 @negative', async ({
    page,
  }) => {
    // Arrange
    const expectedErrorMessage = 'Invalid username or password';
    const loginUserData: LoginUserModel = {
      userEmail: testUser.userEmail,
      userPassword: 'incorrectPassword',
    };
    const loginPage = new LoginPage(page);
    //Act
    await loginPage.goTo();
    await loginPage.loginAs(loginUserData);
    //Assert
    await expect
      .soft(loginPage.loginErrorMessage)
      .toHaveText(expectedErrorMessage);
    const actualPageTitle = await loginPage.getTitle();
    expect.soft(actualPageTitle).toContain(loginPage.expectedPageTitle);
  });
});
