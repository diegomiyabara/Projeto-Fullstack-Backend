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
exports.ImageController = void 0;
const BaseDatabase_1 = require("../data/BaseDatabase");
const Authenticator_1 = require("../services/Authenticator");
const IdGenerator_1 = require("../services/IdGenerator");
const ImageBusiness_1 = require("../business/ImageBusiness");
const ImageDatabase_1 = require("../data/ImageDatabase");
class ImageController {
    addImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    description: req.body.description,
                    photoUrl: req.body.photoUrl,
                    album_id: req.body.album_id
                };
                const token = req.headers.authorization;
                const response = yield ImageController.imageBusiness.addImage(input, token);
                res.status(200).send({ message: `Image added to album ${response.name} sucessfully!` });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    getAlbumImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const album_id = req.query.albumId;
                const token = req.headers.authorization;
                const response = yield ImageController.imageBusiness.getAlbumImages(album_id, token);
                res.status(200).send({ Images: response });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
}
exports.ImageController = ImageController;
ImageController.imageBusiness = new ImageBusiness_1.ImageBusiness(new ImageDatabase_1.ImageDatabase(), new IdGenerator_1.IdGenerator(), new Authenticator_1.Authenticator());
//# sourceMappingURL=ImageController.js.map