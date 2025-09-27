import { LoginUserModel } from '../models/user.model';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class LoginPage extends BasePage {
  url = '/login/';
  expectedPageTitle = 'Login';
  usernameInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = this.page.getByRole('textbox', {
      name: 'Enter User Email',
    });
    this.passwordInput = this.page.getByRole('textbox', {
      name: 'Enter Password',
    });
    this.loginButton = this.page.getByRole('button', { name: 'LogIn' });
    this.loginErrorMessage = this.page.getByTestId('login-error');
  }

  async loginAs(loginUserData: LoginUserModel): Promise<void> {
    await this.usernameInput.fill(loginUserData.userEmail);
    await this.passwordInput.fill(loginUserData.userPassword);
    await this.loginButton.click();
  }
}
