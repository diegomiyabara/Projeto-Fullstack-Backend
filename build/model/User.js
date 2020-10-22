"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.User = void 0;
class User {
    constructor(id, name, email, nickname, password, role, photoUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.role = role;
        this.photoUrl = photoUrl;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getEmail() {
        return this.email;
    }
    getNickname() {
        return this.nickname;
    }
    getPassword() {
        return this.password;
    }
    getRole() {
        return this.role;
    }
    getPhotoUrl() {
        return this.photoUrl;
    }
    setId(id) {
        this.id = id;
    }
    setName(name) {
        this.name = name;
    }
    setEmail(email) {
        this.email = email;
    }
    setNickname(nickname) {
        this.nickname = nickname;
    }
    setPassword(password) {
        this.password = password;
    }
    setRole(role) {
        this.role = role;
    }
    setPhotoUrl(photoUrl) {
        this.photoUrl = photoUrl;
    }
    static stringToUserRole(input) {
        switch (input) {
            case "NORMAL":
                return UserRole.NORMAL;
            case "ADMIN":
                return UserRole.ADMIN;
            default:
                throw new Error("Invalid user role");
        }
    }
    static toUserModel(user) {
        if (!user) {
            throw new Error("User not found");
        }
        return new User(user.id, user.name, user.email, user.nickname, user.password, User.stringToUserRole(user.role), user.photoUrl);
    }
}
exports.User = User;
var UserRole;
(function (UserRole) {
    UserRole["NORMAL"] = "NORMAL";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
//# sourceMappingURL=User.js.map