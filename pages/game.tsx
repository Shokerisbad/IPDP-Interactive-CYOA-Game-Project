import {useEffect, useState} from 'react';
import styles from './styles.module.css'

export default function Game() {
    const [storyNode, setStoryNode] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => { //starts as soon as the page loads
        fetchStory('start');
        const savedInventory = JSON.parse(localStorage  .getItem("inventory")) || [];
        setInventory(savedInventory);
    }, []);
    useEffect(() => { //only starts when inventory changes to save it in local storage
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }, [inventory]);

    const fetchStory = async (node: string) => {
        try {
            const res = await fetch(`/api/story?node=${node}`);
            if (!res.ok) {
                throw new Error(`Failed to load story node: ${node}`);
            }
            const data = await res.json();
            setStoryNode(data);
            if (data.item) {
                setInventory((prev) => [...new Set([...prev, data.item])]);
            }
            if (data.consume) {
                setInventory((prev) => prev.filter((item) => item !== data.consume));
            }
            if(data.requires){
                if (data.requires == true) {}
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    if (error) return <p style={{color: 'red'}}>Error: {error}</p>;
    if (!storyNode) return <p>Loading...</p>;

    return (
        <div>
            <div className={styles.gameContainer} style={{textAlign: 'center', padding: '50px'}}>
                <p>{storyNode.text}</p>
                {storyNode.choices.map((choice, index) => (
                    <button key={index} onClick={() => fetchStory(choice.next)} style={{margin: '5px'}}>
                        {choice.text}
                    </button>
                ))}
            </div>
            <div className={styles.inventoryContainer}
                 style={{marginTop: "20px", padding: "10px", border: "1px solid black"}}>
                <h2>Inventory</h2>
                {inventory.length > 0 ? ( //if inventory lenght is not 0, show the items
                    <ul>
                        {inventory.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                ) : ( //else it is empty
                    <p>Empty</p>
                )}
            </div>
        </div>

    )
        ;
}
