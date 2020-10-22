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
const UserBusiness_1 = require("../business/UserBusiness");
const User_1 = require("../model/User");
let userDatabase = {
    createUser: jest.fn((user) => __awaiter(void 0, void 0, void 0, function* () { return { token: "fake token" }; })),
    getUser: jest.fn((email) => __awaiter(void 0, void 0, void 0, function* () { return undefined; }))
};
const idGenerator = {
    generate: jest.fn(() => "id mock")
};
let hashManager = {
    hash: jest.fn((password) => __awaiter(void 0, void 0, void 0, function* () { return "cypherPassword"; })),
    compare: jest.fn((password, cypherPassword) => __awaiter(void 0, void 0, void 0, function* () { return false; }))
};
const authenticator = {
    generateToken: jest.fn((payload) => "fake token"),
    getData: jest.fn((token) => { return { id: "id", role: "ADMIN" }; })
};
const userBusiness = new UserBusiness_1.UserBusiness(userDatabase, idGenerator, hashManager, authenticator);
describe("endpoint create user", () => {
    test("Return error when no name is not informed", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const id = idGenerator.generate;
            const user = {
                name: "",
                email: "diego@gmail.com",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "ADMIN",
                photoUrl: ""
            };
            yield userBusiness.createUser(user);
        }
        catch (error) {
            expect(error.message).toBe("All inputs must be filled!");
            expect(error.code).toBe(422);
        }
    }));
    test("Return error when no email is not informed", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const id = idGenerator.generate;
            const user = {
                name: "Diego Miyabara",
                email: "",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "ADMIN",
                photoUrl: ""
            };
            yield userBusiness.createUser(user);
        }
        catch (error) {
            expect(error.message).toBe("All inputs must be filled!");
            expect(error.code).toBe(422);
        }
    }));
    test("Return error when no password is not informed", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const id = idGenerator.generate;
            const user = {
                name: "Diego Miyabara",
                email: "diego@gmail.com",
                nickname: "dzmGodz",
                password: "",
                role: "ADMIN",
                photoUrl: ""
            };
            yield userBusiness.createUser(user);
        }
        catch (error) {
            expect(error.message).toBe("All inputs must be filled!");
            expect(error.code).toBe(422);
        }
    }));
    test("Return error when email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const id = idGenerator.generate;
            const user = {
                name: "Diego Miyabara",
                email: "diegogmail.com",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "ADMIN",
                photoUrl: ""
            };
            yield userBusiness.createUser(user);
        }
        catch (error) {
            expect(error.message).toBe("Invalid email");
            expect(error.code).toBe(422);
        }
    }));
    test("Return error when password is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const id = idGenerator.generate;
            const user = {
                name: "Diego Miyabara",
                email: "diego@gmail.com",
                nickname: "dzmGodz",
                password: "labenu123456",
                role: "ADMIN",
                photoUrl: ""
            };
            yield userBusiness.createUser(user);
        }
        catch (error) {
            expect(error.message).toBe("Password must have at least 8 characters, have one upper and one lower case!");
            expect(error.code).toBe(422);
        }
    }));
    test("Return error when user role is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const user = {
                name: "Diego Miyabara",
                email: "diego@gmail.com",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "REN",
                photoUrl: ""
            };
            yield userBusiness.createUser(user);
        }
        catch (error) {
            expect(error.message).toBe("Roles can only be assigned as NORMAL or ADMIN");
            expect(error.code).toBe(422);
        }
    }));
    test("Return sucess when all parameters are correct", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            name: "Diego Miyabara",
            email: "diego@gmail.com",
            nickname: "dzmGodz",
            password: "Labenu123456",
            role: "ADMIN",
            photoUrl: ""
        };
        const token = yield userBusiness.createUser(user);
        expect(token).toBe("fake token");
    }));
});
describe("test endpoint login", () => {
    test("Return error when email is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const loginDTO = {
                emailOrNickname: "",
                password: "Labenu123456"
            };
            yield userBusiness.login(loginDTO);
        }
        catch (error) {
            expect(error.message).toBe("Please inform your email or nickname!");
            expect(error.code).toBe(422);
        }
    }));
    test("Return error when password is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const loginDTO = {
                emailOrNickname: "diego@gmail.com",
                password: ""
            };
            yield userBusiness.login(loginDTO);
        }
        catch (error) {
            expect(error.message).toBe("Please inform your password!");
            expect(error.code).toBe(422);
        }
    }));
    test("Return error when user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        try {
            const loginDTO = {
                emailOrNickname: "diego@gmail.com",
                password: "Labenu@123"
            };
            yield userBusiness.login(loginDTO);
        }
        catch (error) {
            expect(error.message).toBe("User not found.");
            expect(error.code).toBe(404);
        }
    }));
    test("Sucessfully login with email when all informations are correct", () => __awaiter(void 0, void 0, void 0, function* () {
        userDatabase = { getUser: jest.fn((id) => new User_1.User("id", "Diego Miyabara", "diego@gmail.com", "dzmGodz", "cypherPassword", User_1.User.stringToUserRole("ADMIN"), "")) };
        hashManager = { compare: jest.fn((password, cypherPassword) => true) };
        const userBusiness = new UserBusiness_1.UserBusiness(userDatabase, idGenerator, hashManager, authenticator);
        const user = {
            emailOrNickname: "diego@gmail.com",
            password: "cypherPassword"
        };
        const result = yield userBusiness.login(user);
        expect(result).toBe("fake token");
    }));
    test("Sucessfully login with nickname when all informations are correct", () => __awaiter(void 0, void 0, void 0, function* () {
        userDatabase = { getUser: jest.fn((id) => new User_1.User("id", "Diego Miyabara", "diego@gmail.com", "dzmGodz", "cypherPassword", User_1.User.stringToUserRole("ADMIN"), "")) };
        hashManager = { compare: jest.fn((password, cypherPassword) => true) };
        const userBusiness = new UserBusiness_1.UserBusiness(userDatabase, idGenerator, hashManager, authenticator);
        const user = {
            emailOrNickname: "dzmGodz",
            password: "cypherPassword"
        };
        const result = yield userBusiness.login(user);
        expect(result).toBe("fake token");
    }));
});
//# sourceMappingURL=UserBusiness.test.js.map