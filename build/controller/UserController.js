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
exports.UserController = void 0;
const UserBusiness_1 = require("../business/UserBusiness");
const BaseDatabase_1 = require("../data/BaseDatabase");
const UserDatabase_1 = require("../data/UserDatabase");
const HashManager_1 = require("../services/HashManager");
const Authenticator_1 = require("../services/Authenticator");
const IdGenerator_1 = require("../services/IdGenerator");
class UserController {
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = {
                    name: req.body.name,
                    email: req.body.email,
                    nickname: req.body.nickname,
                    password: req.body.password,
                    role: req.body.role,
                    photoUrl: req.body.photoUrl
                };
                const token = yield UserController.userBusiness.createUser(input);
                res.status(200).send({ message: "User created sucessfully!", token });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            yield BaseDatabase_1.BaseDatabase.destroyConnection();
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loginData = {
                    emailOrNickname: req.body.emailOrNickname,
                    password: req.body.password
                };
                const token = yield UserController.userBusiness.login(loginData);
                res.status(200).send({ message: "User logged sucessfully!", token });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            yield BaseDatabase_1.BaseDatabase.destroyConnection();
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const hashtag = req.query.name;
                const users = yield UserController.userBusiness.getUsers(token, hashtag);
                res.status(200).send({ Users: users });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                yield BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const user_to_follow_id = req.body.user_to_follow_id;
                const followed = yield UserController.userBusiness.followUser(token, user_to_follow_id);
                res.status(200).send({ message: `Você está seguindo agora ${followed.name}!` });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    unfollowUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const user_to_unfollow_id = req.body.user_to_unfollow_id;
                const followed = yield UserController.userBusiness.unfollowUser(token, user_to_unfollow_id);
                res.status(200).send({ message: `Você deixou de seguir ${followed.name}!` });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    getFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const friends = yield UserController.userBusiness.getFriends(token);
                res.status(200).send({ Friends: friends });
            }
            catch (error) {
                res.status(error.code || 400).send({ message: error.message });
            }
            finally {
                BaseDatabase_1.BaseDatabase.destroyConnection();
            }
        });
    }
    getFeed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.authorization;
                const hashtag = req.query.name;
                const orderDate = req.query.orderBy;
                const feed = yield UserController.userBusiness.getFeed(token, hashtag, orderDate);
                res.status(200).send({ Feed: feed });
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
exports.UserController = UserController;
UserController.userBusiness = new UserBusiness_1.UserBusiness(new UserDatabase_1.UserDatabase(), new IdGenerator_1.IdGenerator(), new HashManager_1.HashManager(), new Authenticator_1.Authenticator());
//# sourceMappingURL=UserController.js.map