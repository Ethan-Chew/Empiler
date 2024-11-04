import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export default async function getOCBCBranches(req, res) {
    // TODO: tbh, idk how to make it so that we are able to continuously get data from OCBC's API lol.
    // But, heres what I got from their sandbox..

    const filePath = path.join(process.cwd(), "utils", "data", 'branches.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8'); 
    const data = JSON.parse(jsonData);

    return res.status(200).json(data);
}