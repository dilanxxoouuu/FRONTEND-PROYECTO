import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './pago.css';  // Asegúrate de tener este archivo CSS

const CheckoutForm = ({ cart, total }) => {
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('tarjeta');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Función para manejar la dirección de envío
    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    // Función para manejar el método de pago
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    // Función para realizar el pago y enviar la orden
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Crear el objeto para el envío y pago
            const orderData = {
                address: address,
                paymentMethod: paymentMethod,
                total: total,
                cart: cart
            };

            // Enviar los datos al backend
            const response = await axios.post('http://127.0.0.1:5000/checkout', orderData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Si el proceso es exitoso, redirigir al usuario
            if (response.status === 200) {
                navigate('/confirmacion');  // Redirige a una página de confirmación
            }
        } catch (err) {
            console.error('Error al procesar el pago y el envío:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="checkout-form">
                <h2>Formulario de Pago y Envío</h2>

                <form onSubmit={handleSubmit}>
                    {/* Dirección de Envío */}
                    <div className="form-group">
                        <label htmlFor="address">Dirección de Envío:</label>
                        <textarea
                            id="address"
                            value={address}
                            onChange={handleAddressChange}
                            required
                            placeholder="Ingresa tu dirección de envío"
                        />
                    </div>

                    {/* Método de Pago */}
                    <div className="form-group">
                        <label htmlFor="paymentMethod">Método de Pago:</label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                            required
                        >
                            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                            <option value="paypal">Paypal</option>
                            <option value="transferencia">Transferencia Bancaria</option>
                        </select>
                    </div>

                    {/* Total de la Compra */}
                    <div className="form-group">
                        <p className="total">Total: ${new Intl.NumberFormat().format(total)}</p>
                    </div>

                    {/* Botón de Confirmar Pago */}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Procesando...' : 'Confirmar Pago'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutForm;
