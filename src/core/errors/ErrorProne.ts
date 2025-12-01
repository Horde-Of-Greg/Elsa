import { StandardError } from './StandardError';

export abstract class ErrorProne {
    protected error: StandardError;
    protected className: string;

    /**
     * Create an Error Handle for this class. Call with super(className)
     * @param className The name of the current class.
     */
    constructor(className?: string) {
        this.className = className || this.constructor.name;
        this.error = {
            type: 'error',
            code: null,
            message: null,
            location: __dirname,
            time: null,
            context: null,
            stackTrace: [],
        };
    }

    /**
     * Formats the current error as a client-safe object.
     *
     * @returns Formatted error object ready to send to clients with message, location, time, and stack trace.
     */
    protected sendErrorToClient() {
        return {
            message: this.error.message ? this.error.message : 'no message',
            culprit: `Error in file: ${this.error.location}, from method: ${
                this.error.context ? this.error.context : 'Uknown'
            }`,
            time: this.error.time ? this.error.time : 'Uknown',
            stackTrace: this.error.stackTrace,
        };
    }

    /**
     * Creates a new error and stores it in the instance state.
     * Use when an error originates in the current class.
     *
     * @param code - HTTP-style error code (e.g., 400, 404, 500) https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
     * @param message - Error description
     * @param methodName - (optional) Method name for context
     * @returns The created StandardError with timestamp and empty stack trace
     */
    protected setError(code: number, message: string, methodName?: string): StandardError {
        this.error.code = code;
        this.error.message = message;
        this.error.time = new Date();
        this.error.context = methodName ? `${this.className}.${methodName}` : this.className;
        this.error.stackTrace = [];

        return this.error;
    }

    /**
     * Wraps a child error and propagates it up the call stack with additional context.
     * Use when catching an error from a lower layer to build an error chain.
     *
     * @param childError - The error caught from a deeper method/layer
     * @param message - Contextual message describing what failed at this layer
     * @param methodName - Optional method name for context (becomes "ClassName.methodName")
     * @returns New StandardError preserving the child's code and prepending it to stackTrace
     */
    protected propagateError(
        childError: StandardError,
        message: string,
        methodName?: string,
    ): StandardError {
        const context = methodName ? `${this.className}.${methodName}` : this.className;

        return {
            type: 'error',
            code: childError.code,
            message: message,
            location: __dirname,
            time: new Date(),
            context: context,
            stackTrace: [childError, ...(childError.stackTrace || [])],
        };
    }

    protected getErrorCode() {
        const errorCode = this.error.code;
        if (!errorCode) {
            this.propagateError(
                this.error,
                'Could not even get error code... somehow? Defaulting to 500. If you see this, the API is fucked.',
            );
            return 500;
        }
        return errorCode;
    }

    protected isError(value: any): value is StandardError {
        return value && typeof value === 'object' && value.type === 'error';
    }
}
