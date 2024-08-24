import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Character, Profile } from '../../../types';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-profile-manager',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        FormsModule,
        CheckboxModule,
        ToggleButtonModule,
        ReactiveFormsModule,
        RadioButtonModule,
    ],
    templateUrl: './profile-manager.component.html',
    styleUrl: './profile-manager.component.scss',
})
export class ProfileManagerComponent {
    @Output() mainAccountChange = new EventEmitter<Profile>();

    profiles: Profile[] = [];
    characters: Character[] = [];
    selectedCharacters: Character[] = [];
    currentProfile: any = null;
    isEditing: boolean = false;

    currentSection: string = 'list'; // Possible values: 'list', 'form', 'delete'
    genre: boolean = true; // Default value

    nrCharactersSelected: number = 0;
    nrSelectedAnemo: number = 0;
    nrSelectedCryo: number = 0;
    nrSelectedDendro: number = 0;
    nrSelectedElectro: number = 0;
    nrSelectedGeo: number = 0;
    nrSelectedHydro: number = 0;
    nrSelectedPyro: number = 0;

    ngOnInit() {
        this.loadProfiles();
        this.characters = this.loadCharacters();
    }

    loadProfiles() {
        const storedProfiles = localStorage.getItem('profiles');
        this.profiles = storedProfiles ? JSON.parse(storedProfiles) : [];
        console.log(this.profiles, 'Profile');
    }

    loadCharacters(): Character[] {
        const storedCharactersLocal = localStorage.getItem('characters');
        return storedCharactersLocal ? JSON.parse(storedCharactersLocal) : [];
    }

    saveProfiles() {
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
    }

    createProfile() {
        this.currentProfile = {
            id: Date.now().toString(),
            userName: '',
            mainAccount: false,
            traveler: '',
            selectedCharacters: [],
        }; // Initialize with default values
        this.selectedCharacters = []; // Reset selected characters
        this.isEditing = false;
        this.currentSection = 'form';
    }

    editProfile(profile: Profile) {
        this.resetCounters();
        this.currentProfile = { ...profile };
        this.selectedCharacters = [...this.currentProfile.selectedCharacters]; // Load selected characters for editing
        this.isEditing = true;
        this.currentSection = 'form';
    }

    saveProfile() {
        this.currentProfile.selectedCharacters = this.selectedCharacters;
        this.currentProfile.traveler = this.getTraveler();
        if (this.isEditing) {
            const index = this.profiles.findIndex(
                (p) => p.id === this.currentProfile.id
            );
            if (index > -1) {
                this.profiles[index] = this.currentProfile;
            }
        } else {
            this.profiles.push(this.currentProfile);
        }
        this.saveProfiles();
        this.currentSection = 'list';
    }

    confirmDeleteProfile(profile: Profile) {
        this.currentProfile = profile;
        this.currentSection = 'delete';
    }

    deleteProfile() {
        this.profiles = this.profiles.filter((p) => p !== this.currentProfile);
        this.saveProfiles();
        this.currentSection = 'list';
    }

    cancel() {
        this.currentProfile = null;
        this.currentSection = 'list';
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

    getTraveler() {
        debugger;
        if (this.genre) {
            return this.characters.find(
                (character) => character.name === 'Aether'
            );
        } else if (!this.genre) {
            return this.characters.find(
                (character) => character.name === 'Lumine'
            );
        }
        return undefined;
    }

    updateMarkers() {
        this.nrCharactersSelected = this.selectedCharacters.length;
        this.resetCounters(); //To avoid multiple counting of the same character
        this.selectedCharacters.forEach((character) => {
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
