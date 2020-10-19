import { BaseDatabase } from "./BaseDatabase";
import { User, UserOutputDTO } from "../model/User";
import { InvalidParameterError } from "../error/InvalidParameterError";

export class UserDatabase extends BaseDatabase {

  protected tableName: string = "PROJETO_FULLSTACK_USERS";

  private toModel(dbModel?: any): User | undefined {
    return (
      dbModel &&
      new User(
        dbModel.id,
        dbModel.name,
        dbModel.email,
        dbModel.nickname,
        dbModel.password,
        dbModel.role
      )
    );
  }

  public async createUser(
    id: string,
    name: string,
    email: string,
    nickname: string,
    password: string,
    role: string
  ): Promise<void> {
    try {
      await super.getConnection()
        .insert({
          id,
          name,
          email,
          nickname,
          password,
          role
        })
        .into(this.tableName);
    } catch (error) {
      if(error.message.includes("for key 'email'")) {
        throw new InvalidParameterError("This email is already in use!")
      }
      if(error.message.includes("for key 'nickname'")) {
        throw new InvalidParameterError("This nickname is already in use!")
      }
      throw new Error(error.sqlMessage || error.message);
      }
    }


  public async getUser(emailOrNickname: string): Promise<User | undefined> {
    const result = await super.getConnection()
      .raw(`
        SELECT * FROM ${this.tableName} WHERE email = "${emailOrNickname}" OR nickname = "${emailOrNickname}";
      `)

    return this.toModel(result[0][0]);
  }

  public async getAllUsers(user_id: string, hashtag: string): Promise<UserOutputDTO[]> {    
    const result = await super.getConnection()
    .select("*")
    .from(this.tableName)
    .where('name', 'like', `%${hashtag}%`)
    .whereNot({
      id: user_id,
      role: "ADMIN"
    })

    return result
  }
}
