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

class useItemNode extends StoryNode {
    item: string;
    consume: string;
    constructor(
        id: string,
        text: string,
        consume: string,
        item: string,
        choices: { text: string; next: string;requires:string;}[]
    ) {
        super(id, text,choices);
       this.consume = consume;
       this.item = item;
    }
}

class getItemNode extends StoryNode {
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

    static createGetItemNode(id: string, text: string, choices: { text: string; next: string }[], item: string) {
        return new getItemNode(id, text, choices, item);
    }

    static createUseItemNode(
        id: string,
        text: string,
        consume: string,
        item: string,
        choices: { text: string; next: string; requires:string}[]
    ) {
        return new useItemNode(id, text,consume,item, choices);
    }

    static createShopNode(id: string, text: string, choices: { text: string; next: string }[], itemsForSale: string[]) {
        return new ShopNode(id, text, choices, itemsForSale);
    }
}

export {StoryNode, getItemNode, ShopNode, StoryFactory};
