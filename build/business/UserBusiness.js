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
exports.UserBusiness = void 0;
const User_1 = require("../model/User");
const InvalidParameterError_1 = require("../error/InvalidParameterError");
const NotFoundError_1 = require("../error/NotFoundError");
class UserBusiness {
    constructor(userDatabase, idGenerator, hashManager, authenticator) {
        this.userDatabase = userDatabase;
        this.idGenerator = idGenerator;
        this.hashManager = hashManager;
        this.authenticator = authenticator;
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.name || !user.email || !user.nickname || !user.password) {
                throw new InvalidParameterError_1.InvalidParameterError("All inputs must be filled!");
            }
            if (user.email.indexOf("@") === -1) {
                throw new InvalidParameterError_1.InvalidParameterError("Invalid email");
            }
            if (user.nickname.length < 3) {
                throw new InvalidParameterError_1.InvalidParameterError("Nickname must contain at least 3 characters");
            }
            if (!user.password.match('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$')) {
                throw new InvalidParameterError_1.InvalidParameterError("Password must have at least 8 characters, have one upper and one lower case!");
            }
            if (!user.role) {
                user.role = User_1.UserRole.NORMAL;
            }
            if (user.role !== "ADMIN" && user.role !== "NORMAL") {
                throw new InvalidParameterError_1.InvalidParameterError("Roles can only be assigned as NORMAL or ADMIN");
            }
            const id = this.idGenerator.generate();
            const hashPassword = yield this.hashManager.hash(user.password);
            yield this.userDatabase.createUser(id, user.name, user.email, user.nickname, hashPassword, user.role, user.photoUrl);
            const accessToken = this.authenticator.generateToken({ id, name: user.name, role: user.role });
            return accessToken;
        });
    }
    login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user.emailOrNickname) {
                throw new InvalidParameterError_1.InvalidParameterError("Please inform your email or nickname!");
            }
            if (!user.password) {
                throw new InvalidParameterError_1.InvalidParameterError("Please inform your password!");
            }
            const userDb = yield this.userDatabase.getUser(user.emailOrNickname);
            if (!userDb) {
                throw new NotFoundError_1.NotFoundError("User not found.");
            }
            const hashCompare = yield this.hashManager.compare(user.password, userDb && userDb.getPassword());
            const accessToken = this.authenticator.generateToken({ id: userDb.getId(), name: userDb.getName(), role: userDb.getRole() });
            if (!hashCompare) {
                throw new Error("Invalid Password!");
            }
            return accessToken;
        });
    }
    getUsers(token, hashtag) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            if (!hashtag) {
                hashtag = "";
            }
            const users = yield this.userDatabase.getAllUsers(user.id, hashtag);
            const formatUsers = users.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    nickname: user.nickname,
                    photoUrl: user.photoUrl
                };
            });
            return formatUsers;
        });
    }
    followUser(token, user_to_follow_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            if (!user_to_follow_id) {
                throw new NotFoundError_1.NotFoundError("Please inform the user to follow id.");
            }
            const friend = yield this.userDatabase.getUserById(user_to_follow_id);
            yield this.userDatabase.followUser(user.id, user_to_follow_id);
            return friend;
        });
    }
    unfollowUser(token, user_to_unfollow_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            if (!user_to_unfollow_id) {
                throw new NotFoundError_1.NotFoundError("Please inform the user to unfollow id.");
            }
            const friend = yield this.userDatabase.getUserById(user_to_unfollow_id);
            yield this.userDatabase.unfollowUser(user.id, user_to_unfollow_id);
            return friend;
        });
    }
    getFriends(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            const response = this.userDatabase.getFriends(user.id);
            return response;
        });
    }
    getFeed(token, hashtag, orderDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.authenticator.getData(token);
            if (orderDate !== "ASC" && orderDate !== "DESC" && orderDate) {
                throw new InvalidParameterError_1.InvalidParameterError("The query orderBy must be ASC or DESC");
            }
            const feed = yield this.userDatabase.getFeed(user.id, hashtag, orderDate);
            return feed;
        });
    }
}
exports.UserBusiness = UserBusiness;
//# sourceMappingURL=UserBusiness.js.map