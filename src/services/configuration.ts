import config from "../config"

export class Service{

    async getAuctions() {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/auctions`, {
                method: 'GET',
                credentials: 'include'
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.error || 'Error while fetching post.');
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching auctions:', error);
            throw error;
        }
    }

    async getAllBids() {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/auctions/allBids`, {
                method: 'GET',
                credentials: 'include'
            });
    
            const data = await response.json();
    
            if(!response.ok) {
                throw new Error(data.error || 'Error while fetching bids.');
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
            throw error;
        }
    }

    async getCallLogs() {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/calls/callLogs`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || 'Error while fetching call logs.');
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching call logs:', error);
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const response = await fetch(`${config.PRODUCTION_API_URL}/users/getAllUsers`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.error || 'Error while fetching users.');
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
}


const service = new Service();
export default service;