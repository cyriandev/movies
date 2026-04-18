import React from 'react';
import { RiUser3Line } from 'react-icons/ri';

const Cast = ({ cast }) => {
    return (
        <div className="double-shell h-full">
            <div className="double-core flex h-full items-center gap-3 px-3 py-3">
                <div className={`h-10 w-10 flex-shrink-0 overflow-hidden rounded-full ${cast.profile_path ? 'bg-[#232432]' : 'bg-white/[0.06]'}`}>
                    {cast.profile_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w300/${cast.profile_path}`}
                            alt={cast.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[var(--accent)]">
                            <RiUser3Line size={16} />
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">Cast</p>
                    <h4 className="mt-1.5 truncate text-[1rem] leading-none text-[#f5f6fb]">{cast.name}</h4>
                    <p className="mt-1.5 truncate text-[0.84rem] text-[#9ca1b7]">{cast.character || 'Role unavailable'}</p>
                </div>
            </div>
        </div>
    );
};

export default Cast;
