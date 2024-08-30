import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { Character, OpenWorldBoss, WeeklyBoss } from '../types';
import { DataService } from './services/data.service';
import { SortService } from './services/sort.service';
import { LocalService } from './services/local.service';

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
        private sortingService: SortService,
        private localService: LocalService
    ) {}

    title = 'Genshin-Impact-Randomizer';

    characters: Character[] = [];
    open_world_bosses: OpenWorldBoss[] = [];
    weekly_bosses: WeeklyBoss[] = [];
    firstTime: boolean = false;

    ngOnInit() {
        this.getJsonData();
        if (this.checkPreviousVisit()) {
            this.saveLocal();
        }
    }

    getJsonData() {
        this.dataService.getData().subscribe({
            next: (data) => {
                this.characters = data.characters;
                this.weekly_bosses = data.weekly_boss;
                this.open_world_bosses = data.world_boss;
                this.sortElements();
            },
            error: (err) => {
                console.error('Error fetching data:', err);
            },
        });
    }

    sortElements() {
        this.characters = this.sortingService.sortEntityByName(this.characters);
        this.weekly_bosses = this.sortingService.sortEntityByName(
            this.weekly_bosses
        );
        this.open_world_bosses = this.sortingService.sortEntityByName(
            this.open_world_bosses
        );
    }

    saveLocal() {
        // Characters
        this.localService.saveLocalStorage('characters', this.characters);
        // Open World Bosses
        this.localService.saveLocalStorage(
            'open_world_bosses',
            this.open_world_bosses
        );
        // Weekly Bosses
        this.localService.saveLocalStorage('weekly_bosses', this.weekly_bosses);
    }

    checkPreviousVisit() {
        return !!this.localService.loadLocalItem('characters'); // Return True or False
    }
}
