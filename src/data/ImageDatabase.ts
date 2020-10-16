import { ImageOutputDTO } from "../model/Image";
import { BaseDatabase } from "./BaseDatabase";


export class ImageDatabase extends BaseDatabase {

    protected tableName: string = "PROJETO_FULLSTACK_IMAGES";

    public async addImage(
        id: string,
        description: string,
        photoUrl: string,
        user_id: string,
        album_id: string,
        createdAt: string
    ): Promise<void> {
        try {
        await super.getConnection()
            .insert({
            id,
            description,
            photoUrl,
            user_id,
            album_id,
            createdAt
            })
            .into(this.tableName);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAlbumImages(album_id: string, hashtag: string, orderDate: string): Promise<ImageOutputDTO[]> {
        let hashQuery = ""
        let dateQuery = ""
        if(hashtag) {
            hashQuery = `AND description LIKE '%${hashtag}%'`
        }
        if(orderDate) {
            dateQuery = `ORDER BY createdAt ${orderDate}`
        }
        try {
            const response = await this.getConnection()
            .raw(`
                SELECT * FROM ${this.tableName}
                WHERE album_id = "${album_id}"
                ${hashQuery}
                ${dateQuery};
            `)

            return response[0]
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getImageById(id: string): Promise<ImageOutputDTO> {
        try {
            const response = await this.getConnection()
            .select("*")
            .from(this.tableName)
            .where("id", id)

            return response[0]
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}
