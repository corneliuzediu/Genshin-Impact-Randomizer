import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Routes } from '@angular/router';


@Component({
    selector: 'app-header',
    standalone: true,
    imports: [SidebarModule, ButtonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    @Input() sidebarVisible: boolean = false;
    @Output() sidebarChange = new EventEmitter<boolean>();

    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
        this.sidebarChange.emit(this.sidebarVisible);
    }
}
