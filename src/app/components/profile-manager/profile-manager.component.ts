import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Character } from '../../../types';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-profile-manager',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        FormsModule,
    ],
    templateUrl: './profile-manager.component.html',
    styleUrl: './profile-manager.component.scss',
})
export class ProfileManagerComponent {
    characters: Character[] = [];
    selectedCharacters: Character[] = [];
    nrCharactersSelected: number = 0;
    nrSelectedAnemo: number = 0;
    nrSelectedCryo: number = 0;
    nrSelectedDendro: number = 0;
    nrSelectedElectro: number = 0;
    nrSelectedGeo: number = 0;
    nrSelectedHydro: number = 0;
    nrSelectedPyro: number = 0;

    elements = [
        { name: 'anemo' },
        { name: 'geo' },
        { name: 'electro' },
        { name: 'dendro' },
        { name: 'pyro' },
    ];
    selectedElement: string = '';

    ngOnInit() {
        this.characters = this.getLocalStorage();
    }

    getLocalStorage(): Character[] {
        const storedCharactersLocal = localStorage.getItem('characters');
        if (storedCharactersLocal) {
            return JSON.parse(storedCharactersLocal);
        } else {
            return []; // Return an empty array if nothing is found in local storage
        }
    }

    isSelected(character: Character): boolean {
        return this.selectedCharacters.includes(character);
    }

    toggleSelection(item: Character) {
        const index = this.selectedCharacters.indexOf(item);
        if (index === -1) {
            item.selected = true;
            this.selectedCharacters.push(item);
        } else {
            this.selectedCharacters.splice(index, 1);
        }
        this.updateMarkers();
    }

    updateMarkers() {
        this.nrCharactersSelected = this.selectedCharacters.length;
        this.resetCounters(); //To avoid multiple counting of the same character
        this.selectedCharacters.forEach((character) => {
            console.log(character);
            switch (character.element) {
                case 'anemo':
                    this.nrSelectedAnemo++;
                    break;
                case 'cryo':
                    this.nrSelectedCryo++;
                    break;
                case 'dendro':
                    this.nrSelectedDendro++;
                    break;
                case 'electro':
                    this.nrSelectedElectro++;
                    break;
                case 'geo':
                    this.nrSelectedGeo++;
                    break;
                case 'hydro':
                    this.nrSelectedHydro++;
                    break;
                case 'pyro':
                    this.nrSelectedPyro++;
                    break;
            }
        });
    }

    resetCounters() {
        this.nrSelectedAnemo = 0;
        this.nrSelectedCryo = 0;
        this.nrSelectedDendro = 0;
        this.nrSelectedElectro = 0;
        this.nrSelectedGeo = 0;
        this.nrSelectedHydro = 0;
        this.nrSelectedPyro = 0;
    }
}
