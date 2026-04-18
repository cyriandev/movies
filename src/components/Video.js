import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Player from 'react-player/youtube';
import { RiArrowRightUpLine, RiCloseLine, RiPlayMiniFill } from 'react-icons/ri';

export const sortVideosByPriority = (items = []) => {
    const getPriority = (item) => {
        const type = item.type?.toLowerCase() || '';

        if (item.official && type === 'trailer') return 0;
        if (type === 'trailer') return 1;
        if (item.official) return 2;
        if (type === 'teaser') return 3;
        return 4;
    };

    return [...items].sort((a, b) => {
        const priorityDiff = getPriority(a) - getPriority(b);

        if (priorityDiff !== 0) {
            return priorityDiff;
        }

        return (b.published_at || '').localeCompare(a.published_at || '');
    });
};

const Video = ({ video, featured = false }) => {
    const [open, setOpen] = useState(false);

    const modal = open && typeof document !== 'undefined'
        ? createPortal(
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-3xl"
                onClick={() => setOpen(false)}
            >
                <div
                    className="double-shell relative w-full max-w-4xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="double-core overflow-hidden">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                            <div>
                                <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">Playback</p>
                                <h3 className="mt-1.5 truncate pr-4 text-[1.2rem] leading-none text-[#f5f6fb]">{video.name}</h3>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2b2c2d] text-[#e7e1d7]"
                            >
                                <RiCloseLine size={20} />
                            </button>
                        </div>
                        <div className="aspect-video">
                            <Player
                                url={`https://www.youtube.com/watch?v=${video.key}`}
                                playing={open}
                                controls
                                width="100%"
                                height="100%"
                            />
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <div
                className="double-shell group cursor-pointer"
                onClick={() => setOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
            >
                <div className={`double-core flex h-full ${featured ? 'flex-col gap-4 px-4 py-4 md:flex-row md:items-center' : 'items-center gap-3 px-3 py-3'}`}>
                    <div className={`relative flex-shrink-0 overflow-hidden bg-[#232432] ${featured ? 'aspect-video w-full rounded-[0.6rem] md:w-72' : 'h-12 w-20 rounded-[0.55rem]'}`}>
                        <img
                            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                            alt={video.name}
                            className="h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05]"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,7,0.16)_0%,rgba(10,8,7,0.32)_100%)]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`flex items-center justify-center rounded-full bg-[#2b2c2d]/90 text-[#e7e1d7] ${featured ? 'h-10 w-10' : 'h-7 w-7'}`}>
                                <RiPlayMiniFill size={featured ? 20 : 16} />
                            </div>
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">
                            {featured ? 'Featured trailer' : 'Video'}
                        </p>
                        <h4 className={`mt-1.5 text-[#f5f6fb] ${featured ? 'line-clamp-2 text-[1.2rem] leading-[1.05]' : 'truncate text-[1rem] leading-none'}`}>{video.name}</h4>
                        <p className={`mt-1.5 text-[#9ca1b7] ${featured ? 'line-clamp-2 text-[0.9rem] leading-6' : 'truncate text-[0.84rem]'}`}>
                            {video.type || video.site || 'Trailer'}
                            {video.official ? ' · Official' : ''}
                        </p>
                    </div>
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2b2c2d] text-[#e7e1d7] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                        <RiArrowRightUpLine size={16} />
                    </span>
                </div>
            </div>

            {modal}
        </>
    );
};

export default Video;
