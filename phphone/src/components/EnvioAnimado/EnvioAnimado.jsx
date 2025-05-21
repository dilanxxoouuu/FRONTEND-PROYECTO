import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const rutaSimulada = [
  { lat: 4.60971, lng: -74.08175 }, // Punto inicial
  { lat: 4.61071, lng: -74.08275 },
  { lat: 4.61171, lng: -74.08375 },
  { lat: 4.61271, lng: -74.08475 },
  { lat: 4.61371, lng: -74.08575 }, // Punto final simulado
];

const EnvioAnimado = () => {
  const [posicionIndex, setPosicionIndex] = useState(0);
  const [posicionActual, setPosicionActual] = useState(rutaSimulada[0]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setPosicionIndex((prev) => {
        const siguiente = prev + 1;
        if (siguiente < rutaSimulada.length) {
          setPosicionActual(rutaSimulada[siguiente]);
          return siguiente;
        } else {
          clearInterval(intervalo);
          return prev;
        }
      });
    }, 2000); // cada 2 segundos avanza

    return () => clearInterval(intervalo);
  }, []);

  return (
    <MapContainer center={posicionActual} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={posicionActual}>
        <Popup>¡Tu pedido está en camino! 🚚</Popup>
      </Marker>
    </MapContainer>
  );
};

export default EnvioAnimado;
