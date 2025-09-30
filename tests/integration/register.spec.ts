import { prepareRandomUser } from '../../src/factories/user.factory';
import { RegisterUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser } from '../../src/test.data/user.credentials.data';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUserModel;
  test.beforeEach(async ({ page }) => {
    registerUserData = prepareRandomUser();
    registerPage = new RegisterPage(page);
  });

  test('Register new user using required fields and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({
    page,
  }) => {
    // Arrange
    const expectedAlertText = 'User created';
    //Act
    await registerPage.goTo();
    await registerPage.registerAs(registerUserData);
    //Assert registration confirmation popup
    const actualAlert = registerPage.alertPopup;
    await expect(actualAlert).toHaveText(expectedAlertText);
    //Assert login page load after registration
    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadUrl();
    const actualLoginPageTitle = await loginPage.getTitle();
    expect(actualLoginPageTitle).toContain(loginPage.expectedPageTitle);
    //Assert login with registered user
    await loginPage.loginAs(testUser);
    const welcomePage = new WelcomePage(page);
    await expect(welcomePage.welcomeMessage).toContainText(testUser.userEmail);
  });
  test('Try to register a new user using incorrect data - non valid email @GAD-R03-04 @negative', async ({}) => {
    // Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = '#$%';
    //Act
    await registerPage.goTo();
    await registerPage.registerAs(registerUserData);
    //Assert
    await expect(registerPage.emailErrorText).toContainText(expectedErrorText);
  });
  test('Try to register a new user using incorrect data - email not provided @GAD-R03-04 @negative', async ({}) => {
    // Arrange
    const expectedErrorText = 'This field is required';
    //Act
    await registerPage.goTo();
    await registerPage.firstNameInput.fill(registerUserData.userFirstName);
    await registerPage.lastNameInput.fill(registerUserData.userLastName);
    await registerPage.passwordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();
    //Assert
    await expect(registerPage.emailErrorText).toContainText(expectedErrorText);
  });
});
