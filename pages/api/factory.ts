class StoryNode {
    id: string;
    text: string;
    choices: { text: string; next: string }[];

    constructor(id: string, text: string, choices: { text: string; next: string }[]) {
        this.id = id;
        this.text = text;
        this.choices = choices;
    }
}

class ItemNode extends StoryNode {
    item: string;

    constructor(id: string, text: string, choices: { text: string; next: string }[], item: string) {
        super(id, text, choices);
        this.item = item;
    }
}

class ShopNode extends StoryNode {
    itemsForSale: string[];

    constructor(id: string, text: string, choices: { text: string; next: string }[], itemsForSale: string[]) {
        super(id, text, choices);
        this.itemsForSale = itemsForSale;
    }
}

class StoryFactory {
    static createBasicNode(id: string, text: string, choices: { text: string; next: string }[]) {
        return new StoryNode(id, text, choices);
    }

    static createItemNode(id: string, text: string, choices: { text: string; next: string }[], item: string) {
        return new ItemNode(id, text, choices, item);
    }

    static createShopNode(id: string, text: string, choices: { text: string; next: string }[], itemsForSale: string[]) {
        return new ShopNode(id, text, choices, itemsForSale);
    }
}

export { StoryNode, ItemNode, ShopNode, StoryFactory };
