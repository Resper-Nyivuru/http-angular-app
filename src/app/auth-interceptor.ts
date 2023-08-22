import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

export class AuthInterceptorService implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler){
        const modifiedReq = req.clone({headers: req.headers.append('Auth', 'xyz')})
        //map transforms the response while, tap, just taps into the response...
        return next.handle(modifiedReq);
    }
}