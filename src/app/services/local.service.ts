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

    loadLocalItem(name: string) {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : [];
    }
}
