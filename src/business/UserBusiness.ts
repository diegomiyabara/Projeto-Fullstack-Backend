import { UserInputDTO, LoginInputDTO, User, UserRole, UserOutputDTO } from "../model/User";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { InvalidParameterError } from "../error/InvalidParameterError";
import { NotFoundError } from "../error/NotFoundError";

export class UserBusiness {

    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager ,
        private authenticator: Authenticator
    ){}

    async createUser(user: UserInputDTO) {        
        if(!user.name || !user.email || !user.nickname || !user.password ) {
            throw new InvalidParameterError("All inputs must be filled!")
        }

        if (user.email.indexOf("@") === -1) {
            throw new InvalidParameterError("Invalid email");
        }

        if(user.nickname.length < 3) {
            throw new InvalidParameterError("Nickname must contain at least 3 characters")
        }

        if(!user.password.match('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$')) {
            throw new InvalidParameterError ("Password must have at least 8 characters, have one upper and one lower case!")
        }

        if(!user.role) {
            user.role = UserRole.NORMAL
        }

        if(user.role !== "ADMIN" && user.role !== "NORMAL") {
            throw new InvalidParameterError("Roles can only be assigned as NORMAL or ADMIN")
        }

        const id = this.idGenerator.generate();

        const hashPassword = await this.hashManager.hash(user.password);

        await this.userDatabase.createUser(id, user.name, user.email, user.nickname, hashPassword, user.role);

        const accessToken = this.authenticator.generateToken({ id, name: user.name, role: user.role });

        return accessToken;
    }

    async login(user: LoginInputDTO) {
        if(!user.emailOrNickname) {
            throw new InvalidParameterError("Please inform your email or nickname!")
        }

        if(!user.password) {
            throw new InvalidParameterError("Please inform your password!")
        }

        const userDb = await this.userDatabase.getUser(user.emailOrNickname);

        if (!userDb) {
            throw new NotFoundError("User not found.")
        }

        const hashCompare = await this.hashManager.compare(user.password, userDb && userDb.getPassword());

        const accessToken = this.authenticator.generateToken({ id: userDb.getId(),name: userDb.getName(), role: userDb.getRole() });

        if (!hashCompare) {
            throw new Error("Invalid Password!");
        }

        return accessToken;
    }

    async getUsers(token: string, hashtag: string): Promise<UserOutputDTO[]> {
        const user = this.authenticator.getData(token)

        if(!hashtag) {
            hashtag = ""
        }

        const users = await this.userDatabase.getAllUsers(user.id, hashtag)

        const formatUsers = users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                nickname: user.nickname
            }
        })
        
        return formatUsers
    }

    async followUser(token: string, user_to_follow_id: string): Promise<UserOutputDTO> {
        const user = this.authenticator.getData(token)

        if(!user_to_follow_id){
            throw new NotFoundError("Please inform the user to follow id.")
        }

        const friend = await this.userDatabase.getUserById(user_to_follow_id)

        await this.userDatabase.followUser(user.id, user_to_follow_id)

        return friend
    }

    async unfollowUser(token: string, user_to_unfollow_id: string): Promise<UserOutputDTO> {
        const user = this.authenticator.getData(token)

        if(!user_to_unfollow_id){
            throw new NotFoundError("Please inform the user to unfollow id.")
        }

        const friend = await this.userDatabase.getUserById(user_to_unfollow_id)

        await this.userDatabase.unfollowUser(user.id, user_to_unfollow_id)

        return friend
    }

    async getFeed(token: string, hashtag: string, orderDate: string): Promise<any[]> {
        const user = this.authenticator.getData(token)

        if(orderDate !== "ASC" && orderDate !== "DESC" && orderDate) {
            throw new InvalidParameterError("The query orderBy must be ASC or DESC")
        }

        const feed = await this.userDatabase.getFeed(user.id, hashtag, orderDate)

        return feed
    }
}