import { BaseDatabase } from "./BaseDatabase";
import { InvalidParameterError } from "../error/InvalidParameterError";
import { Album, AlbumOutputDTO } from "../model/Album";

export class AlbumDatabase extends BaseDatabase {

    protected tableName: string = "PROJETO_FULLSTACK_ALBUNS";

    public async createAlbum(
        id: string,
        name: string,
        description: string,
        albumImageUrl: string,
        user_id: string
    ): Promise<void> {
        try {
        await super.getConnection()
            .insert({
            id,
            name,
            description,
            albumImageUrl,
            user_id
            })
            .into(this.tableName);
        } catch (error) {
        if(error.message.includes("for key 'name'")) {
            throw new InvalidParameterError("There is already an album with this name!")
        }
        throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAllAlbuns() :Promise <AlbumOutputDTO[]> {
        try {
            const response = await super.getConnection()
            .raw(`SELECT ${this.tableName}.id, ${this.tableName}.name, description, albumImageUrl, user_id, PROJETO_FULLSTACK_USERS.name as user_name 
            FROM PROJETO_FULLSTACK_USERS
            JOIN ${this.tableName} ON PROJETO_FULLSTACK_USERS.id = ${this.tableName}.user_id;`)

            return response[0]
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAlbunsByUserId(user_id: string): Promise<AlbumOutputDTO[]> {
        try {
            const response = await super.getConnection()
            .select("*")
            .from(this.tableName)
            .where("user_id", user_id)

            return response
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAlbumById(albumId: string): Promise<AlbumOutputDTO> {
        try {
            const response = await super.getConnection()
            .select("*")
            .from(this.tableName)
            .where("id", albumId)

            return response[0]
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}
