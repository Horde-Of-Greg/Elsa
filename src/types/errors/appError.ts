export type AppErrorData = Record<string, unknown>;
export type AppErrorStack = string[] | undefined;

export type AppErrorParams = {
    name: string;
    code: string;
    message: string;
    timestamp: Date;
    data?: AppErrorData;
    stack: AppErrorStack;
};

export type AppErrorClientResponse = {
    error: string;
    message: string;
    timestamp: Date;
};
