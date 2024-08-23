import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { Character, OpenWorldBoss, WeeklyBoss } from '../types';
import { DataService } from './services/data.service';

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
    title = 'Genshin-Impact-Randomizer';

    characters: Character[] = [];
    open_world_bosses: OpenWorldBoss[] = [];
    weekly_bosses: WeeklyBoss[] = [];

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.getJsonData();
        this.saveLocalStorage();
    }

    getJsonData() {
        this.dataService.getData().subscribe((data) => {
            this.characters = data.characters;
            this.weekly_bosses = data.weekly_boss;
            this.open_world_bosses = data.world_boss;
        });
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
}
