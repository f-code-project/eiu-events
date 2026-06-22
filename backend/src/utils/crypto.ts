import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class AlgoCrypto {
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  static verifyPassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword);
  }

  static generateOpaqueToken(): string {
    return crypto.randomBytes(40).toString('hex');
  }
}
