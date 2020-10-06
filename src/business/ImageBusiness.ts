import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { InvalidParameterError } from "../error/InvalidParameterError";
import { ImageDatabase } from "../data/ImageDatabase";
import { ImageInputDTO } from "../model/Image";
import { AlbumDatabase } from "../data/AlbumDatabase";
import { AlbumOutputDTO } from "../model/Album";
import { InsuficientAuth } from "../error/InsuficientAuth";

export class ImageBusiness {

    constructor(
        private imageDatabase: ImageDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ){}

    async addImage(image: ImageInputDTO, token: string): Promise<AlbumOutputDTO> {        
        if(!image.description || !image.photoUrl || !image.album_id) {
            throw new InvalidParameterError("All inputs must be filled!")
        }

        const id = this.idGenerator.generate();

        const user = this.authenticator.getData(token)

        const albumDatabase = new AlbumDatabase()
        const album = await albumDatabase.getAlbumById(image.album_id)

        if(user.id !== album.user_id) {
            throw new InsuficientAuth("You can only add images to your albuns!")
        }

        await this.imageDatabase.addImage(id, image.description, image.photoUrl, user.id, image.album_id);

        return album
    }
}