import { Component } from '@angular/core';
import { Character, Profile } from '../../../types';
import { LocalService } from '../../services/local.service';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    FormControl,
    ReactiveFormsModule,
} from '@angular/forms';

@Component({
    selector: 'app-team-randomizer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionModule],
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

    //Form
    selectorForm!: FormGroup;

    constructor(private local: LocalService, private fb: FormBuilder) {}

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
            travelerElement: this.buildFormArray(this.distinctElements),
            elements: this.buildFormArray(this.distinctElements),
            weapons: this.buildFormArray(this.distinctWeapons),
            stars: this.buildFormArray(this.distinctStars),
            locations: this.buildFormArray(this.distinctLocations),
            genres: this.buildFormArray(this.distinctGenres),
            heights: this.buildFormArray(this.distinctHeights),
            archon: new FormControl(false),
        });
    }

    buildFormArray(items: string[]): FormArray {
        const controls = items.map(() => new FormControl(false));
        return this.fb.array(controls);
    }

    handleCheckboxChange(event: Event, formArrayName: string): void {
      const target = event.target as HTMLInputElement;
      this.selectAll(formArrayName, target.checked);
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
        console.log(this.selectorForm.controls);
    }
}
