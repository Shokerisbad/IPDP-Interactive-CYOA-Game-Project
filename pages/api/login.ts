import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import db from '../../DatabaseConnection';
import bcrypt from 'bcrypt';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Unauthorized method' });
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const query = 'SELECT * FROM utilizatori WHERE email = ? LIMIT 1';

    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error accessing the database' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Unknown email' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        return res.status(200).json({ message: 'Successfully logged in', user: { id: user.id, username: user.username } });
    });
}
