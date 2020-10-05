export class User{
    constructor(
    private id: string,
    private name: string,
    private email: string,
    private nickname: string,
    private password: string,
    private role: UserRole
    ){}

    getId(){
        return this.id;
    }

    getName(){
        return this.name
    }

    getEmail(){
        return this.email;
    }

    getNickname(){
        return this.nickname;
    }

    getPassword(){
        return this.password;
    }

    getRole(){
        return this.role;
    }

    setId(id: string){
        this.id = id;
    }

    setName(name: string){
        this.name = name;
    }

    setEmail(email: string){
        this.email = email;
    }

    setNickname(nickname: string){
        this.nickname = nickname;
    }

    setPassword(password: string){
        this.password = password;
    }

    setRole(role: UserRole){
        this.role = role;
    }

    static stringToUserRole(input: string): UserRole{
        switch (input) {
            case "NORMAL":
                return UserRole.NORMAL;
            case "ADMIN":
                return UserRole.ADMIN;
            default:
                throw new Error("Invalid user role");
        }
    }

    static toUserModel(user: any): User {
        if(!user) {
            throw new Error("User not found")
        }
        return new User(user.id, user.name, user.email, user.nickname, user.password, User.stringToUserRole(user.role));
    }
}

export interface UserInputDTO{
    name: string;
    email: string;
    password: string;
    nickname: string;
    role: string;
}

export interface LoginInputDTO{
    email?: string;
    nickname?: string;
    password: string;
}

export enum UserRole{
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}