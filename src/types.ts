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
