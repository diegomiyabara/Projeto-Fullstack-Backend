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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageBusiness = void 0;
const InvalidParameterError_1 = require("../error/InvalidParameterError");
const AlbumDatabase_1 = require("../data/AlbumDatabase");
const InsuficientAuth_1 = require("../error/InsuficientAuth");
const dayjs_1 = __importDefault(require("dayjs"));
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
            const today = dayjs_1.default().format("YYYY-MM-DD");
            const id = this.idGenerator.generate();
            const user = this.authenticator.getData(token);
            const albumDatabase = new AlbumDatabase_1.AlbumDatabase();
            const album = yield albumDatabase.getAlbumById(image.album_id);
            if (user.id !== album.user_id) {
                throw new InsuficientAuth_1.InsuficientAuth("You can only add images to your albuns!");
            }
            yield this.imageDatabase.addImage(id, image.description, image.photoUrl, user.id, image.album_id, today);
            return album;
        });
    }
    getAlbumImages(album_id, hashtag, orderDate, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!album_id) {
                throw new InvalidParameterError_1.InvalidParameterError("Album id is required.");
            }
            if (orderDate !== "ASC" && orderDate !== "DESC" && orderDate) {
                throw new InvalidParameterError_1.InvalidParameterError("orderDate must be ASC or DESC");
            }
            const user = this.authenticator.getData(token);
            const response = yield this.imageDatabase.getAlbumImages(album_id, hashtag, orderDate);
            response.map((image) => {
                if (image.user_id !== user.id) {
                    throw new InsuficientAuth_1.InsuficientAuth("You can only acess your own album images");
                }
            });
            return response;
        });
    }
    getImageById(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new InvalidParameterError_1.InvalidParameterError("Image id is required");
            }
            const user = this.authenticator.getData(token);
            const response = yield this.imageDatabase.getImageById(id);
            if (response.user_id !== user.id) {
                throw new InsuficientAuth_1.InsuficientAuth("You can only acess your own images");
            }
            return response;
        });
    }
}
exports.ImageBusiness = ImageBusiness;
//# sourceMappingURL=ImageBusiness.js.map