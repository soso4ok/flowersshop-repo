import React from 'react';
import './about.scss';

const About = () => {
    return (
        <div className="about-page">

            <main className="about">
                <div className="about__container">
                    <div className="about__content">
                        <h1 className="about__title">About Floralia</h1>

                        <div className="about__text">
                            <p>
                                Welcome to Floralia, where passion for flowers meets artistry.
                                Founded with a simple belief that every moment deserves to be
                                celebrated with nature's most beautiful creations, we have been
                                crafting exquisite floral arrangements for over a decade. Our
                                team of dedicated florists brings together years of experience
                                and an unwavering commitment to quality, ensuring that each
                                bouquet tells its own unique story.
                            </p>

                            <p>
                                At Floralia, we source only the freshest blooms from trusted
                                local growers and sustainable farms around the world. Whether
                                you're celebrating a milestone, expressing gratitude, or simply
                                brightening someone's day, our handcrafted arrangements are
                                designed to convey your sentiments perfectly. We believe that
                                flowers have the power to transform ordinary moments into
                                extraordinary memories, and we're honored to be part of your
                                special occasions.
                            </p>
                        </div>
                    </div>

                    <div className="about__image">
                        <img
                            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                            alt="Floralia flower shop interior"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default About;
