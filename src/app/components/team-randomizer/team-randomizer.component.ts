import { Component } from '@angular/core';
import { Character, Profile } from '../../../types';
import { LocalService } from '../../services/local.service';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormControl,
    ReactiveFormsModule,
} from '@angular/forms';
import { RandomSelectorService } from '../../services/random-selector.service';

@Component({
    selector: 'app-team-randomizer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionModule, ButtonModule],
    templateUrl: './team-randomizer.component.html',
    styleUrl: './team-randomizer.component.scss',
})
export class TeamRandomizerComponent {
    profiles!: Profile[];
    characters!: Character[];

    //Distinct Elements
    distinctElements!: any;
    distinctWeapons!: any;
    distinctStars!: any;
    distinctLocations!: any;
    distinctGenres!: any;
    distinctHeights!: any;
    arconsOnly: any = false;

    //Form
    selectorForm!: FormGroup;

    constructor(
        private local: LocalService,
        private fb: FormBuilder,
        private randomizer: RandomSelectorService
    ) {}

    ngOnInit() {
        this.profiles = this.local.loadLocalItem('profiles');
        this.characters = this.local.loadLocalItem('characters');
        this.getIndividualElements();
        this.createForm();
    }

    getDistinctValues<T>(item: keyof Character): T[] {
        const values = this.characters.map((character) => character[item]);
        return [...new Set(values)];
    }

    getIndividualElements() {
        this.distinctElements = this.getDistinctValues<string>('element');
        this.distinctWeapons = this.getDistinctValues<string>('weapon');
        this.distinctStars = this.getDistinctValues<string>('stars');
        this.distinctLocations = this.getDistinctValues<string>('location');
        this.distinctGenres = this.getDistinctValues<string>('sex');
        this.distinctHeights = this.getDistinctValues<string>('height');
    }

    createForm(): void {
        this.selectorForm = this.fb.group({
            profiles: this.buildFormArray(
                this.profiles.map((profile) => profile.userName)
            ),
            elements: this.buildFormArray(this.distinctElements),
            weapons: this.buildFormArray(this.distinctWeapons),
            stars: this.buildFormArray(this.distinctStars),
            locations: this.buildFormArray(this.distinctLocations),
            genres: this.buildFormArray(this.distinctGenres),
            heights: this.buildFormArray(this.distinctHeights),
            archon: new FormControl(this.arconsOnly),
        });
    }

    buildFormArray(items: string[]): FormArray {
        const controls = items.map((item) => item);
        return this.fb.array(controls);
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

    selectAll(formArrayName: string, isChecked: boolean): void {
        const formArray = this.selectorForm.get(formArrayName) as FormArray;
        formArray.controls.forEach((control) => control.setValue(isChecked));
    }

    getSelectedItems(formArrayName: string, items: string[]): string[] {
        const formArray = this.selectorForm.get(formArrayName) as FormArray;
        return formArray.controls
            .map((control, i) => (control.value ? items[i] : null))
            .filter((value) => value !== null);
    }

    submitForm() {
        let selectedCriteria = this.getSelectedCriteria();
        console.log(selectedCriteria)

        // Pass the selected values to getRandomTeam
        this.randomizer.getRandomTeam(selectedCriteria, this.profiles);

    }

    getSelectedCriteria() {
        const selectedElements = this.getSelectedItems(
            'elements',
            this.distinctElements
        );
        const selectedWeapons = this.getSelectedItems(
            'weapons',
            this.distinctWeapons
        );
        const selectedStars = this.getSelectedItems(
            'stars',
            this.distinctStars
        );
        const selectedLocations = this.getSelectedItems(
            'locations',
            this.distinctLocations
        );
        const selectedGenres = this.getSelectedItems(
            'genres',
            this.distinctGenres
        );
        const selectedHeights = this.getSelectedItems(
            'heights',
            this.distinctHeights
        );
        const selectedArchon = this.selectorForm.get('archon')?.value;

        // Create an object to pass to the getRandomTeam method
        const selectedValues = {
            elements: selectedElements,
            weapons: selectedWeapons,
            stars: selectedStars,
            locations: selectedLocations,
            genres: selectedGenres,
            heights: selectedHeights,
            archon: selectedArchon, // assuming this is a boolean
        };


        return selectedValues;
    }
}
