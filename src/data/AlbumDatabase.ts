import { BaseDatabase } from "./BaseDatabase";
import { InvalidParameterError } from "../error/InvalidParameterError";
import { Album } from "../model/Album";

export class AlbumDatabase extends BaseDatabase {

    protected tableName: string = "PROJETO_FULLSTACK_ALBUNS";

    private toModel(dbModel?: any): Album | undefined {
        return (
        dbModel &&
        new Album(
            dbModel.id,
            dbModel.name,
            dbModel.description,
            dbModel.user_id
        )
        );
    }

    public async createAlbum(
        id: string,
        name: string,
        description: string,
        user_id: string
    ): Promise<void> {
        try {
        await super.getConnection()
            .insert({
            id,
            name,
            description,
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

}
