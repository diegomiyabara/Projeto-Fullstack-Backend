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
exports.ImageBusiness = void 0;
const InvalidParameterError_1 = require("../error/InvalidParameterError");
const AlbumDatabase_1 = require("../data/AlbumDatabase");
const InsuficientAuth_1 = require("../error/InsuficientAuth");
class ImageBusiness {
    constructor(imageDatabase, idGenerator, authenticator) {
        this.imageDatabase = imageDatabase;
        this.idGenerator = idGenerator;
        this.authenticator = authenticator;
    }
    addImage(image, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!image.description || !image.photoUrl || !image.album_id) {
                throw new InvalidParameterError_1.InvalidParameterError("All inputs must be filled!");
            }
            const id = this.idGenerator.generate();
            const user = this.authenticator.getData(token);
            const albumDatabase = new AlbumDatabase_1.AlbumDatabase();
            const album = yield albumDatabase.getAlbumById(image.album_id);
            if (user.id !== album.user_id) {
                throw new InsuficientAuth_1.InsuficientAuth("You can only add images to your albuns!");
            }
            yield this.imageDatabase.addImage(id, image.description, image.photoUrl, user.id, image.album_id);
            return album;
        });
    }
    getAlbumImages(album_id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!album_id) {
                throw new InvalidParameterError_1.InvalidParameterError("Album id is required.");
            }
            const user = this.authenticator.getData(token);
            const response = yield this.imageDatabase.getAlbumImages(album_id);
            response.map((image) => {
                if (image.user_id !== user.id) {
                    throw new InsuficientAuth_1.InsuficientAuth("You can only acess your own album images");
                }
            });
            return response;
        });
    }
}
exports.ImageBusiness = ImageBusiness;
//# sourceMappingURL=ImageBusiness.js.map