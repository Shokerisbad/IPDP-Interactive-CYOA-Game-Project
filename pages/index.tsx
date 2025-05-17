import Link from 'next/link';
import styles from './styles.module.css'

export default function Home() {
    return (
        <>
            <div className={styles.startContainer} style={{textAlign: 'center', padding: '50px'}}>
                <h1>Welcome to the Adventure Game</h1>
                <p>Click below to start your journey.</p>
                <Link href="/game">
                    <button style={{padding: '10px 20px', fontSize: '20px', cursor: 'pointer'}}>
                        Start Game
                    </button>
                </Link>
            </div>
            <footer className={styles.footer} style={{textAlign: 'center', padding: '5px'}}>&copy; Proiect IPDP</footer>
        </>
    );
}
