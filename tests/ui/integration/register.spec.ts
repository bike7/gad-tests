import { expect, test } from '@_src/merge.fixture';
import { prepareRandomUser } from '@_src/ui/factories/user.factory';
import { RegisterUserModel } from '@_src/ui/models/user.model';
import { testUser } from '@_src/ui/test.data/user.credentials.data';

test.describe('Verify registration', () => {
  let registerUserData: RegisterUserModel;
  test.beforeEach(async ({}) => {
    registerUserData = prepareRandomUser();
  });

  test('Register new user using required fields and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedAlertText = 'User created';
    //Act
    let loginPage = await registerPage.registerAs(registerUserData);
    //Assert registration confirmation popup
    const actualAlert = registerPage.alertPopup;
    await expect(actualAlert).toHaveText(expectedAlertText);
    //Assert login page load after registration
    loginPage = await loginPage.waitForPageToLoadUrl();
    const actualLoginPageTitle = await loginPage.getTitle();
    expect(actualLoginPageTitle).toContain(loginPage.expectedPageTitle);
    //Assert login with registered user
    const welcomePage = await loginPage.loginAs(testUser);
    await expect(welcomePage.welcomeMessage).toContainText(testUser.userEmail);
  });

  test('Try to register a new user using incorrect data - non valid email @GAD-R03-04 @negative', async ({
    registerPage,
  }) => {
    // Arrange
    const expectedErrorText = 'Please provide a valid email address';
    registerUserData.userEmail = '#$%';
    //Act
    await registerPage.registerAs(registerUserData);
    //Assert
    await expect(registerPage.emailErrorText).toContainText(expectedErrorText);
  });

  test('Try to register a new user using incorrect data - email not provided @GAD-R03-04 @negative', async ({
    registerPage,
  }) => {
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
