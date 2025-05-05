import React, { useState } from 'react';
import './Carrusel.css';

const Carrusel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="carrusel">
            <div
                className="carrusel-inner"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div className="carrusel-item" key={index}>
                        <img src={image} alt={`Slide ${index}`} />
                    </div>
                ))}
            </div>
            <button className="carrusel-btn prev" onClick={prevSlide}>
                &#10094;
            </button>
            <button className="carrusel-btn next" onClick={nextSlide}>
                &#10095;
            </button>
        </div>
    );
};

export default Carrusel;
