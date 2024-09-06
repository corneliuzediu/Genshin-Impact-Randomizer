import { Component } from '@angular/core';
import { Character, Profile } from '../../../types';
import { LocalService } from '../../services/local.service';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { RandomSelectorService } from '../../services/random-selector.service';
import { CardModule } from 'primeng/card';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-team-randomizer',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccordionModule,
        ButtonModule,
        RadioButtonModule,
        CardModule,
    ],
    templateUrl: './team-randomizer.component.html',
    styleUrl: './team-randomizer.component.scss',
})
export class TeamRandomizerComponent {
    profiles!: Profile[];
    characters!: Character[];
    charactersToDisplay: any[] = [];

    //Distinct Elements
    distinctElements!: any;
    distinctWeapons!: any;
    distinctStars!: any;
    distinctLocations!: any;
    distinctGenres!: any;
    distinctHeights!: any;
    arconsOnly: any = false;
    nrOfCharacters: number;
    slots: [];

    //Form
    selectorForm!: FormGroup;
    toogleAccordationBoolean: boolean = false;
    activeIndex: any = 0;

    constructor(
        private local: LocalService,
        private fb: FormBuilder,
        private randomizer: RandomSelectorService,
        private data: DataService
    ) {}

    ngOnInit() {
        this.profiles = this.local.loadLocalItem('profiles');
        this.characters = this.local.loadLocalItem('characters');
        this.getIndividualElements(); // Provides the elements for randering the dinamic form
        this.createForm();
        this.toogleAccordation();
    }

    getIndividualElements() {
        this.distinctElements = this.data.getDistinctValues<string>(
            this.characters,
            'element'
        );
        this.distinctWeapons = this.data.getDistinctValues<string>(
            this.characters,
            'weapon'
        );
        this.distinctStars = this.data.getDistinctValues<string>(
            this.characters,
            'stars'
        );
        this.distinctLocations = this.data.getDistinctValues<string>(
            this.characters,
            'location'
        );
        this.distinctGenres = this.data.getDistinctValues<string>(
            this.characters,
            'sex'
        );
        this.distinctHeights = this.data.getDistinctValues<string>(
            this.characters,
            'height'
        );
    }

    createForm(): void {
        this.selectorForm = this.fb.group({
            profiles: this.data.buildFormArray(
                this.fb,
                this.profiles.map((profile) => profile.userName)
            ),
            elements: this.data.buildFormArray(this.fb, this.distinctElements),
            weapons: this.data.buildFormArray(this.fb, this.distinctWeapons),
            stars: this.data.buildFormArray(this.fb, this.distinctStars),
            locations: this.data.buildFormArray(
                this.fb,
                this.distinctLocations
            ),
            genres: this.data.buildFormArray(this.fb, this.distinctGenres),
            heights: this.data.buildFormArray(this.fb, this.distinctHeights),
            archon: new FormControl(this.arconsOnly),
            nrOfCharacters: new FormControl(2),
        });
    }

    handleCheckboxChange(
        event: Event,
        formArrayName: string,
        value: string
    ): void {
        const target = event.target as HTMLInputElement;
        const formArray = this.selectorForm.get(formArrayName) as FormArray;

        if (target.checked) {
            formArray.push(new FormControl(value));
        } else {
            const index = formArray.controls.findIndex(
                (ctrl) => ctrl.value === value
            );
            if (index >= 0) {
                formArray.removeAt(index);
            }
        }
    }


    submitForm() {
        let selectedCriteria = this.getSelectedCriteria();
        // Pass the selected values to randomizer Service

        this.charactersToDisplay = this.randomizer.getRandomTeam(
            selectedCriteria,
            this.profiles
        );
    }

    getSelectedCriteria() {
        const selectedValues = {
            profiles: this.data.getSelectedProfiles(this.selectorForm),
            elements: this.data.getSelectedItems(
                'elements',
                this.distinctElements,
                this.selectorForm
            ),
            weapons: this.data.getSelectedItems(
                'weapons',
                this.distinctWeapons,
                this.selectorForm
            ),
            stars: this.data.getSelectedItems(
                'stars',
                this.distinctStars,
                this.selectorForm
            ),
            locations: this.data.getSelectedItems(
                'locations',
                this.distinctLocations,
                this.selectorForm
            ),
            genres: this.data.getSelectedItems(
                'genres',
                this.distinctGenres,
                this.selectorForm
            ),
            heights: this.data.getSelectedItems(
                'heights',
                this.distinctHeights,
                this.selectorForm
            ),
            archon: this.selectorForm.get('archon')?.value,
            nrOfCharacters: this.selectorForm.get('nrOfCharacters')?.value,
        };
        this.nrOfCharacters = this.selectorForm.get('nrOfCharacters')?.value;

        return selectedValues;
    }

    getNrMaxCharacters(nrOfCharacters: number, nrAvailableCharacters: number) {
        return new Array(nrOfCharacters - nrAvailableCharacters);
    }

    toogleAccordation() {
        this.toogleAccordationBoolean = !this.toogleAccordationBoolean;
        if (this.toogleAccordationBoolean) {
            this.activeIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        } else {
            this.activeIndex = [];
        }
    }
}
