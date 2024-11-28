import { categories } from "../../data/data.js";

export class Category {
    constructor(name, color, icon) {
        this.name = name;
        this.color = color;
        this.icon = icon;
    }

    static addCategory(name, color, icon) {
        const newObject = new Category(name, color, icon);
        const newCategory = { ...newObject }

        categories.push(newCategory);
    }

    static getCategories() {
        return categories
    }
}



