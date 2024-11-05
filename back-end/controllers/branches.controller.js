import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
  
function distanceBtwnCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;

    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c;
}

async function getOCBCBranches(req, res) {
    // tbh, idk how to make it so that we are able to continuously get data from OCBC's API lol.
    // but, heres what I got from their sandbox..
    // this function gets the user's coordinates (latitude and longitude) and returns the nearest OCBC branches in a 6km range.
    // implements a 'page' function to get the next 10 branches.

    try {
        const { lat, lon } = req.body;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        if (!lat || !lon) {
            return res.status(400).json({
                status: "Error",
                message: "Missing Required Fields, lat and lon",
            });
        }

        const filePath = path.join(process.cwd(), "utils", "data", 'branches.json');
        const jsonData = fs.readFileSync(filePath, 'utf-8'); 
        const branches = JSON.parse(jsonData);

        const nearestBranches = branches.map(branch => {
            const distance = distanceBtwnCoordinates(lat, lon, branch.latitude, branch.longitude);
            return {
                ...branch,
                "distance": distance,
            }
        });
        nearestBranches.sort((a, b) => a.distance - b.distance);

        // Slice the nearestBranches for pagination
        const paginatedBranches = nearestBranches.slice(page * 10, (page + 1) * 10);

        return res.status(200).json({
            status: "Success",
            branches: paginatedBranches,
        });
    } catch (err) {
        return res.status(500).json({
            status: "Error",
            message: err.message,
        })
    }
}

async function getSpecificOCBCBranch(req, res) {
    try {
        const landmark = req.query.landmark;

        if (!landmark) {
            return res.status(400).json({
                status: "Error",
                message: "Missing Required Fields, landmark",
            });
        }

        const filePath = path.join(process.cwd(), "utils", "data", 'branches.json');
        const jsonData = fs.readFileSync(filePath, 'utf-8'); 
        const branches = JSON.parse(jsonData);     
        
        const branch = branches.filter((branch) => branch.landmark === landmark);

        if (branch.length === 0) {
            return res.status(404).json({
                status: "Error",
                message: "Branch not found",
            });
        }

        return res.status(200).json({
            status: "Success",
            branch: branch[0],
        });
    } catch (err) {
        return res.status(500).json({
            status: "Error",
            message: err.message,
        })
    }
}

export default {
    getOCBCBranches,
    getSpecificOCBCBranch
}