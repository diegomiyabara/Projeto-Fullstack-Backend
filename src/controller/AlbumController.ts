import { Request, Response } from "express";
import { BaseDatabase } from "../data/BaseDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";
import { AlbumBusiness } from "../business/AlbumBusiness";
import { AlbumDatabase } from "../data/AlbumDatabase";
import { AlbumInputDTO } from "../model/Album";

export class AlbumController {
    private static albumBusiness = new AlbumBusiness(
        new AlbumDatabase(),
        new IdGenerator(),
        new Authenticator()
    );

    async createAlbum(req: Request, res: Response) {
        try {
            const input: AlbumInputDTO = {
                name: req.body.name as string,
                description: req.body.description as string
            }

            const token = req.headers.authorization as string

            await AlbumController.albumBusiness.createAlbum(input, token)

            res.status(200).send({ message: `Album ${input.name} created sucessfully!` });
        } catch (error) {
            res.status(error.code || 400).send({ message: error.message });
        }

        await BaseDatabase.destroyConnection();
    }
}