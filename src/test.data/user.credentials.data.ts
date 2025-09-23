export const testUser = {
  userEmail: process.env.USER_EMAIL ?? '[USER_EMAIL NOT SET IN .ENV FILE]',
  userPassword:
    process.env.USER_PASSWORD ?? '[USER_PASSWORD NOT SET IN .ENV FILE]',
};
