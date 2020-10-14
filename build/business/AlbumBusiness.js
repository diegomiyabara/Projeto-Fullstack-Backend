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
exports.AlbumBusiness = void 0;
const InvalidParameterError_1 = require("../error/InvalidParameterError");
const NotFoundError_1 = require("../error/NotFoundError");
const InsuficientAuth_1 = require("../error/InsuficientAuth");
class AlbumBusiness {
    constructor(albumDatabase, idGenerator, authenticator) {
        this.albumDatabase = albumDatabase;
        this.idGenerator = idGenerator;
        this.authenticator = authenticator;
    }
    createAlbum(album, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!album.name || !album.description) {
                throw new InvalidParameterError_1.InvalidParameterError("All inputs must be filled!");
            }
            if (!album.albumImageUrl) {
                album.albumImageUrl = "";
            }
            const id = this.idGenerator.generate();
            const user = this.authenticator.getData(token);
            const albunsDb = yield this.albumDatabase.getAlbunsByUserId(user.id);
            albunsDb.map((albumDb) => {
                if (albumDb.name === album.name) {
                    throw new InvalidParameterError_1.InvalidParameterError(`You already have an album with the name ${album.name}.`);
                }
            });
            return yield this.albumDatabase.createAlbum(id, album.name, album.description, album.albumImageUrl, user.id);
        });
    }
    getAllAlbuns(token, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            if (user.role !== "ADMIN") {
                throw new InsuficientAuth_1.InsuficientAuth("Only Admins can acess all albuns");
            }
            const response = yield this.albumDatabase.getAllAlbuns(user_id);
            return response;
        });
    }
    getAlbunsByUserId(token, hashtag) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            const response = yield this.albumDatabase.getAlbunsByUserId(user.id, hashtag);
            return response;
        });
    }
    getAlbumById(albumId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            const response = yield this.albumDatabase.getAlbumById(albumId);
            if (!response) {
                throw new NotFoundError_1.NotFoundError("Album not found!");
            }
            if (user.id !== response.user_id && user.role !== "ADMIN") {
                throw new InsuficientAuth_1.InsuficientAuth("You can only acess your own albuns!");
            }
            return response;
        });
    }
}
exports.AlbumBusiness = AlbumBusiness;
//# sourceMappingURL=AlbumBusiness.js.map