import {Item} from "./Item";

export class ItemsFabric {
    private static _instance: ItemsFabric | null = null;
    private items: Array<Item>;

    public static get instance(): ItemsFabric {
        if (ItemsFabric._instance == null) ItemsFabric._instance = new ItemsFabric();
        return ItemsFabric._instance;
    }

    constructor() {
        this.items = new Array<Item>();
    }

    public getItem = (): Item => {
        if (this.items.length == 0) {
            return new Item();
        }

        return this.items.shift() as Item;
    }

    public storeItem = (item: Item) => {
        item.reset();
        this.items.push(item);
    }

    public get count(): number {
        return this.items.length;
    }
}