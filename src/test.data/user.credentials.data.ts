import { USER_EMAIL, USER_PASSWORD } from '../global-setup';
import { LoginUserModel } from '../models/user.model';

export const testUser: LoginUserModel = {
  userEmail: USER_EMAIL,
  userPassword: USER_PASSWORD,
};
