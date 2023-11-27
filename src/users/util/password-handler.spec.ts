import { PasswordHandler } from './password-handler';

describe('PasswordHandler', () => {
  it('hash and compare password', () => {
    const plainPassword = '123456';
    const hash = PasswordHandler.hashPassword(plainPassword);
    expect(hash).toBeDefined();

    expect(PasswordHandler.compare('12345', hash)).toBeFalsy();
    expect(PasswordHandler.compare('123456', hash)).toBeTruthy();
  });
});
