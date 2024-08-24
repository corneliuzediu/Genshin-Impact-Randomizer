import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { Character, OpenWorldBoss, WeeklyBoss } from '../types';
import { DataService } from './services/data.service';
import { SortService } from './services/sort.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        RouterModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    constructor(
        private dataService: DataService,
        private sortingService: SortService
    ) {}

    title = 'Genshin-Impact-Randomizer';
    

    characters: Character[] = [];
    open_world_bosses: OpenWorldBoss[] = [];
    weekly_bosses: WeeklyBoss[] = [];
    firstTime: boolean = false;

    ngOnInit() {
        this.getJsonData();
        if (this.checkPreviousVisit()) {
            this.saveLocalStorage();
        }
    }

    getJsonData() {
        this.dataService.getData().subscribe({
            next: (data) => {
                this.characters = data.characters;
                this.weekly_bosses = data.weekly_boss;
                this.open_world_bosses = data.world_boss;
                console.log('DB', data);
                this.sortElements();
            },
            error: (err) => {
                console.error('Error fetching data:', err);
            },
        });
    }

    sortElements() {
        this.characters = this.sortingService.sortEntityByName(this.characters);
        this.weekly_bosses = this.sortingService.sortEntityByName(this.weekly_bosses);
        this.open_world_bosses = this.sortingService.sortEntityByName(this.open_world_bosses);
    }

    saveLocalStorage() {
        // Characters
        const charactersString = JSON.stringify(this.characters);
        localStorage.setItem('characters', charactersString);

        // Open World Bosses
        const openWorldBossesString = JSON.stringify(this.open_world_bosses);
        localStorage.setItem('open_world_bosses', openWorldBossesString);

        // Weekly Bosses
        const weeklyBossesString = JSON.stringify(this.weekly_bosses);
        localStorage.setItem('weekly_bosses', weeklyBossesString);
    }

    getLocalStorage(): Character[] | WeeklyBoss[] | OpenWorldBoss[] {
        const storedCharactersLocal = localStorage.getItem('characters');
        if (storedCharactersLocal) {
            return JSON.parse(storedCharactersLocal);
        } else {
            return []; // Return an empty array if nothing is found in local storage
        }
    }

    checkPreviousVisit() {
        const somethingLocal = this.getLocalStorage();
        if (somethingLocal != undefined) {
            return true;
        } else {
            return false;
        }
    }
}
