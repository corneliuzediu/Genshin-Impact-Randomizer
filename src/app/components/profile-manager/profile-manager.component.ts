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
    nrSelectedAnemo: number = 0;
    nrSelectedCryo: number = 0;
    nrSelectedDendro: number = 0;
    nrSelectedElectro: number = 0;
    nrSelectedGeo: number = 0;
    nrSelectedHydro: number = 0;
    nrSelectedPyro: number = 0;

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
        this.currentProfile = {
            id: Date.now().toString(),
            userName: '',
            mainAccount: false,
            traveler: '',
            characters: [],
        }; // Initialize with default values
        this.isEditing = false;
        this.currentSection = 'form';
    }

    editProfile(profile: Profile) {
        debugger;
        this.resetCounters();
        this.currentProfile = { ...profile };
        this.characters = profile.characters;
        this.selectedElement = this.currentProfile.traveler.element;
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
        } else {
            this.currentProfile.characters = this.characters;
            debugger;
            this.profiles.push(this.currentProfile);
        }
        this.saveProfiles();
        this.currentSection = 'list';
        this.characters = this.local.loadLocalItem('characters'); //reset characters propertie
    }

    modifyTraveler() {
        let updatedCharacterArray = this.currentProfile.characters.filter(
            (character) => {
                if (character.element === 'omni') {
                    character.element = this.selectedElement.name;
                }

                return character;
            }
        );

        console.log(updatedCharacterArray);
        console.log(this.currentProfile);
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

    selectCharacterCSS(character: Character) {
        return { 'selected-card': character.selected };
    }

    toggleSelection(character: Character) {
        console.log(this.characters);
        character.selected = !character.selected;

        this.updateMarkers();
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
