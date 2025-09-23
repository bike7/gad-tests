import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('Verify registration', () => {
  test('Register new user using required fields and login @GAD-R03-01 @GAD-R03-02 @GAD-R03-03', async ({
    page,
  }) => {
    // Arrange
    const firstName = faker.person.firstName().replace(/[^A-Za-z]/g, '');
    const lastName = faker.person.lastName().replace(/[^A-Za-z]/g, '');
    const email = faker.internet.email({
      firstName: firstName,
      lastName: lastName,
    });
    const password = faker.internet.password({ memorable: true });
    const expectedPageTitle = 'Login';
    const expectedAlertText = 'User created';
    //Act
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(firstName, lastName, email, password);
    //Assert registration confirmation popup
    const actualAlert = registerPage.alertPopup;
    await expect(actualAlert).toHaveText(expectedAlertText);
    //Assert login page load after registration
    const loginPage = new LoginPage(page);
    await loginPage.waitForPageToLoadUrl();
    const actualLoginPageTitle = await loginPage.title();
    expect(actualLoginPageTitle).toContain(expectedPageTitle);
    //Assert login with registered user
    await loginPage.login(email, password);
    const welcomePage = new WelcomePage(page);
    await expect(welcomePage.welcomeMessage).toContainText(email);
  });
});
