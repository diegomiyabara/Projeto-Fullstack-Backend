import dotenv from "dotenv";
import {AddressInfo} from "net";
import express from "express";
import { userRouter } from "./routes/userRouter";
import { albumRouter } from "./routes/albumRouter";
import cors from 'cors'

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.use("/user", userRouter);
app.use("/album", albumRouter)

const server = app.listen(process.env.PORT || 3003, () => {
    if (server) {
        const address = server.address() as AddressInfo;
        console.log(`Server running on http://localhost:${address.port}`);
        } else {
        console.error(`Unabble to run server.`);
        }
});