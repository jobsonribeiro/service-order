import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserAgentMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const userAgent = req.headers['user-agent'] || 'unknown';
        console.log(`User-Agent: ${userAgent}`);

        // Adicione verificações ou manipulações conforme necessário
        next();
    }
}
