import { LoginUserModel } from '@_src/models/user.model';
import { LoginPage } from '@_src/pages/login.page';
import { testUser } from '@_src/test.data/user.credentials.data';
import { expect, test } from '@playwright/test';

test.describe('Verify login', () => {
  test('User login with correct credentials @GAD-R02-01', async ({ page }) => {
    // Arrange
    //Act
    const loginPage = await new LoginPage(page).goTo();
    const welcomePage = await loginPage.loginAs(testUser);
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
    //Act
    const loginPage = await new LoginPage(page).goTo();
    await loginPage.loginAs(loginUserData);
    //Assert
    await expect
      .soft(loginPage.loginErrorMessage)
      .toHaveText(expectedErrorMessage);
    const actualPageTitle = await loginPage.getTitle();
    expect.soft(actualPageTitle).toContain(loginPage.expectedPageTitle);
  });
});
