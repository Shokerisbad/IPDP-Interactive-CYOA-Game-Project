import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from "next";
// Path to the JSON file
const filePath = path.join(process.cwd(), 'data', 'story.json');

export default function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Read existing story data
            let storyData = {};
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                storyData = JSON.parse(fileContent);
            }
            //Because the req body is an array, we have to parse each node in it
           req.body.forEach(node => {
               storyData[node.id] = {
                   ...node,
                   choices: node.choices
               };
           })

            // Write back to file
            fs.writeFileSync(filePath, JSON.stringify(storyData, null, 2));

            res.status(200).json({ message: 'Story saved!', storyData });
        } catch (error) {
            res.status(500).json({ error: 'Failed to save story' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
