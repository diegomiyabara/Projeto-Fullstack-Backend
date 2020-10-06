import * as jwt from "jsonwebtoken";

export class Authenticator {
  public generateToken(input: AuthenticationData,
    expiresIn: string = process.env.ACCESS_TOKEN_EXPIRES_IN!): string {
    const token = jwt.sign(
      {
        id: input.id,
        name: input.name,
        role: input.role
      },
      process.env.JWT_KEY as string,
      {
        expiresIn,
      }
    );
    return token;
  }

  public getData(token: string): AuthenticationData {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any;
    const result = {
      id: payload.id,
      name: payload.name,
      role: payload.role
    };
    return result;
  }
}

interface AuthenticationData {
  id: string;
  name: string;
  role: string;
}