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
    distinctArchon!: any;

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
            archon: new FormControl(true),
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
        // console.log(this.distinctElements);
        // console.log(this.distinctWeapons);
        // console.log(this.distinctStars);
        // console.log(this.distinctLocations);
        // console.log(this.distinctGenres);
        // console.log(this.distinctHeights);

        // console.log(this.selectorForm.controls)
 
        this.randomizer.getRandomTeam(this.selectorForm.value, this.profiles);

        // for (let key in this.selectorForm.controls) {
        //     if (this.selectorForm.controls.hasOwnProperty(key)) {
        //         const control = this.selectorForm.controls[key];
        //         // console.log(`${key}:`, control.value);
        //         switch (key) {
        //             case 'elements':
        //                 this.distinctElements = control.value.filter(
        //                     (element) => element !== 'omni'
        //                 );
        //                 console.log(this.distinctElements);
        //                 break;
        //             case 'weapons':
        //                 this.distinctWeapons = control.value;
        //                 console.log(this.distinctWeapons);
        //                 break;
        //             case 'stars':
        //                 this.distinctStars = control.value;
        //                 console.log(this.distinctStars);
        //                 break;
        //             case 'locations':
        //                 this.distinctLocations = control.value;
        //                 console.log(this.distinctLocations);
        //                 break;
        //             case 'genres':
        //                 this.distinctGenres = control.value;
        //                 console.log(this.distinctGenres);
        //                 break;
        //             case 'heights':
        //                 this.distinctHeights = control.value;
        //                 console.log(this.distinctHeights);
        //                 break;
        //             case 'archon':
        //                 this.distinctArchon = control.value;
        //                 console.log(this.distinctArchon);

        //                 break;
        //             default:
        //                 break;
        //         }
        //         this.getIndividualElements();
        //         this.createForm();
        //     }
        // }
    }
}
