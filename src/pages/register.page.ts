import { RegisterUserModel } from '../models/user.model';
import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class RegisterPage extends BasePage {
  url = '/register.html';
  expectedPageTitle = 'Register';
  firstNameInput: Locator;
  lastNameInput: Locator;
  emailInput: Locator;
  passwordInput: Locator;
  registerButton: Locator;
  alertPopup: Locator;
  emailErrorText: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = this.page.getByTestId('firstname-input');
    this.lastNameInput = this.page.getByTestId('lastname-input');
    this.emailInput = this.page.getByTestId('email-input');
    this.passwordInput = this.page.getByTestId('password-input');
    this.registerButton = this.page.getByTestId('register-button');
    this.alertPopup = this.page.getByTestId('alert-popup');
    this.emailErrorText = this.page.locator('#octavalidate_email');
  }
  async registerAs(registerUserData: RegisterUserModel): Promise<void> {
    await this.firstNameInput.fill(registerUserData.userFirstName);
    await this.lastNameInput.fill(registerUserData.userLastName);
    await this.emailInput.fill(registerUserData.userEmail);
    await this.passwordInput.fill(registerUserData.userPassword);
    await this.registerButton.click();
  }
}
