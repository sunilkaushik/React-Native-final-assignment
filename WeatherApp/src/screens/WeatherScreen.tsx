import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { fetchWeather } from '../services/weatherApi';

export default function WeatherScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const cached = await AsyncStorage.getItem('weatherData');
        const cacheTime = await AsyncStorage.getItem('weatherTime');

        if (cached && cacheTime) {
          const diff = Date.now() - parseInt(cacheTime, 10);
          if (diff < 15 * 60 * 1000) {
            console.log('✅ Using cached weather data');
            setWeather(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }

        Geolocation.getCurrentPosition(
          async pos => {
            const { latitude, longitude } = pos.coords;
            console.log('📍 Location:', latitude, longitude);

            try {
              const data = await fetchWeather(latitude, longitude);
              setWeather(data);
              await AsyncStorage.setItem('weatherData', JSON.stringify(data));
              await AsyncStorage.setItem('weatherTime', Date.now().toString());
            } catch (error) {
              Alert.alert('Error', 'Failed to fetch weather data');
            } finally {
              setLoading(false);
            }
          },
          error => {
            console.error('❌ Location error:', error.message);
            Alert.alert('Location Error', error.message);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
      } catch (e) {
        console.error('❌ Cache error:', e);
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (loading) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item flexDirection="column" alignItems="center" marginTop={50}>
          <SkeletonPlaceholder.Item width={200} height={30} borderRadius={8} marginBottom={10} />
          <SkeletonPlaceholder.Item width={100} height={30} borderRadius={8} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }

  if (!weather) {
    return (
      <View style={styles.container}>
        <Text>No weather data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{weather.name}</Text>
      <Text style={styles.info}>🌡 {weather.main.temp}°C</Text>
      <Text style={styles.info}>💧 Humidity: {weather.main.humidity}%</Text>
      <Text style={styles.info}>☁️ Condition: {weather.weather[0].description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold' },
  info: { fontSize: 18, marginTop: 8 },
});
