export interface Character {
    [x: string]: any;
    id: number;
    name: string;
    archon: boolean;
    image_src: string;
    element: string;
    weapon: string;
    selected: boolean;
    stars: string;
    location: string;
    sex: string;
    height: string;
}

export interface WeeklyBoss {
    id: number;
    name: string;
    image_src: string;
    selected: boolean;
}

export interface OpenWorldBoss {
    id: number;
    name: string;
    image_src: string;
    selected: false;
}

export interface Profile {
    id: string;
    userName: string;
    mainAccount: boolean;
    traveler?: Character;
    characters: Character[];
}

export class StatsTemplate {
    elements: any;
    weapons: any;
    stars: any;
    genres: any;
    height: any;
    constructor() {
        this.elements = this.createCategoryObject();
        this.weapons = this.createCategoryObject();
        this.stars = this.createCategoryObject();
        this.genres = this.createCategoryObject();
        this.height = this.createCategoryObject();
    }

    private createCategoryObject() {
        return {
            all: {},
            '5 stars': {},
            '4 stars': {},
        };
    }
}
