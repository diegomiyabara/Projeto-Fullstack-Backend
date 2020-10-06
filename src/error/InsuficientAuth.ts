import { BaseError } from "./BaseError";

export class InsuficientAuth extends BaseError {
    constructor(message: string) {
        super(message, 410);
    }
}
