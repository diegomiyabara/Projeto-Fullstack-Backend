export class Image{
    constructor(
    private id: string,
    private description: string,
    private user_id: string,
    private album_id: string
    ){}

    getId(){
        return this.id;
    }

    getDescription() {
        return this.description
    }

    getUserId() {
        return this.user_id
    }

    getAlbumId(){
        return this.album_id
    }

    setId(id: string){
        this.id = id;
    }

    setDescription(description: string) {
        this.description = description
    }

    setUserId(user_id: string) {
        this.user_id = user_id
    }

    setAlbumId(album_id: string){
        this.album_id = album_id;
    }
}

export interface ImageInputDTO{
    description: string;
    album_id: string;
}

export interface AlbumOutputDTO{
    id: string,
    description: string,
    user_id: string,
    album_id: string
}
