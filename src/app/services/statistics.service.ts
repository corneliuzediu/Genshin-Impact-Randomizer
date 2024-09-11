import { Injectable } from '@angular/core';
import { Profile, StatsTemplate } from '../../types';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root',
})
export class StatisticsService {
    distinctElements!: string[];
    statsHolder: StatsTemplate;

    constructor(private data: DataService) {}

    getProfilesStats(profile: Profile) {
        this.statsHolder = new StatsTemplate();
        // Get selected characters
        let selectedCharacters = profile.characters.filter(
            (character) => character.selected
        );

        // Take data from selected characters
        selectedCharacters.forEach((character) => {
            character = this.capitalizeKeys(character);
            this.incrementCounters(character);
        });

        //Return stats
        return this.statsHolder;
    }

    private incrementCounters(character) {
        // Handle elements
        this.incrementCount(
            this.statsHolder.elements,
            character.element,
            character.stars
        );

        // Handle weapons
        this.incrementCount(
            this.statsHolder.weapons,
            character.weapon,
            character.stars
        );

        // // Handle stars
        this.incrementCount(
            this.statsHolder.stars,
            character.stars,
            character.stars
        );

        // // Handle genres
        this.incrementCount(
            this.statsHolder.genres,
            character.sex,
            character.stars
        );

        // // Handle height
        this.incrementCount(
            this.statsHolder.height,
            character.height,
            character.stars
        );
    }

    // Helper function to increment counts in the holder object
    private incrementCount(holderCategory: any, key: string, stars: string) {
        // Ensure the key exists in both 'all' and star-specific categories, initializing to 0 if needed
        if (!holderCategory.all[key]) {
            holderCategory.all[key] = 0;
        }

        if (!holderCategory['5 stars'][key]) {
            holderCategory['5 stars'][key] = 0;
        }

        if (!holderCategory['4 stars'][key]) {
            holderCategory['4 stars'][key] = 0;
        }

        // Increment general count (all)
        holderCategory.all[key]++;

        // Increment by stars
        if (stars === '5') {
            holderCategory['5 stars'][key]++;
        } else if (stars === '4') {
            holderCategory['4 stars'][key]++;
        }
    }

    private capitalizeKeys(character) {
        character.element = this.capitalizeFirstLetter(character.element);
        character.weapon = this.capitalizeFirstLetter(character.weapon);
        character.location = this.capitalizeFirstLetter(character.location);
        return character;
    }

    private capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
