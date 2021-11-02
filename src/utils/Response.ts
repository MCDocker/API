import ErrorCode from './ErrorCode';

class RequestResponse {
    constructor(
        public message: string = 'No message provided',
        public success: boolean = false,
        public errorCode: ErrorCode = -1,
        public additionalContent: object = {},
    ) {}

    get toJSON() {
        return {
            message: this.message,
            success: this.success,
            error_code: this.errorCode,
            additional: this.additionalContent,
        };
    }
}

export default RequestResponse;
