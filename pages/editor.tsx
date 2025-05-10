import { useState } from "react";
import { StoryFactory, StoryNode} from "./api/factory";

export default function Editor() {
    const [nodes, setNodes] = useState<StoryNode[]>([]);
    const [newNode, setNewNode] = useState({
        id: "",
        text: "",
        type: "default",
        choices: [] as { text: string; next: string; requires: string}[],
        item: "",
        consume: "",
            itemsForSale: [] as string[],
    });

    const [newChoice, setNewChoice] = useState({ text: "", next: "" ,requires: ""});

    // Add a choice to the current node
    const addChoice = () => {
        if (newChoice.text && newChoice.next) {
            // @ts-ignore
            setNewNode((prev) => ({
                ...prev,
                choices: [...prev.choices, newChoice],
            }));

        }
    };

    // Add node to the list
    const addNode = () => {
        if (!newNode.id || !newNode.text) return;

        let node: StoryNode;
        if (newNode.type === "item") {
            node = StoryFactory.createGetItemNode(newNode.id, newNode.text, newNode.choices, newNode.item);
        } else if (newNode.type === "shop") {
            node = StoryFactory.createShopNode(newNode.id, newNode.text, newNode.choices, newNode.itemsForSale);
        }else if (newNode.type === "useItem") {
            node = StoryFactory.createUseItemNode(newNode.id, newNode.text,newNode.consume,newNode.item,newNode.choices);
        }
         else {
            node = StoryFactory.createBasicNode(newNode.id, newNode.text, newNode.choices);
        }

        setNodes([...nodes, node]);
        setNewNode({ id: "", text: "", type: "default", choices: [], item: "", consume:"", itemsForSale: []}); // Reset form
    };


    const saveNodes = async () => {
        const response = await fetch("/api/saveNodes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nodes),
        });

        if (response.ok) {
            alert("Story saved successfully!");
        } else {
            alert("Failed to save story.");
        }
        console.log(response.body);
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Story Node Editor</h1>

            <div>
                <input
                    type="text"
                    placeholder="Node ID"
                    value={newNode.id}
                    onChange={(e) => setNewNode({ ...newNode, id: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Story Text"
                    value={newNode.text}
                    onChange={(e) => setNewNode({ ...newNode, text: e.target.value })}
                />
                <select
                    value={newNode.type}
                    onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
                >
                    <option value="default">Default</option>
                    <option value="item">Item</option>
                    <option value="shop">Shop</option>
                    <option value="useItem">UseItem</option>
                </select>
            </div>

            {/* Item Input (only if type is 'item') */}
            {newNode.type === "item" && (
                <div>
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newNode.item}
                        onChange={(e) => setNewNode({ ...newNode, item: e.target.value })}
                    />
                </div>
            )}

            {newNode.type === "useItem" && (
                <div>
                    <input
                        type="text"
                        placeholder="Item Name If Player Gets"
                        value={newNode.item}
                        onChange={(e) => setNewNode({ ...newNode, item: e.target.value })}
                    />
                </div>
            )}
            {newNode.type === "useItem" && (
                <div>
                    <input
                        type="text"
                        placeholder="Consumed Item Name"
                        value={newNode.consume}
                        onChange={(e) => setNewNode({ ...newNode, consume: e.target.value })}
                    />
                </div>
            )}

            {/* Shop Items Input (only if type is 'shop') */}
            {newNode.type === "shop" && (
                <div>
                    <input
                        type="text"
                        placeholder="Items for Sale (comma-separated)"
                        value={newNode.itemsForSale.join(",")}
                        onChange={(e) =>
                            setNewNode({ ...newNode, itemsForSale: e.target.value.split(",") })
                        }
                    />
                </div>
            )}

            <div>
                <h3>Choices</h3>
                <input
                    type="text"
                    placeholder="Choice Text"
                    value={newChoice.text}
                    onChange={(e) => setNewChoice({ ...newChoice, text: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Next Node ID"
                    value={newChoice.next}
                    onChange={(e) => setNewChoice({ ...newChoice, next: e.target.value })}
                />
                {newNode.type === "useItem" && (
                    <div>
                        <input
                            type="text"
                            placeholder="Required Item Name"
                            value={newChoice.requires}
                            onChange={(e) => setNewChoice({ ...newChoice, requires: e.target.value })}
                        />
                    </div>
                )}
                <button onClick={addChoice}>Add Choice</button>
            </div>

            <button onClick={addNode}>Add Node</button>
            <button onClick={saveNodes}>Save Story</button>

            <h2>Preview</h2>
            <pre>{JSON.stringify(nodes, null, 2)}</pre>
        </div>
    );
}
