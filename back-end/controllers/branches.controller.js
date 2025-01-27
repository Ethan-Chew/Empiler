import Branches from "../models/branches.js";

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

        const branches = await Branches.getOCBCBranches(lat, lon, page);

        return res.status(200).json({
            status: "Success",
            branches: branches,
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

        const branch = await Branches.getSpecificOCBCBranch(landmark);

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