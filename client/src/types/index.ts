export interface Type {
    id: string;
    foodTypeId: number;
    description: "Promotion" | "Heavy" | "Light";
    menuSections?: MenuSection[];
}

export interface MenuSection {
    id: string;
    name: string;
    description: string;
    typeId: string;
    type?: Type;
    filterMenus?: FilterMenu[];
}

export interface FilterMenu {
    id: string;
    name: string;
    description: string;
    sectionMenuId: string;
    menuSection?: MenuSection;
    menus?: Menu[];
}

export interface Menu {
    id: string;
    name: string;
    description: string;
    price: number;
    isNew: boolean;
    isAvailable: boolean;
    imageUrl: string | null;
    filterMenuId: string;
    filterMenu?: FilterMenu;
}