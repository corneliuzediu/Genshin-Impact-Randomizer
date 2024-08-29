import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { format } from 'path';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private dataUrl = 'scripts/data.json';
    constructor(private http: HttpClient) {}

    private getStandardOptions(): any {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
        };
    }

    getData(): Observable<any> {
        let options = this.getStandardOptions();

        options.params = new HttpParams({
            fromObject: {
                format: 'json',
            },
        });

        return this.http
            .get(this.dataUrl, options)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.log(
                'There is an issue with the client or nerwork: ',
                error.error
            );
        } else {
            console.log('Server-side error: ', error);
        }

        return throwError(() => {
            new Error(
                'Can not retrieve data from the server. Please try again'
            );
        });
    }
}
