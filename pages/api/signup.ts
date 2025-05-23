import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
// @ts-ignore
import db from '../../DatabaseConnection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Every field is required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO utilizatori (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('DB error:', err);
                return res.status(500).json({ message: 'Error saving in the database' });
            }

            return res.status(200).json({ message: 'Successfully registered' });
        });
    } catch (err) {
        console.error('Catch error:', err);
        return res.status(500).json({ message: 'Error saving in the database' });
    }
}
