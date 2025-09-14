import axios from 'axios';
import { Alert } from 'react-native';

const API_KEY = 'c6229a263bfb2258a6cdbbf13f4f4120';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (lat: number, lon: number) => {
  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log('🌍 Fetching weather from:', url);

    const response = await axios.get(url);
    console.log('✅ Weather API response:', response.data);

    return response.data;
  } catch (error: any) {
  console.log('❌ Full error object:', JSON.stringify(error, null, 2));
  const message = error?.response?.data?.message || error.message || 'Unknown error';
  Alert.alert('Weather API Error', message);
  throw error;
}

};
