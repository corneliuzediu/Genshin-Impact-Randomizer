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
import { LocalService } from '../../services/local.service';

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
    characters!: Character[];
    selectedCharacters: Character[] = [];
    currentProfile: any = null;
    isEditing: boolean = false;

    currentSection: string = 'list'; // Possible values: 'list', 'form', 'delete'
    isTravelerMale: boolean = true; // Default value

    elements: any = [
        { name: 'anemo' },
        { name: 'geo' },
        { name: 'electro' },
        { name: 'dendro' },
        { name: 'hydro' },
    ];
    selectedElement: any | undefined;

    nrCharactersSelected: number = 0;
    elementCounters: { [key: string]: number } = {
        anemo: 0,
        cryo: 0,
        dendro: 0,
        electro: 0,
        geo: 0,
        hydro: 0,
        pyro: 0,
    };

    constructor(private local: LocalService) {}

    ngOnInit() {
        this.loadLocal();
    }

    loadLocal() {
        this.profiles = this.local.loadLocalItem('profiles');
        this.characters = this.local.loadLocalItem('characters');
    }

    saveProfiles() {
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
    }

    createProfile() {
        this.characters = this.local.loadLocalItem('characters');
        // Initialize with default values
        this.currentProfile = {
            id: Date.now().toString(),
            userName: '',
            mainAccount: false,
            traveler: '',
            characters: [],
        };
        this.isEditing = false;
        this.currentSection = 'form';
    }

    editProfile(profile: Profile) {
        this.resetCounters();
        this.currentProfile = { ...profile };
        this.characters = profile.characters;
        this.characters.forEach((character) => {
            if (character.selected == true) {
                this.updateMarkers(character.element, 'add');
                this.selectCharacterCSS(character);
            }
        });
        this.selectedElement = this.elements.find(
            (element) => element.name === this.currentProfile.traveler.element
        );

        console.log('Selected element:', this.selectedElement);
        this.isEditing = true;
        this.currentSection = 'form';
    }

    saveProfile() {
        this.currentProfile.traveler = this.getTraveler();
        if (this.isEditing) {
            const index = this.profiles.findIndex(
                (p) => p.id === this.currentProfile.id
            );
            if (index > -1) {
                this.profiles[index] = this.currentProfile;
            }
            this.modifyTraveler();
        } else {
            this.currentProfile.characters = this.characters;
            this.modifyTraveler();
            this.profiles.push(this.currentProfile);
        }
        this.saveProfiles();
        this.currentSection = 'list';
        this.characters = this.local.loadLocalItem('characters'); //reset characters propertie
    }

    modifyTraveler() {
        this.currentProfile.characters.filter((character) => {
            this.currentProfile.traveler.element = this.selectedElement.name;
            if (character.name === 'Aether' || character.name === 'Lumine')
                character.element = this.selectedElement.name;
            return character;
        });
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
        this.loadLocal();
    }

    selectCharacterCSS(character: Character) {
        return { 'selected-card': character.selected };
    }

    toggleSelection(character: Character) {
        character.selected = !character.selected;
        if (character.selected == true) {
            this.updateMarkers(character.element, 'add');
        } else {
            this.updateMarkers(character.element, 'subtract');
        }
    }

    isSelected(character: Character): boolean {
        return this.selectedCharacters.includes(character);
    }

    getTraveler() {
        if (this.isTravelerMale) {
            return this.characters.find(
                (character) => character.name === 'Aether'
            );
        } else if (!this.isTravelerMale) {
            return this.characters.find(
                (character) => character.name === 'Lumine'
            );
        }
        return undefined;
    }

    updateMarkers(element: string, action: string) {
        if (this.elementCounters[element] !== undefined) {
            if (action === 'add') {
                this.elementCounters[element]++;
            } else if (action === 'subtract') {
                this.elementCounters[element]--;
            }
        }
    }

    resetCounters(): void {
        for (let key in this.elementCounters) {
            if (this.elementCounters.hasOwnProperty(key)) {
                this.elementCounters[key] = 0;
            }
        }

        // Reset the total character selected counter
        this.nrCharactersSelected = 0;
    }
}
