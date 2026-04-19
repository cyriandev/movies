import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { RiArrowLeftSLine, RiArrowRightSLine, RiArrowRightUpLine, RiStarSFill } from 'react-icons/ri';
import Reveal from './Reveal';

const HeroSlider = ({ items, type = 'movie' }) => {
    const [current, setCurrent] = useState(0);

    const slides = items.slice(0, 5);

    useEffect(() => {
        if (slides.length < 2) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (!slides.length) return null;

    const item = slides[current];
    const title = type === 'movie' ? item.title : item.name;
    const date = type === 'movie' ? item.release_date : item.first_air_date;
    const originalLanguage = item.original_language ? item.original_language.toUpperCase() : '';
    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const link = type === 'movie' ? `/movies/${item.id}/${slug}` : `/tv/${item.id}/${slug}`;

    return (
        <Reveal className="w-full">
            <div className="double-shell">
                <div className="double-core relative overflow-hidden">
                    <div className="absolute inset-0">
                        {slides.map((slide, i) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-all duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${i === current ? 'opacity-100 scale-100' : 'pointer-events-none scale-[1.04] opacity-0'}`}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/original/${slide.backdrop_path}`}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover object-center opacity-40"
                                />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,204,53,0.18),transparent_22%),linear-gradient(90deg,rgba(32,33,34,0.98)_0%,rgba(32,33,34,0.9)_42%,rgba(32,33,34,0.68)_68%,rgba(32,33,34,0.92)_100%)]" />
                            </div>
                        ))}
                    </div>

                    <div className="relative flex min-h-[28rem] flex-col justify-between px-5 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
                        <div className="max-w-3xl">
                            <span className="luxury-badge">
                                <span className="eyebrow-dot" />
                                {type === 'movie' ? 'Featured tonight' : 'Series pick'}
                            </span>
                            <h1 className="headline-gradient mt-4 max-w-3xl text-[2.5rem] leading-[0.92] sm:text-[3.6rem] lg:text-[4.8rem]">
                                {title}
                            </h1>
                            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.2em] text-[var(--muted-warm)]">
                                <span className="rounded-full bg-black/78 px-3 py-1.5 text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
                                    {date ? moment(date).format('YYYY') : 'TBA'}
                                    {originalLanguage ? ` · ${originalLanguage}` : ''}
                                </span>
                                <span className="rounded-full bg-black/78 px-3 py-1.5 text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
                                    {type === 'movie' ? 'Feature film' : 'Series'}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full bg-black/78 px-3 py-1.5 text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-md">
                                    <RiStarSFill className="text-[var(--accent)]" />
                                    {item.vote_average != null ? Number(item.vote_average).toFixed(1) : 'N/A'}
                                </span>
                            </div>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9ca1b7]">
                                {item.overview}
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Link to={link} className="island-button group">
                                Explore title
                                <span className="icon-island">
                                    <RiArrowRightUpLine size={16} />
                                </span>
                            </Link>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(36,37,38,0.42)] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-[18px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[rgba(36,37,38,0.5)]"
                                >
                                    <RiArrowLeftSLine size={19} />
                                </button>
                                <button
                                    onClick={() => setCurrent((c) => (c + 1) % slides.length)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(36,37,38,0.42)] text-[#f5f6fb] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-[18px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[rgba(36,37,38,0.5)]"
                                >
                                    <RiArrowRightSLine size={19} />
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
};

export default HeroSlider;
