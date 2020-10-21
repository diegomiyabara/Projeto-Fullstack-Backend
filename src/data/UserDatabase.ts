import { BaseDatabase } from "./BaseDatabase";
import { User, UserOutputDTO } from "../model/User";
import { InvalidParameterError } from "../error/InvalidParameterError";

export class UserDatabase extends BaseDatabase {

  protected tableName: string = "PROJETO_FULLSTACK_USERS";
  protected relationsTableName: string = "PROJETO_FULLSTACK_USER_RELATION"
  protected albumTableName: string = "PROJETO_FULLSTACK_ALBUNS"

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

  public async getUserById(id: string): Promise<UserOutputDTO> {
    const result = await super.getConnection()
    .select("*")
    .from(this.tableName)
    .where('id', id)

    return result[0]
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

  public async followUser(user_id: string, user_to_follow_id: string): Promise<void> {
    try {
        await super.getConnection()
        .insert({
          user_id,
          user_to_follow_id
        })
        .into(this.relationsTableName)
    } catch (error) {
      throw new Error("You are already following this user.")
    }
  }

  public async unfollowUser(user_id: string, user_to_follow_id: string): Promise<void> {
    try {
      await super.getConnection()
      .delete("*")
      .from(this.relationsTableName)
      .where({user_id, user_to_follow_id})
    } catch (error) {
      throw new Error(error.message)
    }
  }

  public async getFriends(user_id: string): Promise<any[]> {
    try {
      const response = await super.getConnection()
      .raw(`
        SELECT user_id, user_to_follow_id as friend_id
        FROM ${this.relationsTableName}
        WHERE user_id = "${user_id}"
      `)

      return response[0]
    } catch (error) {
      throw new Error(error.message)
    }
  }

  public async getFeed(user_id: string, hashtag: string, orderDate: string): Promise<any[]> {
    let hashQuery = ""
    if(hashtag) {
      hashQuery = `AND ${this.albumTableName}.name LIKE "%${hashtag}%"`
    }
    let dateQuery = `ORDER BY ${this.albumTableName}.createdAt DESC`
    if(orderDate === "ASC"){
      dateQuery = `ORDER BY ${this.albumTableName}.createdAt ASC`
    }
    try {
      const response = await super.getConnection()
      .raw(`
      SELECT ${this.tableName}.id, ${this.tableName}.name, ${this.tableName}.nickname, ${this.albumTableName}.id as album_id, ${this.albumTableName}.name as album_name, ${this.albumTableName}.description as album_description, ${this.albumTableName}.albumImageUrl as album_imageUrl,
      ${this.albumTableName}.createdAt as album_createdAt
      FROM ${this.tableName}
      JOIN ${this.albumTableName} on ${this.tableName}.id = ${this.albumTableName}.user_id
      JOIN ${this.relationsTableName} on ${this.albumTableName}.user_id = ${this.relationsTableName}.user_to_follow_id
      WHERE ${this.relationsTableName}.user_id = "${user_id}" ${hashQuery}
      ${dateQuery};
      `)

      return response[0]
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
