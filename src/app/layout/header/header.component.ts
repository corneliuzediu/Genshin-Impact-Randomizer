import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RouterModule, Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { TooltipModule } from 'primeng/tooltip';
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        SidebarModule,
        ButtonModule,
        RouterModule,
        TabViewModule,
        TooltipModule,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    @Input() sidebarVisible: boolean = false;
    @Output() sidebarChange = new EventEmitter<boolean>();
    displayWidth: number | undefined;
    routes: string[] = [
        '',
        '/profile',
        '/team_randomizer',
        '/element_restriction',
        '/weekly_boss',
        '/open_boss',
    ];

    constructor(private router: Router) {}

    ngOnInit() {}

    navigateTo(index) {
        this.router.navigate([this.routes[index]]);
    }

    toggleSidebar() {
        this.sidebarVisible = !this.sidebarVisible;
        this.sidebarChange.emit(this.sidebarVisible);
    }
}
