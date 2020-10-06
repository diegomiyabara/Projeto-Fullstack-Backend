import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { InvalidParameterError } from "../error/InvalidParameterError";
import { NotFoundError } from "../error/NotFoundError";
import { AlbumInputDTO, AlbumOutputDTO } from "../model/Album";
import { AlbumDatabase } from "../data/AlbumDatabase";
import { InsuficientAuth } from "../error/InsuficientAuth";

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

    async getAllAlbuns(token: string): Promise<AlbumOutputDTO[]> {
        const user = this.authenticator.getData(token)

        if(user.role !== "ADMIN") {
            throw new InsuficientAuth("Only Admins can acess all albuns")
        }

        const response = await this.albumDatabase.getAllAlbuns()

        return response
    }

    async getAlbunsByUserId(token: string): Promise<AlbumOutputDTO[]> {
        const user = this.authenticator.getData(token)

        const response = await this.albumDatabase.getAlbunsByUserId(user.id)

        return response
    }

    async getAlbumById (albumId: string, token: string): Promise<AlbumOutputDTO> {
        const user = this.authenticator.getData(token)

        const response = await this.albumDatabase.getAlbumById(albumId)

        if(!response) {
            throw new NotFoundError("Album not found!")
        }

        if(user.id !== response.user_id && user.role !== "ADMIN"){
            throw new InsuficientAuth("You can only acess your own albuns!")
        }

        return response
    }
}