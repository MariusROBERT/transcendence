import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator( // creation de decorateur
  (data: string, ctx: ExecutionContext) => { // option et context d'execution 
    const request = ctx.switchToHttp().getRequest(); // recup req et res
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
