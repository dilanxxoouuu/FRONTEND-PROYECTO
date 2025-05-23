import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const cartListRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [carritoId, setCarritoId] = useState(null);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    direccion: '',
    ciudad: '',
    departamento: '',
    codigo_postal: '',
    pais: ''
  });  
  const [shippingSubmitted, setShippingSubmitted] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("Token no disponible");
      return;
    }
  
    try {
      const carritoResponse = await axios.get('http://localhost:5000/carrito/activo', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const carritoId = carritoResponse.data.id_carrito;
      setCarritoId(carritoId);
      const existingProduct = cartItems.find(item => item.id_producto === product.id_producto);
  
      let updatedCartItems;
  
      if (existingProduct) {
        const updatedQuantity = existingProduct.cantidad + 1;
  
        await axios.put(
          `http://localhost:5000/carrito/${carritoId}/producto`,
          {
            id_producto: product.id_producto,
            cantidad: updatedQuantity,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        updatedCartItems = cartItems.map(item =>
          item.id_producto === product.id_producto
            ? { ...item, cantidad: updatedQuantity }
            : item
        );
      } else {
        const agregarProductoResponse = await axios.put(
          `http://localhost:5000/carrito/${carritoId}/producto`,
          {
            id_producto: product.id_producto,
            cantidad: 1,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const nuevoProducto = {
          ...product,
          cantidad: 1,
          producto_precio: product.producto_precio, // Asegúrate de que esté presente
        };
  
        updatedCartItems = [...cartItems, nuevoProducto];
      }
  
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error.response ? error.response.data : error.message);
    }
  };
  

  const fetchCart = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;

      const response = await axios.get('http://localhost:5000/carrito/activo', { headers });
      const carrito = response.data;
      setCarritoId(carrito.id_carrito);
      setCartItems(carrito.productos || []);
      calculateTotal(carrito.productos);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (!carritoId || newQuantity < 0) return;

    const headers = getAuthHeaders();

    if (newQuantity === 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/carrito/${carritoId}/producto`, {
        id_producto: productId,
        cantidad: newQuantity
      }, { headers });

      const updatedItems = cartItems.map(item =>
        item.id_producto === productId ? { ...item, cantidad: newQuantity } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error("Error actualizando cantidad", err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!carritoId) return;
    try {
      const headers = getAuthHeaders();
      await axios.delete(`http://localhost:5000/carrito/${carritoId}/producto`, {
        headers,
        data: { id_producto: productId }
      });

      const updatedItems = cartItems.filter(item => item.id_producto !== productId);
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (err) {
      console.error("Error eliminando producto", err);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get("http://localhost:5000/productos/recomendados", { headers });
      setRecommendedProducts(response.data);
    } catch (err) {
      console.error("Error al obtener productos recomendados", err);
    }
  };

  const calculateTotal = (items) => {
    const totalPrice = items.reduce((sum, item) => {
      const precio = Number(item.producto_precio) || 0;
      const cantidad = Number(item.cantidad) || 1;
      return sum + (precio * cantidad);
    }, 0);
    setTotal(totalPrice);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!paymentMethod) return false;

    if (paymentMethod === 'paypal') {
      return userDetails.email_paypal && userDetails.confirmacion_id;
    } else if (paymentMethod === 'transferencia') {
      return userDetails.nombre_titular && userDetails.banco_origen && userDetails.numero_cuenta && userDetails.comprobante_url;
    } else if (paymentMethod === 'tarjeta') {
      return userDetails.nombre_en_tarjeta && userDetails.numero_tarjeta && userDetails.cvv && userDetails.fecha_expiracion;
    }

    return false;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };
  

  const proceedToPayment = async () => {
    if (!validateForm()) return alert("Complete todos los campos del método de pago.");
    
    let id_pago = null;
    
    try {
      if (paymentMethod === 'paypal') {
        const response = await handlePaypalPayment();
        if (response && response.id_pago) {
          id_pago = response.id_pago;
        } else {
          throw new Error("Respuesta de PayPal no válida");
        }
      } else if (paymentMethod === 'transferencia') {
        const response = await handleTransferPayment();
        if (response && response.id_pago) {
          id_pago = response.id_pago;
        } else {
          throw new Error("Respuesta de Transferencia no válida");
        }
      } else if (paymentMethod === 'tarjeta') {
        const response = await handleCardPayment();
        if (response && response.id_pago) {
          id_pago = response.id_pago;
        } else {
          throw new Error("Respuesta de Tarjeta no válida");
        }
      }
  
      if (!id_pago) {
        console.error("No se obtuvo un id_pago válido.");
        return;
      }
      const headers = getAuthHeaders();
      await axios.post('http://localhost:5000/factura', { id_pago }, { headers });
      setPaymentSuccess(true);
      setShowShippingForm(true);
      
  
    } catch (err) {
      console.error('Error completo:', err);
      console.log('err.response:', err.response);
      console.log('err.response.data:', err.response?.data);
      const msg = err.response?.data?.message || JSON.stringify(err.response?.data) || 'Error desconocido al procesar el pago.';
      alert(msg);
    }
    
    
    
  };
  

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setUserDetails({}); // Resetear campos
  };

  const closeModal = () => {
    setShowModal(false);
    setUserDetails({});
    setPaymentSuccess(false);
    setPaymentMethod('');
  };

  const handlePaypalPayment = async () => {
    try {
      const headers = getAuthHeaders();
      const pagoRes = await axios.post('http://localhost:5000/pago', {
        monto: total,
        metodo_pago: 'paypal'
      }, { headers });
  
      const id_pago = pagoRes.data.id_pago;
  
      await axios.post('http://localhost:5000/pago/paypal', {
        id_pago,
        email_paypal: userDetails.email_paypal,
        confirmacion_id: userDetails.confirmacion_id
      }, { headers });
  
      return { id_pago };  // ✔️ Siempre retorna
    } catch (err) {
      console.error('Error en pago PayPal', err);
      return null;  // ❗️ Agregado para manejar el caso de error
    }
  };
  

  const handleTransferPayment = async () => {
    try {
      const headers = getAuthHeaders();
      const pagoRes = await axios.post('http://localhost:5000/pago', {
        monto: total,
        metodo_pago: 'transferencia'
      }, { headers });
  
      const id_pago = pagoRes.data.id_pago;
  
      await axios.post('http://localhost:5000/pago/transferencia', {
        id_pago,
        nombre_titular: userDetails.nombre_titular,
        banco_origen: userDetails.banco_origen,
        numero_cuenta: userDetails.numero_cuenta,
        comprobante_url: userDetails.comprobante_url
      }, { headers });
  
      return { id_pago };  // ✔️ Siempre retorna
    } catch (err) {
      console.error('Error en pago por transferencia', err);
      return null;  // ❗️ Agregado para evitar retorno implícito de undefined
    }
  };
  

  const handleCardPayment = async () => {
    try {
      const headers = getAuthHeaders();
      const pagoRes = await axios.post('http://localhost:5000/pago', {
        monto: total,
        metodo_pago: 'tarjeta'
      }, { headers });
  
      const id_pago = pagoRes.data.id_pago;
  
      await axios.post('http://localhost:5000/pago/tarjeta', {
        id_pago,
        numero_tarjeta: userDetails.numero_tarjeta,
        nombre_en_tarjeta: userDetails.nombre_en_tarjeta,
        cvv: userDetails.cvv,
        fecha_expiracion: userDetails.fecha_expiracion
      }, { headers });
  
      return { id_pago };  // ✔️ Siempre retorna
    } catch (err) {
      console.error('Error en pago con tarjeta', err);
      return null;  // ❗️ Evita retorno implícito de undefined
    }
  };

  
const submitShippingInfo = async () => {
  try {
    const headers = getAuthHeaders();
    
    // Primero obtenemos la factura más reciente del usuario
    const facturaResponse = await axios.get('http://localhost:5000/factura/ultima', { headers });
    const id_factura = facturaResponse.data.id_factura;

    if (!id_factura) {
      throw new Error("No se encontró una factura válida");
    }

    const response = await axios.post('http://localhost:5000/envio', {
      direccion: shippingDetails.direccion,
      ciudad: shippingDetails.ciudad,
      departamento: shippingDetails.departamento,
      codigo_postal: shippingDetails.codigo_postal,
      pais: shippingDetails.pais,
      estado_envio: "Empacando",
      id_factura: id_factura  // Añadimos el id_factura requerido
    }, { headers });

    setShippingSubmitted(true);
    alert("Datos de envío guardados con éxito");
  } catch (err) {
    console.error("Error al enviar datos de envío:", err);
    alert("Error al guardar datos de envío: " + (err.response?.data?.error || err.message));
  }
};
  

  useEffect(() => {
    fetchCart();
    fetchRecommendedProducts();
  }, []);

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="cart-list" ref={cartListRef}>
        <div className='titulopag'>
          <h2>Carrito de Compras</h2>
        </div>
        {cartItems.map((product) => (
          <div className="cart-item" key={product.id_producto}>
            <img src={`http://localhost:5000/static/uploads/${product.producto_foto}`} />
            <div className="cart-info">
              <h4>{product.producto_nombre}</h4>
              <p className="description">{product.descripcion}</p>
              <div className="price">${new Intl.NumberFormat('es-CL').format(product.producto_precio)}</div>
            </div>
            <div className="cart-controls">
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(product.id_producto, product.cantidad - 1)}>-</button>
                <span>{product.cantidad}</span>
                <button onClick={() => updateQuantity(product.id_producto, product.cantidad + 1)}>+</button>
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(product.id_producto)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: ${new Intl.NumberFormat('es-CL').format(total)}</h3>
        <button onClick={() => setShowModal(true)} className="btn-ir-modal">Ir a Pagar</button>

        {recommendedProducts.length > 0 && (
          <div className="recommended-section">
            <h4>También te puede interesar</h4>
            <div className="recommended-products">
              {recommendedProducts.map((product) => (
                <div className="recommended-card" key={product.id_producto}>
                  <img src={`http://localhost:5000/static/uploads/${product.producto_foto}`} alt={product.producto_nombre} />
                  <div className="recommended-info">
                    <p>{product.producto_nombre}</p>
                    <p>${new Intl.NumberFormat('es-CL').format(product.producto_precio)}</p>
                  </div>
                  <button 
                    className="btn-add-to-cart" 
                    onClick={() => handleAddToCart(product)} 
                    title="Agregar al carrito"
                  >
                    🛒
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {!paymentSuccess ? (
              <div>
                <h3>Método de Pago</h3>
                <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                  <option value="">Seleccione método de pago</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="paypal">PayPal</option>
                </select>

                {paymentMethod === 'paypal' && (
                  <>
                    <input name="email_paypal" placeholder="Correo PayPal" onChange={handleInputChange} />
                    <input name="confirmacion_id" placeholder="ID de Confirmación" onChange={handleInputChange} />
                  </>
                )}

                {paymentMethod === 'transferencia' && (
                  <>
                    <input name="nombre_titular" placeholder="Nombre del Titular" onChange={handleInputChange} />
                    <input name="banco_origen" placeholder="Banco de Origen" onChange={handleInputChange} />
                    <input name="numero_cuenta" placeholder="Número de Cuenta" onChange={handleInputChange} />
                    <input name="comprobante_url" placeholder="URL del Comprobante" onChange={handleInputChange} />
                  </>
                )}

                {paymentMethod === 'tarjeta' && (
                  <>
                    <input name="numero_tarjeta" placeholder="Número de Tarjeta" onChange={handleInputChange} />
                    <input name="nombre_en_tarjeta" placeholder="Nombre en la Tarjeta" onChange={handleInputChange} />
                    <input name="cvv" placeholder="CVV" onChange={handleInputChange} />
                    <input name="fecha_expiracion" placeholder="Fecha de Expiración (MM/AA)" onChange={handleInputChange} />
                  </>
                )}
<button onClick={proceedToPayment} className='btn-pago'>Confirmar Pago</button>
    </div>
  ) : (
    !shippingSubmitted ? (
      <div>
        <h3>¡Pago Realizado con Éxito!</h3>
        <h4>Ahora ingresa tus datos de envío</h4>

        <input
          name="direccion"
          placeholder="Dirección"
          value={shippingDetails.direccion}
          onChange={handleShippingChange}
        />
        <input
          name="ciudad"
          placeholder="Ciudad"
          value={shippingDetails.ciudad}
          onChange={handleShippingChange}
        />
        <input
          name="departamento"
          placeholder="Departamento"
          value={shippingDetails.departamento}
          onChange={handleShippingChange}
        />
        <input
          name="codigo_postal"
          placeholder="Código Postal"
          value={shippingDetails.codigo_postal}
          onChange={handleShippingChange}
        />
        <input
          name="pais"
          placeholder="País"
          value={shippingDetails.pais}
          onChange={handleShippingChange}
        />

        <button
          onClick={() => {
            if (
              !shippingDetails.direccion ||
              !shippingDetails.ciudad ||
              !shippingDetails.departamento ||
              !shippingDetails.codigo_postal ||
              !shippingDetails.pais
            ) {
              return alert("Por favor completa todos los campos de envío.");
            }
            submitShippingInfo();
          }}
        >
          Enviar Datos de Envío
        </button>
      </div>
    ) : (
      <div>
        <h3>¡Todo Listo!</h3>
        <p>Tu pedido está en camino 🚚</p>
        <button onClick={closeModal}>Cerrar</button>
      </div>
    )
  )}
</div>
</div>
)}
</div>
);
}

export default ShoppingCart;