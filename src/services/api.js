const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    // Set auth token
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    // Clear auth token
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    // Get auth headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            // console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication
    async login(code) {
        const response = await this.request('/shipper/login', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
        
        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }
        
        return response;
    }

    async logout() {
        this.clearToken();
    }

    // Orders
    async getOrders(page = 1, limit = 10) {
        return await this.request(`/order?page=${page}&limit=${limit}`);
    }

    async createOrderFromQR(imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const url = `${this.baseURL}/order/qr`;
        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            // console.error('QR upload failed:', error);
            throw error;
        }
    }

    async createOrder(orderData) {
        return await this.request('/order', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    }

    // Payments
    async getPayments() {
        return await this.request('/payment');
    }

    async createPayment(paymentData) {
        return await this.request('/payment', {
            method: 'POST',
            body: JSON.stringify(paymentData),
        });
    }

    // Shippers
    async createShipper(shipperData) {
        return await this.request('/shipper', {
            method: 'POST',
            body: JSON.stringify(shipperData),
        });
    }

    async deactivateShipper(code) {
        return await this.request('/shipper/deactivate', {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Get user info from token (basic implementation)
    getUserInfo() {
        if (!this.token) return null;
        
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            return {
                code: payload.code,
                email: payload.email,
                name: payload.name,
                role: payload.role,
            };
        } catch (error) {
            // console.error('Error parsing token:', error);
            return null;
        }
    }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 