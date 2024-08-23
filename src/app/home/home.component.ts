import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { DataService } from '../services/data.service'; // Import the service

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [HeaderComponent, FooterComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    homeData: any = {};

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.dataService.getData().subscribe((data) => {
            this.homeData = data;
            console.log('Data in data:', data);
            console.log('Data in HomeComponent:', this.homeData);
        });
    }
}
