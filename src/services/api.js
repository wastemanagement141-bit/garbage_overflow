import axios from 'axios';

const API_BASE_URL = '/api/bin';

export const getBinStatus = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/status`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bin status:', error);
        return null;
    }
};

export const getHistory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history`);
        return response.data;
    } catch (error) {
        console.error('Error fetching history:', error);
        return [];
    }
};
