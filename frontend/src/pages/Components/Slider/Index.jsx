import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import image1 from '/slider/slider-image.png';

import button from '/slider/slider-button.svg';

import './slider.scss';
import React from "react";

const Slider = () => {
    const navigationPrevRef = React.useRef(null)
    const navigationNextRef = React.useRef(null)

    return (
        <div className="slider-container">
            <div className="slider">
                <button className="swiper-btn-prev" ref={navigationPrevRef}>
                    <img src={button} alt="Previous" />
                </button>
                <Swiper spaceBetween={20}
                        slidesPerView={1}
                        modules={[Navigation]}
                        loop={"true"}
                        onInit={(swiper) => {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }}>
                    <SwiperSlide>
                        <img src={image1} alt="Slider Image" className="slider-img" aria-label="Slider Image"/>
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={image1} alt="Slider Image" className="slider-img" aria-label="Slider Image"/>
                    </SwiperSlide>
                </Swiper>
                <button className="swiper-btn-next" ref={navigationNextRef}>
                    <img src={button} alt="Next" />
                </button>
                <div className="swiper-pagination"></div>
            </div>
        </div>
    );
};

export default Slider;
