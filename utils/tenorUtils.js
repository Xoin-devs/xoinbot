import axios from 'axios';
import 'dotenv/config';

export const searchTenor = async (parameters) => {
    try {
        const response = await axios.get('https://tenor.googleapis.com/v2/search', {
            params: {limit: 1, key: process.env.TENOR_KEY, ...parameters},
        });
        return response.data.results[0].url;
    } catch (error) {
        console.error('Error searching Tenor:', error);
        throw error;
    }
};

// Example usage
const parameters = {
    q: 'groundhog',
    key: 'AIzaSyBmc5AYIgk90h09OJQzOmc_d9lLbT8rU78',
    random: 'true',
    limit: 20,
};

searchTenor(parameters)
    .then((data) => {
        console.log('Tenor search results:', data);
    })
    .catch((error) => {
        console.error('Error searching Tenor:', error);
        console.error(error.response.data);
    });
