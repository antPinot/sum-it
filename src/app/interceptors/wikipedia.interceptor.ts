import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

@Injectable()
export class WikipediaInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes("wikipedia.org")){
      return next.handle(request).pipe(
        catchError((err : HttpErrorResponse) => {
          if (err.status === 404)
            console.log("Page non trouvée")
          return of();
        })
      )
    }
    return next.handle(request);
  }
}
