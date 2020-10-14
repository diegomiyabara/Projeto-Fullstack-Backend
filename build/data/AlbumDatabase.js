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
exports.AlbumDatabase = void 0;
const BaseDatabase_1 = require("./BaseDatabase");
const InvalidParameterError_1 = require("../error/InvalidParameterError");
class AlbumDatabase extends BaseDatabase_1.BaseDatabase {
    constructor() {
        super(...arguments);
        this.tableName = "PROJETO_FULLSTACK_ALBUNS";
    }
    createAlbum(id, name, description, albumImageUrl, user_id) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.getConnection.call(this)
                    .insert({
                    id,
                    name,
                    description,
                    albumImageUrl,
                    user_id
                })
                    .into(this.tableName);
            }
            catch (error) {
                if (error.message.includes("for key 'name'")) {
                    throw new InvalidParameterError_1.InvalidParameterError("There is already an album with this name!");
                }
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
    getAllAlbuns(userId) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let idQuery = "";
            if (userId) {
                idQuery = `WHERE user_id = "${userId}"`;
            }
            try {
                const response = yield _super.getConnection.call(this)
                    .raw(`SELECT ${this.tableName}.id, ${this.tableName}.name, description, albumImageUrl, user_id, PROJETO_FULLSTACK_USERS.name as user_name 
            FROM PROJETO_FULLSTACK_USERS
            JOIN ${this.tableName} ON PROJETO_FULLSTACK_USERS.id = ${this.tableName}.user_id
            ${idQuery};`);
                return response[0];
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
    getAlbunsByUserId(user_id, albumName) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let nameQuery = "";
            if (!albumName) {
                nameQuery = `AND name LIKE '%${albumName}%'`;
            }
            try {
                const response = yield _super.getConnection.call(this)
                    .raw(`
                SELECT * FROM ${this.tableName}
                WHERE user_id = ${user_id}
                ${nameQuery};
            `);
                return response[0];
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
    getAlbumById(albumId) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield _super.getConnection.call(this)
                    .select("*")
                    .from(this.tableName)
                    .where("id", albumId);
                return response[0];
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
}
exports.AlbumDatabase = AlbumDatabase;
//# sourceMappingURL=AlbumDatabase.js.map