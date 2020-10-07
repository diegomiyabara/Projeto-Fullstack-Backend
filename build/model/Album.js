"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
class Album {
    constructor(id, name, description, user_id) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.user_id = user_id;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getDescription() {
        return this.description;
    }
    getUserId() {
        return this.user_id;
    }
    setId(id) {
        this.id = id;
    }
    setName(name) {
        this.name = name;
    }
    setDescription(description) {
        this.description = description;
    }
    setUserId(user_id) {
        this.user_id = user_id;
    }
    static toAlbumModel(album) {
        if (!album) {
            throw new Error("Album not found");
        }
        return new Album(album.id, album.name, album.description, album.user_id);
    }
}
exports.Album = Album;
//# sourceMappingURL=Album.js.map