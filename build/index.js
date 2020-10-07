"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("./routes/userRouter");
const albumRouter_1 = require("./routes/albumRouter");
const imageRouter_1 = require("./routes/imageRouter");
dotenv_1.default.config();
const app = express_1.default();
app.use(express_1.default.json());
app.use("/user", userRouter_1.userRouter);
app.use("/album", albumRouter_1.albumRouter);
app.use("/image", imageRouter_1.imageRouter);
const server = app.listen(3000, () => {
    if (server) {
        const address = server.address();
        console.log(`Server running on http://localhost:${address.port}`);
    }
    else {
        console.error(`Unabble to run server.`);
    }
});
//# sourceMappingURL=index.js.map