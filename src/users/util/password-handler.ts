import * as bcrypt from 'bcrypt';

export class PasswordHandler {
  static hashPassword(pass: string, saltRounds = 10): string {
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(saltRounds));
  }

  static compare(plainText: string, hash: string): boolean {
    return bcrypt.compareSync(plainText, hash);
  }
}
