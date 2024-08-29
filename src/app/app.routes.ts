import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProfileManagerComponent } from './components/profile-manager/profile-manager.component';
import { TeamRandomizerComponent } from './components/team-randomizer/team-randomizer.component';
import { TeamPickerComponent } from './components/team-picker/team-picker.component';
import { ElementRestrictionComponent } from './components/element-restriction/element-restriction.component';
import { WeeklyBossComponent } from './components/weekly-boss/weekly-boss.component';
import { OpenBossComponent } from './components/open-boss/open-boss.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'profile',
        component: ProfileManagerComponent,
    },
    {
        path: 'team_randomizer',
        component: TeamRandomizerComponent,
    },
    {
        path: 'team_picker',
        component: TeamPickerComponent,
    },
    {
        path: 'element_restriction',
        component: ElementRestrictionComponent,
    },
    {
        path: 'weekly_boss',
        component: WeeklyBossComponent,
    },
    {
        path: 'open_boss',
        component: OpenBossComponent,
    },
];
