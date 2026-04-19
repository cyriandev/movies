import React, { useState } from 'react';
import moment from 'moment';
import { RiArrowRightUpLine, RiStarSFill, RiUser3Line } from 'react-icons/ri';

const Review = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    const avatarPath = item.author_details?.avatar_path;
    const avatarSrc = avatarPath
        ? avatarPath.startsWith('/https')
            ? avatarPath.substring(1)
            : `https://image.tmdb.org/t/p/w200${avatarPath}`
        : null;

    return (
        <div className="double-shell">
            <div className="double-core px-4 py-4">
                <div className="flex flex-wrap items-center gap-2.5">
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt={item.author}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] text-[var(--accent)]">
                            <RiUser3Line size={16} />
                        </div>
                    )}
                    <div>
                        <p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#7c8197]">Review</p>
                        <h4 className="mt-1.5 text-[1rem] leading-none text-[#f5f6fb]">{item.author}</h4>
                        <p className="mt-1.5 text-[0.84rem] text-[#9ca1b7]">{moment(item.created_at).format('DD MMMM YYYY')}</p>
                    </div>
                    {item.author_details?.rating && (
                        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#242526] px-2.5 py-1.5 text-[0.84rem] text-[#e7e1d7]">
                            <RiStarSFill className="text-[var(--accent)]" />
                            {item.author_details.rating}/10
                        </span>
                    )}
                </div>

                <p
                    className={`mt-4 whitespace-pre-line text-sm leading-7 text-[#9ca1b7] ${!expanded ? 'line-clamp-4' : ''
                        }`}
                >
                    {item.content}
                </p>

                {item.content.length > 200 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-[rgba(36,37,38,0.42)] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-[#e7e1d7] shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 ring-white/10 backdrop-blur-[18px] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[rgba(36,37,38,0.5)]"
                    >
                        {expanded ? 'Show less' : 'Read more'}
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] ring-1 ring-white/10">
                            <RiArrowRightUpLine size={14} />
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Review;
