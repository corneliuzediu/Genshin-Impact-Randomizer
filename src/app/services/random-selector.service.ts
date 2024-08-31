import { Injectable } from '@angular/core';
import { Profile } from '../../types';

@Injectable({
    providedIn: 'root',
})
export class RandomSelectorService {
    private keys: string[] = [];
    private selectedCharacters: any;
    private elements: any;
    private travelerElement: any;
    private weapons: any;
    private stars: any;
    private locations: any;
    private genres: any;
    private heights: any;
    private archon: any;

    constructor() {}

    getRandomItem<T>(items: T[]): T {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    getRandomTeam<T>(obj: { [key: string]: T }, profiles: Profile[]) {
        this.getValuesFromKeys(obj);
        // Filter selected characters based on the key's value
        profiles.forEach((profile) => {
            this.selectedCharacters = profile.characters.filter(
                (character) => character.selected == true
            );
            const availableCharacters = this.selectedCharacters.filter(
                (character) => this.elements.includes(character.element)
            );
            console.log('character: ', availableCharacters);
        });
        console.log('profile: ', typeof this.selectedCharacters);

        // for (const key in obj) {
        //     this.selectedCharacters = selectedCharacters.forEach((character.selected) => {
        //         let elements = obj['elements'];
        //         console.log('elements', elements);
        //         // return character.element === element;
        //     });
        //     if (obj.hasOwnProperty(key)) {
        //         this.keys.push(key);
        //     }
        // }

        for (let i = 0; i < this.keys.length; i++) {
            console.log(obj[this.keys[i]]);
        }
    }

    private getValuesFromKeys<T>(obj: { [key: string]: T }) {
        for (const key in obj) {
            this.travelerElement = Object.values(obj['travelerElement']);
            this.elements = Object.values(obj['elements']);
            this.weapons = Object.values(obj['weapons']);
            this.stars = Object.values(obj['stars']);
            this.locations = Object.values(obj['locations']);
            this.genres = Object.values(obj['genres']);
            this.heights = Object.values(obj['heights']);
            this.archon = Object.values(obj['archon']);
            // console.log(this.travelerElement);
            // console.log(this.elements);
            // console.log(this.weapons);
            // console.log(this.stars);
            // console.log(this.locations);
            // console.log(this.genres);
            // console.log(this.heights);
            // console.log(this.archon);
        }
    }
}
