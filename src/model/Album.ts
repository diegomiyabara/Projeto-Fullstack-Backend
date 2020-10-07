export class Album{
    constructor(
    private id: string,
    private name: string,
    private description: string,
    private user_id: string
    ){}

    getId(){
        return this.id;
    }

    getName(){
        return this.name
    }

    getDescription() {
        return this.description
    }

    getUserId() {
        return this.user_id
    }

    setId(id: string){
        this.id = id;
    }

    setName(name: string){
        this.name = name;
    }

    setDescription(description: string) {
        this.description = description
    }

    setUserId(user_id: string) {
        this.user_id = user_id
    }

    static toAlbumModel(album: any): Album {
        if(!album) {
            throw new Error("Album not found")
        }
        return new Album(album.id, album.name, album.description, album.user_id);
    }
}

export interface AlbumInputDTO{
    name: string;
    albumImageUrl: string,
    description: string;
}

export interface AlbumOutputDTO{
    id: string,
    name: string,
    description: string,
    albumImageUrl: string,
    user_id: string,
    user_name?: string
}
