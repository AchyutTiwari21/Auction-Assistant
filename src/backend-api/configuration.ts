export class Service{

    async getAuctions() {
        try {
            const response = await fetch("https://auction-api-n9mt.onrender.com/auctions", {
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
}


const service = new Service();
export default service;