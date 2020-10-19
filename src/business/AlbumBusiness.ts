import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/Authenticator";
import { InvalidParameterError } from "../error/InvalidParameterError";
import { NotFoundError } from "../error/NotFoundError";
import { AlbumInputDTO, AlbumOutputDTO } from "../model/Album";
import { AlbumDatabase } from "../data/AlbumDatabase";
import { InsuficientAuth } from "../error/InsuficientAuth";
import dayjs from "dayjs";

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

        if(!album.albumImageUrl) {
            album.albumImageUrl = ""
        }

        const today = dayjs().format("YYYY-MM-DD")

        const id = this.idGenerator.generate();
        
        const user = this.authenticator.getData(token)
        
        const albunsDb = await this.albumDatabase.getAlbunsByUserId(user.id)

        albunsDb.map((albumDb:AlbumOutputDTO) => {
            if(albumDb.name === album.name) {
                throw new InvalidParameterError(`You already have an album with the name ${album.name}.`)
            }
        })
        
        return await this.albumDatabase.createAlbum(id, album.name, album.description, album.albumImageUrl, user.id, today);
    }

    async getAllAlbuns(token: string, user_id: string): Promise<AlbumOutputDTO[]> {
        this.authenticator.getData(token)

        const response = await this.albumDatabase.getAllAlbuns(user_id)

        return response
    }

    async getAlbunsByUserId(token: string, hashtag: string, orderDate: string): Promise<AlbumOutputDTO[]> {
        const user = this.authenticator.getData(token)

        if(orderDate !== "ASC" && orderDate !== "DESC" && orderDate) {
            throw new InvalidParameterError("orderDate must be ASC or DESC")
        }

        const response = await this.albumDatabase.getAlbunsByUserId(user.id, hashtag, orderDate)

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