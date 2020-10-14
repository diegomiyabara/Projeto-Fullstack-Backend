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
exports.ImageDatabase = void 0;
const BaseDatabase_1 = require("./BaseDatabase");
class ImageDatabase extends BaseDatabase_1.BaseDatabase {
    constructor() {
        super(...arguments);
        this.tableName = "PROJETO_FULLSTACK_IMAGES";
    }
    addImage(id, description, photoUrl, user_id, album_id) {
        const _super = Object.create(null, {
            getConnection: { get: () => super.getConnection }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _super.getConnection.call(this)
                    .insert({
                    id,
                    description,
                    photoUrl,
                    user_id,
                    album_id
                })
                    .into(this.tableName);
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
    getAlbumImages(album_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.getConnection()
                    .select("*")
                    .from(this.tableName)
                    .where("album_id", album_id);
                return response;
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
    getImageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.getConnection()
                    .select("*")
                    .from(this.tableName)
                    .where("id", id);
                return response[0];
            }
            catch (error) {
                throw new Error(error.sqlMessage || error.message);
            }
        });
    }
}
exports.ImageDatabase = ImageDatabase;
//# sourceMappingURL=ImageDatabase.js.map