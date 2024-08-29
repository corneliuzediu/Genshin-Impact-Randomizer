import { Injectable } from '@angular/core';
import { Character, OpenWorldBoss, WeeklyBoss } from '../../types';

@Injectable({
    providedIn: 'root',
})
export class LocalService {
    constructor() {}

    saveLocalStorage(name: string, obj: any) {
        const objString = JSON.stringify(obj);
        localStorage.setItem(name, objString);
    }

    getLocalStorage(): Character[] | WeeklyBoss[] | OpenWorldBoss[] {
        const storedCharactersLocal = localStorage.getItem('characters');
        if (storedCharactersLocal) {
            return JSON.parse(storedCharactersLocal);
        } else {
            return []; // Return an empty array if nothing is found in local storage
        }
    }

    loadLocalItem(name: string) {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : [];
    }
}
