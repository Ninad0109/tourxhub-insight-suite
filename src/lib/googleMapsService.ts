// Google Maps Services utility
// This file provides utilities for using the new @googlemaps/google-maps-services-js package

import { Client } from '@googlemaps/google-maps-services-js';

// Initialize the Google Maps client
export const createGoogleMapsClient = (apiKey: string) => {
  return new Client({});
};

// Example usage for geocoding (if needed in the future)
export const geocodeAddress = async (address: string, apiKey: string) => {
  const client = createGoogleMapsClient(apiKey);
  
  try {
    const response = await client.geocode({
      params: {
        address,
        key: apiKey,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Example usage for reverse geocoding (if needed in the future)
export const reverseGeocode = async (lat: number, lng: number, apiKey: string) => {
  const client = createGoogleMapsClient(apiKey);
  
  try {
    const response = await client.reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: apiKey,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};
