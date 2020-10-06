import { BaseDatabase } from "./BaseDatabase";


export class ImageDatabase extends BaseDatabase {

    protected tableName: string = "PROJETO_FULLSTACK_IMAGES";

    public async addImage(
        id: string,
        description: string,
        user_id: string,
        album_id: string
    ): Promise<void> {
        try {
        await super.getConnection()
            .insert({
            id,
            description,
            user_id,
            album_id
            })
            .into(this.tableName);
        } catch (error) {
            throw new Error(error.sqlMessage || error.message);
        }
    }
}
