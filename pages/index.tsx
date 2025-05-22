import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './styles.module.css';
import Image from 'next/image'

type AuthForm = {
    username?: string;
    email: string;
    password: string;
};

export default function Home() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState<AuthForm>({
        username: '',
        email: '',
        password: '',
    });

    const toggleForm = () => setIsLogin(!isLogin);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/login' : '/api/signup';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if(!response.ok){
            alert(result.message || 'Unknown error');
            return;
        }
        alert (result.message);


        if (isLogin) {
            console.log('Login:', {
                email: formData.email,
                password: formData.password,
            });
        } else {
            console.log('Sign Up:', formData);
        }

        router.push('/game');
    };

    return (
        <div className={styles.startContainer}>
            <Image
                src="/game_title.jpg"
                width={500}
                height={500}
                alt="Logo Joc" />
            <p>Click below to start your journey as Guest.</p>
            <Link href="/game">
                <button style={{ padding: '10px 20px', fontSize: '20px', cursor: 'pointer' }}>
                    Start Game
                </button>
            </Link>


            <hr style={{ margin: '40px 0', width: '80%' }} />


            <div className={styles.authBox}>
                <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
                    Click below to start your journey as a proper citizen.
                </p>
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <label>Parolă:</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Parolă"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
                </form>
                <p>
                    {isLogin ? 'Nu ai cont?' : 'Ai deja cont?'}{' '}
                    <button type="button" className={styles.toggle} onClick={toggleForm}>
                        {isLogin ? 'Înregistrează-te' : 'Autentifică-te'}
                    </button>
                </p>
            </div>
        </div>
    );
}
