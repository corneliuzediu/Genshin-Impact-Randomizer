import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Profile } from '../../../types';
import { LocalService } from '../../services/local.service';
import { ButtonModule } from 'primeng/button';
import { StatisticsService } from '../../services/statistics.service';
import { ChartModule } from 'primeng/chart';
import { SplitterModule } from 'primeng/splitter';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        HeaderComponent,
        FooterComponent,
        CommonModule,
        DropdownModule,
        ButtonModule,
        FormsModule,
        ChartModule,
        SplitterModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    profiles!: Profile[];
    selectedProfile: Profile | undefined;

    //Distinct Elements
    distinctElements!: any;
    distinctWeapons!: any;
    distinctStars!: any;
    distinctLocations!: any;
    distinctGenres!: any;
    distinctHeights!: any;

    dataElementsAll: any;
    dataElementsPerStar: any;
    dataWeapons: any;
    dataStars: any;
    dataLocation: any;
    dataGenre: any;
    dataHeight: any;

    options: any;
    optionsBar: any;
    background: any;
    backgroundHover: any;
    textColor: any;
    textColorSecondary: any;
    surfaceBorder: any;

    constructor(
        private local: LocalService,
        private statistics: StatisticsService
    ) {}

    ngOnInit() {
        this.profiles = this.local.loadLocalItem('profiles');

        // Element for the Charts
        const documentStyle = getComputedStyle(document.documentElement);
        this.textColor = documentStyle.getPropertyValue('--text-color');
        this.textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        this.surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.background = [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
            documentStyle.getPropertyValue('--red-500'),
            documentStyle.getPropertyValue('--purple-500'),
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--pink-500'),
        ];

        this.backgroundHover = [
            documentStyle.getPropertyValue('--blue-300'),
            documentStyle.getPropertyValue('--yellow-300'),
            documentStyle.getPropertyValue('--green-300'),
            documentStyle.getPropertyValue('--red-300'),
            documentStyle.getPropertyValue('--purple-300'),
            documentStyle.getPropertyValue('--orange-300'),
            documentStyle.getPropertyValue('--pink-300'),
        ];
    }

    generateRaport() {
        // Get Profile to receive a report
        let elementCounts = this.statistics.getProfilesStats(
            this.selectedProfile
        );

        const documentStyle = getComputedStyle(document.documentElement);
        this.dataElementsAll = this.createElementsChart(elementCounts);
        this.dataElementsPerStar =
            this.createElementPerStarsChart(elementCounts);
        this.dataWeapons = this.createWeaponsChart(
            elementCounts,
            documentStyle
        );
        this.dataStars = this.createStarsChart(elementCounts, documentStyle);
        this.dataLocation = this.createLocationChart(
            elementCounts,
            documentStyle
        );
        this.dataGenre = this.createGenreChart(elementCounts, documentStyle);
        this.dataHeight = this.createHeightChart(elementCounts, documentStyle);
        this.options = this.getOptionsChart();
        this.optionsBar = this.getOptionsChartBar();
    }

    createElementsChart(elementCounts: any) {
        return {
            labels: Object.keys(elementCounts.elements.all),
            datasets: [
                {
                    data: Object.values(elementCounts.elements.all),
                    backgroundColor: this.background,
                    hoverBackgroundColor: this.backgroundHover,
                },
            ],
        };
    }

    createElementPerStarsChart(elementCounts: any) {
        return {
            labels: Object.keys(elementCounts.elements['5 stars']),
            datasets: [
                {
                    label: '5 Stars Characters',
                    data: Object.values(elementCounts.elements['5 stars']),
                    backgroundColor: this.background,
                    hoverBackgroundColor: this.backgroundHover,
                },
                {
                    label: '4 Stars Characters',
                    data: Object.values(elementCounts.elements['4 stars']),
                    backgroundColor: this.background,
                    hoverBackgroundColor: this.backgroundHover,
                },
            ],
        };
    }

    createWeaponsChart(elementCounts, documentStyle) {
        return {
            labels: Object.keys(elementCounts.weapons.all),
            datasets: [
                {
                    label: 'All Characters',
                    data: Object.values(elementCounts.weapons.all),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-300'),
                    ],
                },
                {
                    label: '5 Stars Characters',
                    data: Object.values(elementCounts.weapons['5 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--orange-300'),
                    ],
                },
                {
                    label: '4 Stars Characters',
                    data: Object.values(elementCounts.weapons['4 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--purple-300'),
                    ],
                },
            ],
        };
    }

    createStarsChart(elementCounts, documentStyle) {
        let labelValue = Object.keys(elementCounts.stars.all);
        labelValue = labelValue.map((value) => value + ' Stars Characters');
        return {
            labels: labelValue,
            datasets: [
                {
                    data: Object.values(elementCounts.stars.all),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--orange-300'),
                        documentStyle.getPropertyValue('--purple-300'),
                    ],
                },
            ],
        };
    }

    createLocationChart(elementCounts, documentStyle) {
        return {
            labels: Object.keys(elementCounts.location.all),
            datasets: [
                {
                    label: 'All Characters',
                    data: Object.values(elementCounts.location.all),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-300'),
                    ],
                },
                {
                    label: '5 Stars Characters',
                    data: Object.values(elementCounts.location['5 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--orange-300'),
                    ],
                },
                {
                    label: '4 Stars Characters',
                    data: Object.values(elementCounts.location['4 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--purple-300'),
                    ],
                },
            ],
        };
    }

    createGenreChart(elementCounts, documentStyle) {
        return {
            labels: Object.keys(elementCounts.genres.all),
            datasets: [
                {
                    label: 'All Characters',
                    data: Object.values(elementCounts.genres.all),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-300'),
                    ],
                },
                {
                    label: '5 Stars Characters',
                    data: Object.values(elementCounts.genres['5 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--orange-300'),
                    ],
                },
                {
                    label: '4 Stars Characters',
                    data: Object.values(elementCounts.genres['4 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--purple-300'),
                    ],
                },
            ],
        };
    }
    createHeightChart(elementCounts, documentStyle) {
        return {
            labels: Object.keys(elementCounts.height.all),
            datasets: [
                {
                    label: 'All Characters',
                    data: Object.values(elementCounts.height.all),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-300'),
                    ],
                },
                {
                    label: '5 Stars Characters',
                    data: Object.values(elementCounts.height['5 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--orange-300'),
                    ],
                },
                {
                    label: '4 Stars Characters',
                    data: Object.values(elementCounts.height['4 stars']),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--purple-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--purple-300'),
                    ],
                },
            ],
        };
    }

    getOptionsChart() {
        return {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: this.textColor,
                    },
                },
            },
        };
    }

    getOptionsChartBar() {
        return {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: this.textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: this.textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        color: this.surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: this.textColorSecondary,
                    },
                    grid: {
                        color: this.surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }
}
