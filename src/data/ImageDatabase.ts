import { ImageOutputDTO } from "../model/Image";
import { BaseDatabase } from "./BaseDatabase";


export class ImageDatabase extends BaseDatabase {

    protected tableName: string = "PROJETO_FULLSTACK_IMAGES";

    public async addImage(
        id: string,
        description: string,
        photoUrl: string,
        user_id: string,
        album_id: string
    ): Promise<void> {
        try {
        await super.getConnection()
            .insert({
            id,
            description,
            photoUrl,
            user_id,
            album_id
            })
            .into(this.tableName);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }

    public async getAlbumImages(album_id: string): Promise<ImageOutputDTO[]> {
        try {
            const response = await this.getConnection()
            .select("*")
            .from(this.tableName)
            .where("album_id", album_id)

            return response
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
