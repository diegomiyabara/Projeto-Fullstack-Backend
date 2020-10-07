"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
class Image {
    constructor(id, description, user_id, album_id) {
        this.id = id;
        this.description = description;
        this.user_id = user_id;
        this.album_id = album_id;
    }
    getId() {
        return this.id;
    }
    getDescription() {
        return this.description;
    }
    getUserId() {
        return this.user_id;
    }
    getAlbumId() {
        return this.album_id;
    }
    setId(id) {
        this.id = id;
    }
    setDescription(description) {
        this.description = description;
    }
    setUserId(user_id) {
        this.user_id = user_id;
    }
    setAlbumId(album_id) {
        this.album_id = album_id;
    }
}
exports.Image = Image;
//# sourceMappingURL=Image.js.map