import { AlbumBusiness } from '../src/business/AlbumBusiness'
import { Album, AlbumInputDTO } from '../src/model/Album'
import { UserRole } from '../src/model/User'

let albumDatabase = {
    createAlbum: jest.fn(async(album: Album, token: string) => {}),
    getAllAlbuns: jest.fn(async(token: string) => undefined),
    getAlbunsByUserId: jest.fn(async(token: string) => undefined),
    getAlbumById: jest.fn(async(albumId: string, token:string) => undefined)
} as any

const idGenerator = {
    generate: jest.fn(() => "id mock")
} as any

const authenticator = {
    generateToken: jest.fn((payload: {id: string, role: UserRole}) => "fake token"),
    getData: jest.fn((token: string) => {return {id: "id", name: "Admin",role: "ADMIN"}})
} as any

const albumBusiness: AlbumBusiness = new AlbumBusiness(albumDatabase,idGenerator,authenticator)

describe("Create album endpoint", () => {
    test("Return error when album name is not informed", async() => {
        expect.assertions(2)
        try {
            const token = authenticator.generate

            const album:AlbumInputDTO = {
                name: "",
                description: "Férias em meio a pandemia",
                albumImageUrl: "https://picsum.photos/seed/picsum/200/300"
            }

            await albumBusiness.createAlbum(album, token)

        } catch (error) {
            expect(error.code).toBe(422)
            expect(error.message).toBe("All inputs must be filled!")
        }
    })

    test("Return error when album description is not informed", async() => {
        expect.assertions(2)
        try {
            const token = authenticator.generate

            const album:AlbumInputDTO = {
                name: "Férias 2020",
                description: "",
                albumImageUrl: "https://picsum.photos/seed/picsum/200/300"
            }

            await albumBusiness.createAlbum(album, token)

        } catch (error) {
            expect(error.code).toBe(422)
            expect(error.message).toBe("All inputs must be filled!")
        }
    })

    // test("Return error when album name already exists", async() => {
    //     expect.assertions(2)
    //     try {
    //         const token = authenticator.generateToken

    //         albumDatabase = {getAlbunsByUserId: jest.fn(async(token: string) => [new Album("id mock", "Férias 2020", "Ferias inesqueciveis", "id")])}

    //         const album:AlbumInputDTO = {
    //             name: "Férias 2020",
    //             description: "Férias top demais",
    //             albumImageUrl: "https://picsum.photos/seed/picsum/200/300"
    //         }

    //         await albumBusiness.createAlbum(album, token)

    //     } catch (error) {
    //         expect(error.code).toBe(422)
    //         expect(error.message).toBe("You already have an album with the name Férias 2020.")
    //     }
    // })
})