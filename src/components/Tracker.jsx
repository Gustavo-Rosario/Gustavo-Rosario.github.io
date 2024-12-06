import { useEffect, useRef, useState } from 'react';
import 'aframe';
import 'aframe-ar';

const Tracker = () => {
  const [userPosition, setUserPosition] = useState({ lat: null, lng: null });
  const [targetPosition] = useState({ lat: -23.561684, lng: -46.625378 }); // Exemplo de um ponto em SP

  // Função para calcular a distância entre dois pontos de GPS
  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;
    return R * 2 * Math.asin(Math.sqrt(a));
  };

  // Função para rastrear a posição do usuário
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const distance = userPosition.lat
    ? getDistanceFromLatLonInKm(
        userPosition.lat,
        userPosition.lng,
        targetPosition.lat,
        targetPosition.lng
      )
    : null;

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <a-scene
        vr-mode-ui="enabled: false"
        embedded
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false"
      >
        <a-camera gps-camera rotation-reader></a-camera>

        {userPosition.lat && (
          <a-entity
            gps-entity-place={`latitude: ${targetPosition.lat}; longitude: ${targetPosition.lng};`}
            geometry="primitive: box; width: 1; height: 1; depth: 1;"
            material="color: red;"
            scale="5 5 5"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
          ></a-entity>
        )}
      </a-scene>

      <div style={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'white', padding: '10px' }}>
        {userPosition.lat && (
          <p>
            Latitude Atual: {userPosition.lat.toFixed(6)}, Longitude Atual: {userPosition.lng.toFixed(6)}
          </p>
        )}
        {distance && <p>Distância ao Alvo: {distance.toFixed(2)} km</p>}
      </div>
    </div>
  );
};

export default Tracker;