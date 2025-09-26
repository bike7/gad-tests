import { randomUserData } from '../../src/factories/user.factory';
import { RegisterUser } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  test('Register new user using required fields and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({
    page,
  }) => {
    // Arrange
    const registerUserData: RegisterUser = randomUserData();
    const loginUserData = {
      userEmail: registerUserData.userEmail,
      userPassword: registerUserData.userPassword,
    };
    const expectedAlertText = 'User created';
    //Act
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(registerUserData);
    //Assert registration confirmation popup
    const actualAlert = registerPage.alertPopup;
    await expect(actualAlert).toHaveText(expectedAlertText);
    //Assert login page load after registration
    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadUrl();
    const actualLoginPageTitle = await loginPage.title();
    expect(actualLoginPageTitle).toContain(loginPage.expectedPageTitle);
    //Assert login with registered user
    await loginPage.login(loginUserData);
    const welcomePage = new WelcomePage(page);
    await expect(welcomePage.welcomeMessage).toContainText(
      loginUserData.userEmail,
    );
  });
  test('Try to register new user using incorrect data - non valid email @GAD-R03-04', async ({
    page,
  }) => {
    // Arrange
    const registerUserData: RegisterUser = randomUserData();
    registerUserData.userEmail = '#$%';
    const expectedErrorText = 'Please provide a valid email address';
    //Act
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(registerUserData);
    //Assert
    await expect(registerPage.emailErrorText).toContainText(expectedErrorText);
  });
  test('Try to register new user using incorrect data - email not provided @GAD-R03-04', async ({
    page,
  }) => {
    // Arrange
    const registerUserData: RegisterUser = randomUserData();
    const expectedErrorText = 'This field is required';
    //Act
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.firstNameInput.fill(registerUserData.userFirstName);
    await registerPage.lastNameInput.fill(registerUserData.userLastName);
    await registerPage.passwordInput.fill(registerUserData.userPassword);
    await registerPage.registerButton.click();
    //Assert
    await expect(registerPage.emailErrorText).toContainText(expectedErrorText);
  });
});
