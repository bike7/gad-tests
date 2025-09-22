import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class WelcomePage extends BasePage {
  url = '/welcome/';
  welcomeMessage: Locator;
  logoutButton: Locator;
  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByTestId('hello');
    this.logoutButton = this.page.getByTestId('logoutButton');
  }
}
