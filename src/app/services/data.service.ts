import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Character } from '../../types';
import { FormArray } from '@angular/forms';

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

    buildFormArray(fb, items: string[]): FormArray {
        const controls = items.map((item) => item);
        return fb.array(controls);
    }

    buildFormArrayUnchecked(fb, items: string[]): FormArray {
        const controls = items.map(() => fb.control(false));
        return fb.array(controls);
    }


    getDistinctValues<T>(characters: Character[], item: keyof Character): T[] {
        const values = characters.map((character) => character[item]);
        return [...new Set(values)];
    }

    getSelectedProfiles(selectorForm) {
        const checkedProfiles = selectorForm.controls['profiles'].value;
        const stringProfiles = checkedProfiles.filter(
            (value: any) => typeof value === 'string'
        );
        return stringProfiles;
    }

    getSelectedItems(
        formArrayName: string,
        items: string[],
        selectorForm
    ): string[] {
        const formArray = selectorForm.get(formArrayName) as FormArray;
        return formArray.controls
            .map((control, i) => (control.value ? items[i] : null))
            .filter((value) => value !== null);
    }
}
