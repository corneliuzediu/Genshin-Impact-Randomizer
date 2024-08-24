import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SortService {
    constructor() {}

    // Method to sort Entity by name
    sortEntityByName(Entity: any[]): any[] {
        return Entity.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Method to sort Entity by element
    sortEntityByElement(Entity: any[]): any[] {
        return Entity.sort((a, b) => a.element.localeCompare(b.element));
    }

    // Method to sort Entity by selected
    sortEntityBySelected(Entity: any[]): any[] {
        return Entity.sort((a, b) => a.selected.localeCompare(b.selected));
    }

    // Method to sort Entity by selected
    sortEntityByLocation(Entity: any[]): any[] {
        return Entity.sort((a, b) => a.location.localeCompare(b.location));
    }
}
