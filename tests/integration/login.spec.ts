import { expect, test } from '@_src/fixtures/merge.fixture';
import { LoginUserModel } from '@_src/models/user.model';
import { testUser } from '@_src/test.data/user.credentials.data';

test.describe('Verify login', () => {
  test('User login with correct credentials @GAD-R02-01', async ({
    loginPage,
  }) => {
    // Arrange
    //Act
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
    loginPage,
  }) => {
    // Arrange
    const expectedErrorMessage = 'Invalid username or password';
    const loginUserData: LoginUserModel = {
      userEmail: testUser.userEmail,
      userPassword: 'incorrectPassword',
    };
    //Act
    await loginPage.loginAs(loginUserData);
    //Assert
    await expect
      .soft(loginPage.loginErrorMessage)
      .toHaveText(expectedErrorMessage);
    const actualPageTitle = await loginPage.getTitle();
    expect.soft(actualPageTitle).toContain(loginPage.expectedPageTitle);
  });
});
