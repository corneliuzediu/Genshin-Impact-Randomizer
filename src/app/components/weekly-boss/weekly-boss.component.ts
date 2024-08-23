import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { WeeklyBoss } from '../../../types';
import { RandomSelectorService } from '../../services/random-selector.service';

@Component({
    selector: 'app-weekly-boss',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        DividerModule,
        ToggleButtonModule,
        FormsModule,
    ],
    templateUrl: './weekly-boss.component.html',
    styleUrl: './weekly-boss.component.scss',
})
export class WeeklyBossComponent {
    weekly_bosses: WeeklyBoss[] = [];
    selectedBosses: WeeklyBoss[] = [];
    randomBoss: any;
    checked: boolean = true;

    constructor(private randomSelectorService: RandomSelectorService) {}

    ngOnInit() {
        this.weekly_bosses = this.getLocalStorage();
        this.selectAllBosses();
    }

    getLocalStorage(): WeeklyBoss[] {
        const storedWeeklyBossesLocal = localStorage.getItem('weekly_bosses');
        if (storedWeeklyBossesLocal) {
            return JSON.parse(storedWeeklyBossesLocal);
        } else {
            return []; // Return an empty array if nothing is found in local storage
        }
    }

    getRandomBoss() {
        // Select a random boss from the available list
        this.randomBoss = this.randomSelectorService.getRandomItem(
            this.selectedBosses
        );

        // Remove the selected boss from the list (No double picking available)
        const index = this.selectedBosses.indexOf(this.randomBoss);
        if (index !== -1) {
            this.selectedBosses.splice(index, 1);
            this.randomBoss.selected = false;
        } else {
            console.log('No bosses selected.');
        }

        //Update Btn
        this.updateCheckBtn()
    }

    toggleSelection(item: WeeklyBoss) {
        const index = this.selectedBosses.indexOf(item);
        if (index === -1) {
            item.selected = true;
            this.selectedBosses.push(item);
        } else {
            this.selectedBosses.splice(index, 1);
        }
        this.updateCheckBtn();
    }

    isSelected(item: WeeklyBoss): boolean {
        return this.selectedBosses.includes(item);
    }

    updateCheckBtn() {
        if (this.weekly_bosses.length === this.selectedBosses.length) {
            this.checked = true;
        } else {
            this.checked = false;
        }
    }

    selectAllBosses() {
        console.log(this.checked);
        if (this.checked) {
            this.weekly_bosses.forEach((boss) => {
                boss.selected = true;
                this.selectedBosses.push(boss);
            });
        } else {
            console.log('works');
            this.selectedBosses = [];
        }
    }
}
