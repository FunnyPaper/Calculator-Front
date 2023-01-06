import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from "rxjs";
import environment from 'src/environments/environment';

/**
 * Url modificator (injects base url of localhost)
 */
@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({
      url: `${environment.baseUrl}${req.url}`
    }));
  }
}
