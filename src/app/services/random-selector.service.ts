import { Injectable } from '@angular/core';
import { Character, Profile } from '../../types';

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

    getRandomTeam(obj: { [criteria: string]: string[] }, profiles: Profile[]) {
        // Backup holder
        debugger;
        let holder = [];
        profiles.forEach((profile) => {
            this.selectedCharacters = profile.characters.filter(
                (character) => character.selected
            );
            for (let criteria in obj) {
                if (obj.hasOwnProperty(criteria)) {
                    const criteriaValues = obj[criteria];

                    // Apply the filter cumulatively for each criteria
                    this.selectedCharacters = this.selectedCharacters.filter(
                        (character) =>
                            this.matchesCriteria(
                                character,
                                criteria,
                                criteriaValues
                            )
                    );
                }
            }

            console.log(
                'Selected characters after all criteria:',
                this.selectedCharacters
            );

            holder.push({
                userName: profile.userName,
                characters: this.selectedCharacters,
            });
        });
    }

    private matchesCriteria(
        character: Character,
        criteria: string,
        values: string[]
    ): boolean {
        switch (criteria) {
            case 'elements':
                return values.includes(character.element);
            case 'weapons':
                return values.includes(character.weapon);
            case 'stars':
                return values.includes(character.stars);
            case 'locations':
                return values.includes(character.location);
            case 'genres':
                return values.includes(character.sex);
            case 'heights':
                return values.includes(character.height);
            case 'archon':
                if (values) {
                    return character.archon;
                } else return true;
            default:
                return true; // Return true by default if criteria doesn't match any case
        }
    }
}
