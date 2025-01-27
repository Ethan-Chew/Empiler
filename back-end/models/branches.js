import fs from 'fs';
import path from 'path';

export default class Branches {
    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }
      
    static distanceBtwnCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;
    
        var dLat = this.degreesToRadians(lat2-lat1);
        var dLon = this.degreesToRadians(lon2-lon1);
    
        lat1 = this.degreesToRadians(lat1);
        lat2 = this.degreesToRadians(lat2);
    
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return earthRadiusKm * c;
    }

    static async getOCBCBranches(lat, lon, page) {
        const filePath = path.join(process.cwd(), "utils", "data", 'branches.json');
        const jsonData = fs.readFileSync(filePath, 'utf-8'); 
        const branches = JSON.parse(jsonData);

        const nearestBranches = branches.map(branch => {
            const distance = this.distanceBtwnCoordinates(lat, lon, branch.latitude, branch.longitude);
            return {
                ...branch,
                "distance": distance,
            }
        });
        nearestBranches.sort((a, b) => a.distance - b.distance);

        // Slice the nearestBranches for pagination
        const paginatedBranches = nearestBranches.slice(page * 10, (page + 1) * 10);

        return paginatedBranches;
    }

    static async getSpecificOCBCBranch(landmark) {
        const filePath = path.join(process.cwd(), "utils", "data", 'branches.json');
        const jsonData = fs.readFileSync(filePath, 'utf-8'); 
        const branches = JSON.parse(jsonData);     
        
        const branch = branches.filter((branch) => branch.landmark === landmark);

        return branch[0];
    }
}