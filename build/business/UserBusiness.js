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
            yield this.userDatabase.createUser(id, user.name, user.email, user.nickname, hashPassword, user.role);
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
}
exports.UserBusiness = UserBusiness;
//# sourceMappingURL=UserBusiness.js.map