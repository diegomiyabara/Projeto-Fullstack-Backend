export class User{
    constructor(
    private id: string,
    private name: string,
    private email: string,
    private nickname: string,
    private password: string,
    private role: UserRole,
    private photoUrl: string
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

    getPhotoUrl() {
        return this.photoUrl
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

    setPhotoUrl(photoUrl: string) {
        this.photoUrl = photoUrl
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
        return new User(user.id, user.name, user.email, user.nickname, user.password, User.stringToUserRole(user.role), user.photoUrl);
    }
}

export interface UserInputDTO{
    name: string;
    email: string;
    password: string;
    nickname: string;
    role: string;
    photoUrl: string;
}

export interface LoginInputDTO{
    emailOrNickname: string;
    password: string;
}

export interface UserOutputDTO {
    id: string,
    name: string,
    email: string,
    nickname: string,
    photoUrl: string
}

export enum UserRole{
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}