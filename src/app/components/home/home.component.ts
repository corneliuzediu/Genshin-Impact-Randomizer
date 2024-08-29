import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Profile } from '../../../types';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [HeaderComponent, FooterComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    mainAccount: Profile = {
        id: 'string',
        userName: 'string',
        mainAccount: false,
        traveler: undefined,
        characters: [],
    };

    // Method to handle the change from the child component
    updateMainAccount(mainAccountValue: Profile) {
        debugger
        this.mainAccount = mainAccountValue;
    }
}
