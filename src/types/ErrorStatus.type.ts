export type ErrorStatus = {
    // might be contain something else
    [any: string]: any;

    statusCode: number;
    message: string;
};
