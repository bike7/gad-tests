import { prepareRandomUser } from '@_src/factories/user.factory';
import { RegisterUserModel } from '@_src/models/user.model';
import { RegisterPage } from '@_src/pages/register.page';
import { testUser } from '@_src/test.data/user.credentials.data';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUserModel;
  test.beforeEach(async ({ page }) => {
    registerUserData = prepareRandomUser();
    registerPage = await new RegisterPage(page).goTo();
  });

  test('Register new user using required fields and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({}) => {
    // Arrange
    const expectedAlertText = 'User created';
    //Act
    const loginPage = await registerPage.registerAs(registerUserData);
    //Assert registration confirmation popup
    const actualAlert = registerPage.alertPopup;
    await expect(actualAlert).toHaveText(expectedAlertText);
    //Assert login page load after registration
    await loginPage.waitForPageToLoadUrl();
    const actualLoginPageTitle = await loginPage.getTitle();
    expect(actualLoginPageTitle).toContain(loginPage.expectedPageTitle);
    //Assert login with registered user
    const welcomePage = await loginPage.loginAs(testUser);
    await expect(welcomePage.welcomeMessage).toContainText(testUser.userEmail);
  });
  test('Try to register a new user using incorrect data - non valid email @GAD-R03-04 @negative', async ({}) => {
    // Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = '#$%';
    //Act
    await registerPage.registerAs(registerUserData);
    //Assert
    await expect(registerPage.emailErrorText).toContainText(expectedErrorText);
  });
  test('Try to register a new user using incorrect data - email not provided @GAD-R03-04 @negative', async ({}) => {
    // Arrange
    const expectedErrorText = 'This field is required';
    //Act
    await registerPage.firstNameInput.fill(registerUserData.userFirstName);
    await registerPage.lastNameInput.fill(registerUserData.userLastName);
    await registerPage.passwordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();
    //Assert
    await expect(registerPage.emailErrorText).toContainText(expectedErrorText);
  });
});
