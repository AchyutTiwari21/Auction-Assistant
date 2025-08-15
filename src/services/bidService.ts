import config from "../config";

export class BidService {
  async getUserBids() {
    try {
      const response = await fetch(`${config.PRODUCTION_API_URL}/auctions/userBids`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error while fetching user bids.');
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error fetching user bids:', error);
      throw error;
    }
  }

  async getWinningBids() {
    try {
      const response = await fetch(`${config.PRODUCTION_API_URL}/auctions/winningBids`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error while fetching winning bids.');
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error fetching winning bids:', error);
      throw error;
    }
  }

  async addPaymentMethod(userId: string, paymentData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }) {
    try {
      const response = await fetch(`${config.PRODUCTION_API_URL}/users/${userId}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error while adding payment method.');
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  async getPaymentMethods(userId: string) {
    try {
      const response = await fetch(`${config.PRODUCTION_API_URL}/users/${userId}/payment-methods`, {
        method: 'GET',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error while fetching payment methods.');
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async placeBid({auctionId, userId, bidAmount}: {auctionId: string, userId: string, bidAmount: number}) {
    try {
      const response = await fetch(`${config.PRODUCTION_API_URL}/auctions/bid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          auctionId,
          userId,
          bidAmount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error while placing bid.');
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      throw error;
    }
  }

  async cancelBid(bidId: string) {
    try {
      const response = await fetch(`${config.PRODUCTION_API_URL}/bids/${bidId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error while cancelling bid.');
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error cancelling bid:', error);
      throw error;
    }
  }
}

const bidService = new BidService();
export default bidService;
