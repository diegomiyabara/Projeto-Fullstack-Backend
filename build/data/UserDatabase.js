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
    }
    toModel(dbModel) {
        return (dbModel &&
            new User_1.User(dbModel.id, dbModel.name, dbModel.email, dbModel.nickname, dbModel.password, dbModel.role));
    }
    createUser(id, name, email, nickname, password, role) {
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
                    role
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
}
exports.UserDatabase = UserDatabase;
//# sourceMappingURL=UserDatabase.js.map