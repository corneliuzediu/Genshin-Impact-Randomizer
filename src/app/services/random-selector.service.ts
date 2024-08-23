import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RandomSelectorService {
    constructor() {}

    getRandomItem<T>(items: T[]): T {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }
}
