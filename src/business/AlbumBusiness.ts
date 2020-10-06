import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { InvalidParameterError } from "../error/InvalidParameterError";
import { NotFoundError } from "../error/NotFoundError";
import { AlbumInputDTO } from "../model/Album";
import { AlbumDatabase } from "../data/AlbumDatabase";

export class AlbumBusiness {

    constructor(
        private albumDatabase: AlbumDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    async createAlbum(album: AlbumInputDTO, token: string) {        
        if(!album.name || !album.description  ) {
            throw new InvalidParameterError("All inputs must be filled!")
        }

        const id = this.idGenerator.generate();

        const user = this.authenticator.getData(token)

        return await this.albumDatabase.createAlbum(id, album.name, album.description, user.id);
    }

}