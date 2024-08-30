import { Injectable } from '@angular/core';
import { Profile } from '../../types';

@Injectable({
    providedIn: 'root',
})
export class RandomSelectorService {
    private keys: string[] = [];
    constructor() {}

    getRandomItem<T>(items: T[]): T {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    getRandomTeam<T>(obj: { [key: string]: T }, profiles: Profile[]) {
        // Filter selected characters based on the key's value
        let selectedCharacters;
        profiles.forEach((profile) => {
            selectedCharacters = profile.characters.filter(
                (character) => character.selected == true
            );
        });
        for (const key in obj) {
            selectedCharacters = selectedCharacters.forEach((character) => {
                let elements = obj['elements'];
                console.log('elements', elements);
                // return character.element === element;
            });
            if (obj.hasOwnProperty(key)) {
                this.keys.push(key);
            }
        }

        for (let i = 0; i < this.keys.length; i++) {
            console.log(obj[this.keys[i]]);
        }
    }
}
