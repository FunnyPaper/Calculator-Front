import { SnackBarComponent } from './../components/snack-bar/snack-bar.component';
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorCatcherInterceptor implements HttpInterceptor {
  private __snackBar!: MatSnackBar;
  constructor(private __injector: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.__snackBar = this.__injector.get(MatSnackBar);
    return next.handle(request).pipe<any>(catchError((error: HttpErrorResponse) => {
      if(typeof error.error === 'string') {
        this.__snackBar.openFromComponent(SnackBarComponent, {
          data: error.error,
          duration: 15000,
          panelClass: ['error-snack-bar']
        })
      }
      return throwError(() => error);
    }));
  }
}
