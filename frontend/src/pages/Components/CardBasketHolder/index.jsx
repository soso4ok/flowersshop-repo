import React from 'react';
import './CardBasketHolder.scss'
import {useDispatch} from "react-redux";
import {changeItemCount} from "../../../redux/slices/cartSlice.js";


const CartBasketHolder = ({item}) => {
    const dispatch = useDispatch();
    const {id, count, name, price, image} = item;

    const handleChangeCount = (itemId, add) => {
        dispatch(changeItemCount({itemId, add}));
    }

    return (
        <div className="cart">
            <div className="cart-image-container">
                    <img
                        src={`${import.meta.env.VITE_API_KEY}/products/images/${image.imageId}`}
                    />
            </div>
            <div className="cart-content">
                <div className="cart-title">{name}</div>

                <div className="cart__price-and-counter">
                    <div className="cart__price">{price}</div>
                    <div className="cart__counter">
                        <div className="cart__counter-inner">
                            <div className="cart__counter-controls">
                                <button
                                    onClick={() => handleChangeCount(id, false)}
                                    className="cart__counter-control cart__counter-control--minus"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
                                        <path d="M27.7169 18.7874L10.6052 18.7874" stroke="#FF4693" strokeWidth="2.77488" strokeLinecap="round"/>
                                        <path d="M27.7169 18.7874L10.6052 18.7874" stroke="black" strokeOpacity="0.2" strokeWidth="2.77488" strokeLinecap="round"/>
                                    </svg>
                                </button>
                                <div className="cart__counter-num">{count}</div>
                                <button
                                    onClick={() => handleChangeCount(id, true)}
                                    className="cart__counter-control cart__counter-control--plus"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">
                                        <rect x="0.00158691" y="0.287964" width="36.9984" height="36.9984" rx="11.789" fill="#FF4693"/>
                                        <rect x="0.00158691" y="0.287964" width="36.9984" height="36.9984" rx="11.789" fill="black" fillOpacity="0.2"/>
                                        <path d="M26.8256 18.7874L9.71379 18.7874" stroke="#FCFCFC" strokeWidth="2.77488" strokeLinecap="round"/>
                                        <path d="M18.2703 27.3431L18.2703 10.2314" stroke="#FCFCFC" strokeWidth="2.77488" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cart-remove-button">
                <button className="remove-button">
                    Remove
                </button>
            </div>
        </div>
    );
};


export default CartBasketHolder;
