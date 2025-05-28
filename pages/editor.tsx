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
            setNewChoice({ text: "", next: "", requires: "" }); // Clear choice form
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

    const inputStyle = {
        padding: "8px 12px",
        margin: "5px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        width: "200px"
    };

    const textareaStyle = {
        padding: "8px 12px",
        margin: "5px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        width: "300px",
        minHeight: "80px",
        resize: "vertical",
        fontFamily: "inherit"
    };

    const buttonStyle = {
        padding: "10px 20px",
        margin: "5px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px"
    };

    const sectionStyle = {
        backgroundColor: "#f8f9fa",
        padding: "20px",
        margin: "10px 0",
        borderRadius: "8px",
        border: "1px solid #e9ecef"
    };


    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Story Node Editor</h1>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {/* Left Column - Form */}
                <div style={{ flex: "1", minWidth: "400px" }}>
                    {/* Basic Node Info */}
                    <div style={sectionStyle}>
                        <h3 style={{ marginTop: "0", color: "#495057" }}>Node Information</h3>
                        <div style={{ marginBottom: "10px" }}>
                            <input
                                type="text"
                                placeholder="Node ID"
                                value={newNode.id}
                                onChange={(e) => setNewNode({ ...newNode, id: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <textarea
                                placeholder="Story Text (supports multiple lines)"
                                value={newNode.text}
                                onChange={(e) => setNewNode({ ...newNode, text: e.target.value })}
                                rows={5}
                                // @ts-ignore
                                style={textareaStyle}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <select
                                value={newNode.type}
                                onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
                                style={{ ...inputStyle, width: "220px" }}
                            >
                                <option value="default">Default</option>
                                <option value="item">Item</option>
                                <option value="shop">Shop</option>
                                <option value="useItem">UseItem</option>
                            </select>
                        </div>
                    </div>

                    {/* Type-specific inputs */}
                    {newNode.type === "item" && (
                        <div style={sectionStyle}>
                            <h3 style={{ marginTop: "0", color: "#495057" }}>Item Settings</h3>
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={newNode.item}
                                onChange={(e) => setNewNode({ ...newNode, item: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                    )}

                    {newNode.type === "useItem" && (
                        <div style={sectionStyle}>
                            <h3 style={{ marginTop: "0", color: "#495057" }}>Use Item Settings</h3>
                            <div style={{ marginBottom: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Item Name If Player Gets"
                                    value={newNode.item}
                                    onChange={(e) => setNewNode({ ...newNode, item: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Consumed Item Name"
                                    value={newNode.consume}
                                    onChange={(e) => setNewNode({ ...newNode, consume: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    )}

                    {newNode.type === "shop" && (
                        <div style={sectionStyle}>
                            <h3 style={{ marginTop: "0", color: "#495057" }}>Shop Settings</h3>
                            <input
                                type="text"
                                placeholder="Items for Sale (comma-separated)"
                                value={newNode.itemsForSale.join(",")}
                                onChange={(e) =>
                                    setNewNode({ ...newNode, itemsForSale: e.target.value.split(",") })
                                }
                                style={{ ...inputStyle, width: "300px" }}
                            />
                        </div>
                    )}

                    {/* Choices Section */}
                    <div style={sectionStyle}>
                        <h3 style={{ marginTop: "0", color: "#495057" }}>Add Choice</h3>
                        <div style={{ marginBottom: "10px" }}>
                            <input
                                type="text"
                                placeholder="Choice Text"
                                value={newChoice.text}
                                onChange={(e) => setNewChoice({ ...newChoice, text: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <input
                                type="text"
                                placeholder="Next Node ID"
                                value={newChoice.next}
                                onChange={(e) => setNewChoice({ ...newChoice, next: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        {(newNode.type === "item" || newNode.type === "useItem") && (
                            <div style={{ marginBottom: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Required Item Name"
                                    value={newChoice.requires}
                                    onChange={(e) => setNewChoice({ ...newChoice, requires: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                        )}

                        <button onClick={addChoice} style={buttonStyle}>Add Choice</button>

                        {/* Display current choices */}
                        {newNode.choices.length > 0 && (
                            <div style={{ marginTop: "15px" }}>
                                <h4 style={{ color: "#495057" }}>Current Choices:</h4>
                                {newNode.choices.map((choice, index) => (
                                    <div key={index} style={{
                                        backgroundColor: "#e9ecef",
                                        padding: "8px",
                                        margin: "5px 0",
                                        borderRadius: "4px",
                                        fontSize: "14px"
                                    }}>
                                        <strong>{choice.text}</strong> → {choice.next}
                                        {choice.requires && <span style={{ color: "#6c757d" }}> (requires: {choice.requires})</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button onClick={addNode} style={{ ...buttonStyle, backgroundColor: "green", marginRight: "10px" }}>
                            Add Node
                        </button>
                        <button onClick={saveNodes} style={{ ...buttonStyle, backgroundColor: "blueviolet" }}>
                            Save Story
                        </button>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div style={{ flex: "1", minWidth: "400px" }}>
                    <div style={sectionStyle}>
                        <h2 style={{ marginTop: "0", textAlign: "center", color: "#495057" }}>Preview ({nodes.length} nodes)</h2>
                        <div style={{
                            maxHeight: "600px",
                            overflowY: "auto",
                            overflowX: "auto",
                            border: "1px solid #ddd",
                            backgroundColor: "#ffffff",
                            padding: "15px",
                            borderRadius: "4px",
                            minHeight: "200px"
                        }}>
                            <pre style={{
                                margin: "0",
                                whiteSpace: "pre-wrap",
                                fontSize: "12px",
                                fontFamily: "Monaco, Consolas, monospace",
                                lineHeight: "1.4"
                            }}>
                                {nodes.length > 0 ? JSON.stringify(nodes, null, 2) : "No nodes created yet..."}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}