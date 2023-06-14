import * as jwt from 'jsonwebtoken';
import { Role } from 'src/enum/role.enum';
export class JwtStrategy {
  static generate(payload: object, secretKey: string) {
    return jwt.sign(payload, secretKey);
  }
  static decode(token: string) {
    try {
      return jwt.decode(token.replace('Bearer ', ''));
    } catch (error) {
      return null;
    }
  }
  //   static verify(token: string, secret: string) {
  //     return jwt.verify(token, secret);
  //   }
  static verify(token: string, secret: string) {
    try {
      return jwt.verify(token.replace('Bearer ', ''), secret);
    } catch (error) {
      return null;
    }
  }
  static getUserId(headers): string {
    return headers.authorization
      ? this.decode(headers.authorization)['id']
      : null;
  }
  static getPayload(headers) {
    return this.decode(headers.authorization);
  }
  static getUserRole(headers): Role {
    return headers.authorization
      ? this.decode(headers.authorization)['roles']
      : null;
  }
}
