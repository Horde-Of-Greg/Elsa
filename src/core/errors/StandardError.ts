import { PathLike } from 'fs';

export type StandardError = {
    type: 'error';
    code: number | null;
    message: string | null;
    location: PathLike | null;
    time: Date | null;
    context?: string | null; // Method/class context where error occurred
    stackTrace?: StandardError[]; // Chain of errors from deepest to shallowest
};
