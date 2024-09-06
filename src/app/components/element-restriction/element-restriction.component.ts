import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DataService } from '../../services/data.service';
import { Character, Profile } from '../../../types';
import { LocalService } from '../../services/local.service';
import { RandomSelectorService } from '../../services/random-selector.service';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
    selector: 'app-element-restriction',
    standalone: true,
    imports: [
        CheckboxModule,
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        ButtonModule,
        RadioButtonModule,
    ],
    templateUrl: './element-restriction.component.html',
    styleUrl: './element-restriction.component.scss',
})
export class ElementRestrictionComponent {
    //Form
    selectorForm!: FormGroup;
    profiles: Profile[];
    characters: Character[];
    restrictedElements!: string[];
    allElements!: string[];
    nrOfCharacters: number;
    charactersToDisplay: any[] = [];

    constructor(
        private data: DataService,
        private local: LocalService,
        private fb: FormBuilder,
        private randomizer: RandomSelectorService
    ) {}

    ngOnInit() {
        this.profiles = this.local.loadLocalItem('profiles');
        this.characters = this.local.loadLocalItem('characters');
        this.getRestrictedElements(); // Provides the elements for randering the dinamic form
        this.createForm();
    }

    getRestrictedElements() {
        this.allElements = this.data.getDistinctValues<string>(
            this.characters,
            'element'
        );

        this.allElements = this.allElements.filter(
            (element) => element !== 'omni'
        );
    }

    createForm() {
        this.selectorForm = this.fb.group({
            profiles: this.data.buildFormArray(
                this.fb,
                this.profiles.map((profile) => profile.userName)
            ),
            elements: this.data.buildFormArrayUnchecked(this.fb, this.allElements),
            nrOfCharacters: new FormControl(2),
        });
    }

    submitForm() {
        let selectedCriteria = this.getSelectedCriteria();

        this.charactersToDisplay = this.randomizer.getRandomTeam(
            selectedCriteria,
            this.profiles
        );
    }

    getSelectedCriteria() {
        this.restrictedElements = this.data.getSelectedItems(
            'elements',
            this.allElements,
            this.selectorForm
        );
        let availableCharacters = this.allElements.filter(
            (element) => !this.restrictedElements.includes(element)
        );
        const selectedValues = {
            profiles: this.data.getSelectedProfiles(this.selectorForm),
            elements: availableCharacters,
            nrOfCharacters: this.selectorForm.get('nrOfCharacters')?.value,
        };
        this.nrOfCharacters = this.selectorForm.get('nrOfCharacters')?.value;

        return selectedValues;
    }

    getNrMaxCharacters(nrOfCharacters: number, nrAvailableCharacters: number) {
        return new Array(nrOfCharacters - nrAvailableCharacters);
    }
}
