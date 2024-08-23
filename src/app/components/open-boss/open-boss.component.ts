import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { OpenWorldBoss } from '../../../types';
import { RandomSelectorService } from '../../services/random-selector.service';

@Component({
    selector: 'app-open-boss',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        DividerModule,
        FormsModule,
        ToggleButtonModule,
    ],
    templateUrl: './open-boss.component.html',
    styleUrl: './open-boss.component.scss',
})
export class OpenBossComponent {
    open_world_boss: OpenWorldBoss[] = [];
    selectedOpenBosses: OpenWorldBoss[] = [];
    randomBoss: any;
    checked: boolean = true;

    constructor(private randomSelectorService: RandomSelectorService) {}

    ngOnInit() {
        this.open_world_boss = this.getLocalStorage();
        this.selectAllBosses();
    }

    getLocalStorage(): OpenWorldBoss[] {
        const storedWeeklyBossesLocal = localStorage.getItem('open_world_bosses');
        if (storedWeeklyBossesLocal) {
            return JSON.parse(storedWeeklyBossesLocal);
        } else {
            return []; // Return an empty array if nothing is found in local storage
        }
    }

    getRandomBoss() {
        // Select a random boss from the available list
        this.randomBoss = this.randomSelectorService.getRandomItem(
            this.selectedOpenBosses
        );

        // Remove the selected boss from the list (No double picking available)
        const index = this.selectedOpenBosses.indexOf(this.randomBoss);
        if (index !== -1) {
            this.selectedOpenBosses.splice(index, 1);
            this.randomBoss.selected = false;
        } else {
            console.log('No bosses selected.');
        }

        //Update Btn
        this.updateCheckBtn();
    }

    toggleSelection(item: OpenWorldBoss) {
        const index = this.selectedOpenBosses.indexOf(item);
        if (index === -1) {
            // item.selected = true;
            this.selectedOpenBosses.push(item);
        } else {
            this.selectedOpenBosses.splice(index, 1);
        }
        this.updateCheckBtn();
    }

    isSelected(item: OpenWorldBoss): boolean {
        return this.selectedOpenBosses.includes(item);
    }

    updateCheckBtn() {
        if (this.open_world_boss.length === this.selectedOpenBosses.length) {
            this.checked = true;
        } else {
            this.checked = false;
        }
    }

    selectAllBosses() {
        console.log(this.checked);
        if (this.checked) {
            this.open_world_boss.forEach((boss) => {
                // boss.selected = true;
                this.selectedOpenBosses.push(boss);
            });
        } else {
            console.log('works');
            this.selectedOpenBosses = [];
        }
    }
}
