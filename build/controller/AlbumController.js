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
exports.AlbumController = void 0;
const BaseDatabase_1 = require("../data/BaseDatabase");
const Authenticator_1 = require("../services/Authenticator");
const IdGenerator_1 = require("../services/IdGenerator");
const AlbumBusiness_1 = require("../business/AlbumBusiness");
const AlbumDatabase_1 = require("../data/AlbumDatabase");
class AlbumController {
    createAlbum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    name: req.body.name,
                    description: req.body.description,
                    albumImageUrl: req.body.albumImageUrl
                };
                const token = req.headers.authorization;
                yield AlbumController.albumBusiness.createAlbum(input, token);
                res.status(200).send({ message: `Album ${input.name} created sucessfully!` });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    getAllAlbuns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const user_id = req.body.user_id;
                const response = yield AlbumController.albumBusiness.getAllAlbuns(token, user_id);
                res.status(200).send({ Albuns: response });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    getAlbunsByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const hashtag = req.query.hashtag;
                const orderDate = req.query.orderDate;
                const response = yield AlbumController.albumBusiness.getAlbunsByUserId(token, hashtag, orderDate);
                res.status(200).send({ Albuns: response });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    getAlbumById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const albumId = req.params.albumId;
                const token = req.headers.authorization;
                const response = yield AlbumController.albumBusiness.getAlbumById(albumId, token);
                res.status(200).send({ Album: response });
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
exports.AlbumController = AlbumController;
AlbumController.albumBusiness = new AlbumBusiness_1.AlbumBusiness(new AlbumDatabase_1.AlbumDatabase(), new IdGenerator_1.IdGenerator(), new Authenticator_1.Authenticator());
//# sourceMappingURL=AlbumController.js.map