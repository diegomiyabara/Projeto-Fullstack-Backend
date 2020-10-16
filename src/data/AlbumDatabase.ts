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
        user_id: string,
        createdAt: string
    ): Promise<void> {
        try {
        await super.getConnection()
            .insert({
            id,
            name,
            description,
            albumImageUrl,
            user_id,
            createdAt
            })
            .into(this.tableName);
        } catch (error) {
        if(error.message.includes("for key 'name'")) {
            throw new InvalidParameterError("There is already an album with this name!")
        }
        throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAllAlbuns(userId?: string) :Promise <AlbumOutputDTO[]> {
        let idQuery = ""
        if(userId) {
            idQuery = `WHERE user_id = "${userId}"`
        }
        try {
            const response = await super.getConnection()
            .raw(`SELECT ${this.tableName}.id, ${this.tableName}.name, description, albumImageUrl, user_id, PROJETO_FULLSTACK_USERS.name as user_name 
            FROM PROJETO_FULLSTACK_USERS
            JOIN ${this.tableName} ON PROJETO_FULLSTACK_USERS.id = ${this.tableName}.user_id
            ${idQuery};`)

            return response[0]
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAlbunsByUserId(user_id: string, albumName?: string, albumDate?: string): Promise<AlbumOutputDTO[]> {
        let nameQuery = ""
        let dateQuery = "ORDER BY createdAt DESC"
        if(albumName) {
            nameQuery = `AND name LIKE '%${albumName}%'`
        } 
        if(albumDate) {
            dateQuery = `ORDER BY createdAt ${albumDate}`
        }
        try {
            const response = await super.getConnection()
            .raw(`
                SELECT * FROM ${this.tableName}
                WHERE user_id = "${user_id}"
                ${nameQuery}
                ${dateQuery};
            `)

            return response[0]
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
