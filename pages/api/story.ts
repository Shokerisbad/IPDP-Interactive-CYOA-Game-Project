import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { node } = req.query;

    const storyPath = path.join(process.cwd(), "data", "story.json");

    console.log("Looking for story.json at:", storyPath);

    // Check if file exists
    if (!fs.existsSync(storyPath)) {
        console.error("Error: story.json file NOT found");
        return res.status(500).json({ error: "Story data file not found" });
    }

    try {
        //read and parse the JSON file
        const story = JSON.parse(fs.readFileSync(storyPath, "utf8"));

        if (!node || typeof node !== "string" || !story[node]) {
            console.error("Error: Story node not found:", node);
            return res.status(404).json({ error: "Story node not found" });
        }

        res.status(200).json(story[node]);
    } catch (error) {
        console.error("Error reading story.json:", error);
        res.status(500).json({ error: "Failed to read story data" });
    }
}
