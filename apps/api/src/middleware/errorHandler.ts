import { type Request, type Response, type NextFunction } from 'express';


export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    const status = err?.status || 500;
    res.status(status).json({ success: false, message: err?.message || 'Internal server error' });
}