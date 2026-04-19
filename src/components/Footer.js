import React from 'react';

const Footer = () => (
    <footer className="px-4 pb-4 pt-0 sm:px-5 lg:px-6">
        <div>
            <div className="double-shell">
                <div className="double-core px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                            <p className="text-[0.72rem] uppercase tracking-[0.2em] text-[#8f95ab]">
                                &copy; moviesntv
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <img
                                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
                                width="36"
                                alt="TMDB logo"
                            />
                            <p className="max-w-[16rem] text-[0.62rem] uppercase tracking-[0.18em] text-[#73788f]">
                                This product uses the TMDB API but is not endorsed or certified by TMDB.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
