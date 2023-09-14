import {Injectable} from '@nestjs/common';

@Injectable()
export class GameService {

    normalize({x, y} :{x: number, y: number}): {x: number, y: number} {
        const len: number = Math.sqrt(x * x + y * y);
        x /= len;
        y /= len;
        return {x, y}
    }

    scale(v: { x: number; y: number }, factor: number): {x: number, y: number} {
        return {x: v.x * factor, y: v.y * factor};
    }

    add(v1: {x: number; y: number}, v2: {x: number; y: number}): {x: number, y: number} {
        return { x: v1.x + v2.x, y: v1.y + v2.y };
    }
}
