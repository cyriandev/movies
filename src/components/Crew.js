import React from 'react';
import { RiUser3Line } from 'react-icons/ri';

const Crew = ({ crew }) => {
    return (
        <div className="double-shell h-full">
            <div className="double-core flex h-full items-center gap-3 px-3 py-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[var(--accent)]">
                    <RiUser3Line size={16} />
                </div>
                <div className="min-w-0">
                    <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">Crew</p>
                    <h4 className="mt-1.5 truncate text-[1rem] leading-none text-[#f5f6fb]">{crew.name}</h4>
                    <p className="mt-1.5 text-[0.84rem] text-[#9ca1b7]">{crew.job}</p>
                </div>
            </div>
        </div>
    );
};

export default Crew;
