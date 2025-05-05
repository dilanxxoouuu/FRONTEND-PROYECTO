import React, { useState, useEffect } from 'react';
import './SeguimientoEnvio.css';

const SeguimientoEnvio = ({ idEnvio }) => {
    const [estados, setEstados] = useState([]);
    const [progreso, setProgreso] = useState('0%');
    const [tiempoEstimado, setTiempoEstimado] = useState('');
    const [mostrarAnimacion, setMostrarAnimacion] = useState(false);

    // Simular la obtención de los estados iniciales
    useEffect(() => {
        // Aquí harías la llamada a tu endpoint /api/envio
        const fetchEstadosIniciales = async () => {
            try {
                // Simulación de respuesta
                const data = {
                    estados: [
                        {"estado": "Pedido recibido 🛒", "descripcion": "Hemos recibido tu pedido", "completado": true},
                        {"estado": "Procesando pago 💳", "descripcion": "Verificando tu pago", "completado": false},
                        {"estado": "Preparando tu pedido 👨‍🍳", "descripcion": "Preparando los productos", "completado": false},
                        {"estado": "Empacando productos 🎁", "descripcion": "Empaquetando todo con cuidado", "completado": false},
                        {"estado": "En bodega para despacho 📦", "descripcion": "Listo para salir", "completado": false},
                        {"estado": "En camino a tu ubicación 🚚", "descripcion": "Repartidor en camino", "completado": false},
                        {"estado": "¡Pedido entregado! 🎉", "descripcion": "Disfruta tu pedido", "completado": false}
                    ],
                    tiempo_total_estimado: "35 mins"
                };
                setEstados(data.estados);
                setTiempoEstimado(data.tiempo_total_estimado);
                setMostrarAnimacion(true);
            } catch (error) {
                console.error("Error al obtener estados:", error);
            }
        };

        fetchEstadosIniciales();
    }, [idEnvio]);

    // Simular el avance del envío
    useEffect(() => {
        if (!mostrarAnimacion) return;

        const interval = setInterval(() => {
            setEstados(prevEstados => {
                const nuevosEstados = [...prevEstados];
                const index = nuevosEstados.findIndex(e => !e.completado);
                
                if (index !== -1) {
                    nuevosEstados[index].completado = true;
                    
                    // Calcular nuevo progreso
                    const completados = nuevosEstados.filter(e => e.completado).length;
                    const total = nuevosEstados.length;
                    setProgreso(`${Math.round((completados / total) * 100)}%`);
                    
                    // Si es el último estado, detener el intervalo
                    if (index === nuevosEstados.length - 1) {
                        clearInterval(interval);
                    }
                }
                
                return nuevosEstados;
            });
        }, 5000); // Avanza cada 5 segundos

        return () => clearInterval(interval);
    }, [mostrarAnimacion]);

    return (
        <div className="seguimiento-envio">
            <h2>Seguimiento de tu pedido</h2>
            <p className="tiempo-estimado">Tiempo estimado: {tiempoEstimado}</p>
            
            <div className="progreso-bar">
                <div className="progreso" style={{ width: progreso }}></div>
            </div>
            <p className="porcentaje">{progreso}</p>
            
            <div className="estados-container">
                {estados.map((estado, index) => (
                    <div 
                        key={index} 
                        className={`estado ${estado.completado ? 'completado' : ''}`}
                    >
                        <div className="estado-icono">
                            {estado.completado ? '✓' : (index + 1)}
                        </div>
                        <div className="estado-info">
                            <h3>{estado.estado}</h3>
                            <p>{estado.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeguimientoEnvio;