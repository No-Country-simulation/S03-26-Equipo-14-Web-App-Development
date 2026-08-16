import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { IS_OPTIONAL_AUTH_KEY } from "../decorators/optional-auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt"){
    constructor(private reflector: Reflector){
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        )
    
        if(isPublic){
            return true
        }
    
        return super.canActivate(context)
    }

    handleRequest(err, user, info, context) {
        const isOptionalAuth = this.reflector.getAllAndOverride<boolean>(
        IS_OPTIONAL_AUTH_KEY,
        [context.getHandler(), context.getClass()]
        );

        if (isOptionalAuth) {
        // if is optional auth, not return error
        return user ?? undefined;
        }

        if (err || !user) {
        throw err || new UnauthorizedException();
        }

        return user;
    }
}