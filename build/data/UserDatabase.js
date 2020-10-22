"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDatabase = void 0;
const BaseDatabase_1 = require("./BaseDatabase");
const User_1 = require("../model/User");
const InvalidParameterError_1 = require("../error/InvalidParameterError");
class UserDatabase extends BaseDatabase_1.BaseDatabase {
    constructor() {
        super(...arguments);
        this.tableName = "PROJETO_FULLSTACK_USERS";
        this.relationsTableName = "PROJETO_FULLSTACK_USER_RELATION";
        this.albumTableName = "PROJETO_FULLSTACK_ALBUNS";
    }
    toModel(dbModel) {
        return (dbModel &&
            new User_1.User(dbModel.id, dbModel.name, dbModel.email, dbModel.nickname, dbModel.password, dbModel.role, dbModel.photoUrl));
    }
    createUser(id, name, email, nickname, password, role, photoUrl) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.getConnection.call(this)
                    .insert({
                    id,
                    name,
                    email,
                    nickname,
                    password,
                    role,
                    photoUrl
                })
                    .into(this.tableName);
            }
            catch (error) {
                if (error.message.includes("for key 'email'")) {
                    throw new InvalidParameterError_1.InvalidParameterError("This email is already in use!");
                }
                if (error.message.includes("for key 'nickname'")) {
                    throw new InvalidParameterError_1.InvalidParameterError("This nickname is already in use!");
                }
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
    getUser(emailOrNickname) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super.getConnection.call(this)
                .raw(`
        SELECT * FROM ${this.tableName} WHERE email = "${emailOrNickname}" OR nickname = "${emailOrNickname}";
      `);
            return this.toModel(result[0][0]);
        });
    }
    getUserById(id) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super.getConnection.call(this)
                .select("*")
                .from(this.tableName)
                .where('id', id);
            return result[0];
        });
    }
    getAllUsers(user_id, hashtag) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _super.getConnection.call(this)
                .select("*")
                .from(this.tableName)
                .where('name', 'like', `%${hashtag}%`)
                .whereNot({
                id: user_id
            });
            return result;
        });
    }
    followUser(user_id, user_to_follow_id) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.getConnection.call(this)
                    .insert({
                    user_id,
                    user_to_follow_id
                })
                    .into(this.relationsTableName);
            }
            catch (error) {
                throw new Error("You are already following this user.");
            }
        });
    }
    unfollowUser(user_id, user_to_follow_id) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.getConnection.call(this)
                    .delete("*")
                    .from(this.relationsTableName)
                    .where({ user_id, user_to_follow_id });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getFriends(user_id) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield _super.getConnection.call(this)
                    .raw(`
        SELECT user_id, user_to_follow_id as friend_id, name, nickname, photoUrl
        FROM ${this.tableName}
        JOIN ${this.relationsTableName} ON ${this.tableName}.id = ${this.relationsTableName}.user_to_follow_id
        WHERE ${this.relationsTableName}.user_id = "${user_id}"
        ORDER BY ${this.tableName}.name ASC;
      `);
                return response[0];
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    getFeed(user_id, hashtag, orderDate) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let hashQuery = "";
            if (hashtag) {
                hashQuery = `AND ${this.albumTableName}.name LIKE "%${hashtag}%"`;
            }
            let dateQuery = `ORDER BY ${this.albumTableName}.createdAt DESC`;
            if (orderDate === "ASC") {
                dateQuery = `ORDER BY ${this.albumTableName}.createdAt ASC`;
            }
            try {
                const response = yield _super.getConnection.call(this)
                    .raw(`
      SELECT ${this.tableName}.id, ${this.tableName}.name, ${this.tableName}.nickname, ${this.albumTableName}.id as album_id, ${this.albumTableName}.name as album_name, ${this.albumTableName}.description as album_description, ${this.albumTableName}.albumImageUrl as album_imageUrl,
      ${this.albumTableName}.createdAt as album_createdAt, ${this.tableName}.photoUrl as user_photo
      FROM ${this.tableName}
      JOIN ${this.albumTableName} on ${this.tableName}.id = ${this.albumTableName}.user_id
      JOIN ${this.relationsTableName} on ${this.albumTableName}.user_id = ${this.relationsTableName}.user_to_follow_id
      WHERE ${this.relationsTableName}.user_id = "${user_id}" ${hashQuery}
      ${dateQuery};
      `);
                return response[0];
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.UserDatabase = UserDatabase;
//# sourceMappingURL=UserDatabase.js.map