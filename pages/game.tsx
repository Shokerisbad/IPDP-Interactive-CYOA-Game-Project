import {useEffect, useState} from 'react';
import styles from './styles.module.css'
import storyData from "../data/story.json";


export default function Game() {
    const [storyNode, setStoryNode] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState<string[]>(["start"]);


    useEffect(() => { //starts as soon as the page loads
        fetchStory('start');
        const savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
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

            if (data.text.length > 254) {
                insertNewlines(data.text);
                console.log(data.text);
            }
            setStoryNode(data);


            if (data.item) {
                setInventory((prev) => [...new Set([...prev, data.item])]);
            }
            if (data.consume) {
                setInventory((prev) => prev.filter((item) => item !== data.consume));
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    function insertNewlines(str) {
        return str.replace(/(.{1,254})(\s|$)/g, "$1<br />");
    }


    if (error) return <p style={{color: 'red'}}>Error: {error}</p>;
    if (!storyNode) return <p>Loading...</p>;


    const shouldDisableChoice = (choice, inventory) => {
        return choice.requires && !inventory.includes(choice.requires);
    };


    const isDisabled = shouldDisableChoice(storyNode.choices, inventory);
    console.log(isDisabled);

    const currentStep = history[history.length - 1];
    const storyPart = storyData[currentStep];

    if (!storyPart) return <h2>The step does not exist in JSON</h2>;

    //butonul de quit goleste inventarul, reseteaza istoria si te duce la inceputul jocului
    const quit = () =>{
        if(confirm("Are you sure you want to quit?")){
            setInventory([]);
            localStorage.removeItem("inventory");
            setHistory(["start"]);
            fetchStory('start');
        }
    };


    return (
        <div>
            <nav className={styles.navigationBar} style={{textAlign: 'center'}}>
                <ul style={{listStyleType: 'none', padding: '0px'}}>
                    <div style={{position: 'fixed', top: '250px', left: '50px', fontSize: '15px'}}>
                        <li><a onClick={() => quit()}
                               style={{color: '#febe7e', textDecoration: 'none', cursor: 'pointer'}}>Quit</a>
                        </li>
                    </div>
                </ul>
            </nav>
            <div className={styles.gameContainer} style={{textAlign: 'center', padding: '50px'}}>
               <div className={styles.textContainer} style={{padding: '50px'}}>
                <p>{storyNode.text}</p>
               </div>
                <div className={styles.buttonsContainer} style={{padding: '50px'}}>
                    {storyNode && storyNode.choices && storyNode.choices.map((choice, index) => {
                        const isDisabled = shouldDisableChoice(choice, inventory);

                        return (
                            <button
                                key={index}
                                onClick={() => fetchStory(choice.next)}
                                disabled={isDisabled}
                                style={{ margin: '5px' }}
                            >
                                {choice.text}
                                {isDisabled ? ` (Requires: ${choice.requires})` : ''}
                            </button>
                        );
                    })}
                </div>
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
            <footer className={styles.footer} style={{textAlign: 'center', padding: '5px'}}>&copy; Proiect IPDP</footer>
        </div>

    );
}


