import { UserBusiness } from "../src/business/UserBusiness"
import { LoginInputDTO, User, UserRole } from "../src/model/User"


let userDatabase = {
    createUser: jest.fn( async(user: User) => {return {token:"fake token"}}),
    getUser: jest.fn(async(email: string) => undefined)
} as any

const idGenerator = {
    generate: jest.fn(() => "id mock")
} as any

let hashManager = {
    hash: jest.fn(async(password: string) => "cypherPassword"),
    compare: jest.fn(async(password: string, cypherPassword: string) => false)
}as any

const authenticator = {
    generateToken: jest.fn((payload: {id: string, role: UserRole}) => "fake token"),
    getData: jest.fn((token: string) => {return {id: "id", role: "ADMIN"}})
} as any

const userBusiness: UserBusiness = new UserBusiness(userDatabase,idGenerator,hashManager,authenticator)

describe("endpoint create user", () => {
    test("Return error when no name is not informed", async () => {
        expect.assertions(2)
        try {
            const id = idGenerator.generate
            const user = {
                name:"",
                email:"diego@gmail.com",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "ADMIN"
            }
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("All inputs must be filled!")
            expect(error.code).toBe(422)
        }
    })

    test("Return error when no email is not informed", async () => {
        expect.assertions(2)
        try {
            const id = idGenerator.generate
            const user = {
                name:"Diego Miyabara",
                email:"",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "ADMIN"
            }
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("All inputs must be filled!")
            expect(error.code).toBe(422)
        }
    })

    test("Return error when no password is not informed", async () => {
        expect.assertions(2)
        try {
            const id = idGenerator.generate
            const user = {
                name:"Diego Miyabara",
                email:"diego@gmail.com",
                nickname: "dzmGodz",
                password: "",
                role: "ADMIN"
            }
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("All inputs must be filled!")
            expect(error.code).toBe(422)
        }
    })

    test("Return error when email is invalid", async () => {
        expect.assertions(2)
        try {
            const id = idGenerator.generate
            const user = {
                name:"Diego Miyabara",
                email:"diegogmail.com",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "ADMIN"
            }
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Invalid email")
            expect(error.code).toBe(422)
        }
    })

    test("Return error when password is invalid", async () => {
        expect.assertions(2)
        try {
            const id = idGenerator.generate
            const user = {
                name:"Diego Miyabara",
                email:"diego@gmail.com",
                nickname: "dzmGodz",
                password: "labenu123456",
                role: "ADMIN"
            }
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Password must have at least 8 characters, have one upper and one lower case!")
            expect(error.code).toBe(422)
        }
    })

    test("Return error when user role is invalid", async () => {
        expect.assertions(2)
        try {
            const user = {
                name:"Diego Miyabara",
                email:"diego@gmail.com",
                nickname: "dzmGodz",
                password: "Labenu123456",
                role: "REN"
            }
            await userBusiness.createUser(user)
        } catch (error) {
            expect(error.message).toBe("Roles can only be assigned as NORMAL or ADMIN")
            expect(error.code).toBe(422)
        }
    })

    test("Return sucess when all parameters are correct", async () => {
        const user = {
            name:"Diego Miyabara",
            email:"diego@gmail.com",
            nickname: "dzmGodz",
            password: "Labenu123456",
            role: "ADMIN"
        }
        const token = await userBusiness.createUser(user)

        expect(token).toBe("fake token")        
    })
})

describe("test endpoint login", () => {
    test("Return error when email is not provided", async() => {
        expect.assertions(2)
        try {
            const loginDTO: LoginInputDTO = {
                emailOrNickname: "",
                password: "Labenu123456"
            }
            await userBusiness.login(loginDTO)
        } catch (error) {
            expect(error.message).toBe("Please inform your email or nickname!")
            expect(error.code).toBe(422)
        }
    })

    test("Return error when password is not provided", async() => {
        expect.assertions(2)
        try {
            const loginDTO: LoginInputDTO = {
                emailOrNickname: "diego@gmail.com",
                password: ""
            }
            await userBusiness.login(loginDTO)
        } catch (error) {
            expect(error.message).toBe("Please inform your password!")
            expect(error.code).toBe(422)
        }
    })

    test("Return error when user not found", async() => {
        expect.assertions(2)
        try {
            const loginDTO: LoginInputDTO = {
                emailOrNickname: "diego@gmail.com",
                password: "Labenu@123"
            }
            await userBusiness.login(loginDTO)
        } catch (error) {
            expect(error.message).toBe("User not found.")
            expect(error.code).toBe(404)
        }
    })

    test("Sucessfully login with email when all informations are correct", async() => {
        userDatabase = {getUser: jest.fn((id: string) => new User("id", "Diego Miyabara", "diego@gmail.com", "dzmGodz", "cypherPassword", User.stringToUserRole("ADMIN")))}
        hashManager = {compare: jest.fn((password: string, cypherPassword: string) => true)}

        const userBusiness = new UserBusiness(userDatabase, idGenerator, hashManager, authenticator)

        const user: LoginInputDTO = {
            emailOrNickname: "diego@gmail.com",
            password: "cypherPassword"
        }

        const result = await userBusiness.login(user)

        expect(result).toBe("fake token")
    })

    test("Sucessfully login with nickname when all informations are correct", async() => {
        userDatabase = {getUser: jest.fn((id: string) => new User("id", "Diego Miyabara", "diego@gmail.com", "dzmGodz", "cypherPassword", User.stringToUserRole("ADMIN")))}
        hashManager = {compare: jest.fn((password: string, cypherPassword: string) => true)}

        const userBusiness = new UserBusiness(userDatabase, idGenerator, hashManager, authenticator)

        const user: LoginInputDTO = {
            emailOrNickname: "dzmGodz",
            password: "cypherPassword"
        }

        const result = await userBusiness.login(user)

        expect(result).toBe("fake token")
    })

})