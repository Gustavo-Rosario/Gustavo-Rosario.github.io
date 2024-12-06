import { Container } from 'react-bootstrap';
import './App.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useRef, useState } from 'react';

function App() {

  const videoRef = useRef(null);

  // Função para acessar a câmera traseira
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Câmera traseira
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
    }
  };

  // Função para parar a câmera
  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Iniciar a câmera ao montar o componente
  useEffect(() => {
    startCamera();
    return () => stopCamera(); // Parar a câmera ao desmontar o componente
  }, []);

  return (
    <div>
      <h1>Acessar Câmera Traseira em React</h1>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      <br />
      <button onClick={stopCamera}>Parar Câmera</button>
    </div>
  );

}

export default App
