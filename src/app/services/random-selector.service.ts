import { Injectable } from '@angular/core';
import { Character, Profile } from '../../types';

@Injectable({
    providedIn: 'root',
})
export class RandomSelectorService {
    private selectedCharacters: any;
    private holder = [];
    private nrOfCharacters: any;
    private profileWithPreviousCharacters = [];

    constructor() {}

    getRandomItem<T>(items: T[]): T {
        const randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    }

    getRandomTeam(obj: { [criteria: string]: string[] }, profiles: Profile[]) {
        this.holder = [];

        profiles.forEach((profile) => {
            if (obj['profiles'].includes(profile.userName)) {
                this.selectedCharacters = profile.characters.filter(
                    (character) => character.selected
                );
                //Apply filtering based on criteria
                for (let criteria in obj) {
                    if (obj.hasOwnProperty(criteria)) {
                        const criteriaValues = obj[criteria];
                        if (criteria === 'nrOfCharacters') {
                            this.nrOfCharacters = obj[criteria];
                        }

                        // Apply the filter cumulatively for each criteria
                        this.selectedCharacters =
                            this.selectedCharacters.filter((character) =>
                                this.matchesCriteria(
                                    character,
                                    criteria,
                                    criteriaValues
                                )
                            );
                    }
                }

                if (this.selectedCharacters.length > 0) {
                    this.holder.push({
                        userName: profile.userName,
                        characters: this.selectedCharacters,
                    });
                }
            }
        });

        return this.getRandomCharactersPerAccount();
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

    getRandomCharactersPerAccount() {
        let profilesWithRandomCharacters = [];
        console.log('in: ', this.profileWithPreviousCharacters);

        this.holder.forEach((profile) => {
            let tempCharacters = [...profile.characters];

            this.profileWithPreviousCharacters.forEach((previousProfile) => {
                if (profile.userName === previousProfile.userName) {
                    tempCharacters = tempCharacters.filter(
                        (character) =>
                            !previousProfile.characters.includes(character)
                    );
                }
            });

            let randomSelectedCharacters = [];

            for (let i = 0; i < this.nrOfCharacters; i++) {
                let randomSelectedCharacter =
                    this.getRandomItem(tempCharacters);
                if (randomSelectedCharacter) {
                    randomSelectedCharacters.push(randomSelectedCharacter);

                    // Remove selected character from temporary array
                    tempCharacters = tempCharacters.filter(
                        (character) => character !== randomSelectedCharacter
                    );
                }
            }

            profilesWithRandomCharacters.push({
                userName: profile.userName,
                characters: randomSelectedCharacters,
            });
        });
        this.profileWithPreviousCharacters = profilesWithRandomCharacters;

        return profilesWithRandomCharacters;
    }
}
