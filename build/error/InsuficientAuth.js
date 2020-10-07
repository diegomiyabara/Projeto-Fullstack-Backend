"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuficientAuth = void 0;
const BaseError_1 = require("./BaseError");
class InsuficientAuth extends BaseError_1.BaseError {
    constructor(message) {
        super(message, 410);
    }
}
exports.InsuficientAuth = InsuficientAuth;
//# sourceMappingURL=InsuficientAuth.js.map