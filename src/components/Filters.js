import React, { useEffect, useState } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';

const Filters = ({
    genres,
    selectedGenres,
    onGenreToggle,
    onClearGenres,
    sortBy,
    onSortChange,
    headerControls,
}) => {
    const hasActiveFilters = selectedGenres.length > 0;
    const [isOpen, setIsOpen] = useState(hasActiveFilters);

    useEffect(() => {
        if (hasActiveFilters) {
            setIsOpen(true);
        }
    }, [hasActiveFilters]);

    return (
        <div className="space-y-3">
            <div className="floating-surface px-4 py-3.5 sm:px-5">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                            {headerControls}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {selectedGenres.length > 0 && (
                                <span className="rounded-[0.72rem] bg-[#2b2c2d] px-2.5 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] text-[#b2aca2]">
                                    {selectedGenres.length} genres
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsOpen((open) => !open)}
                                aria-expanded={isOpen}
                                className="inline-flex items-center gap-2 rounded-[0.72rem] bg-[#2b2c2d] px-3 py-2 text-[0.64rem] uppercase tracking-[0.16em] text-[#e7e1d7] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#313234]"
                            >
                                {isOpen ? 'Hide filters' : 'Show filters'}
                                <RiArrowDownSLine
                                    size={16}
                                    className={`transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                        </div>
                    </div>

                    {isOpen && (
                        <div className="grid gap-3">
                            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => onSortChange(e.target.value)}
                                        className="input-shell w-full min-w-[14rem] appearance-none px-3.5 py-2.5 pr-10 text-sm text-[#e7e1d7] focus:outline-none"
                                    >
                                        <option value="default" className="bg-[#242526]">Default order</option>
                                        <option value="rating_desc" className="bg-[#242526]">Highest rated</option>
                                        <option value="rating_asc" className="bg-[#242526]">Lowest rated</option>
                                        <option value="latest" className="bg-[#242526]">Latest first</option>
                                        <option value="oldest" className="bg-[#242526]">Oldest first</option>
                                    </select>
                                    <RiArrowDownSLine className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7f8499]" size={16} />
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        onClick={onClearGenres}
                                        className="rounded-[0.72rem] bg-[rgba(255,204,53,0.12)] px-2.5 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] text-[#e7e1d7] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[rgba(255,204,53,0.16)]"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {genres && genres.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {genres.map((genre) => (
                                        <button
                                            key={genre.id}
                                            onClick={() => onGenreToggle(genre.id)}
                                            className={`rounded-[0.72rem] px-2.5 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${selectedGenres.includes(genre.id)
                                                ? 'bg-[rgba(255,204,53,0.14)] text-[#e7e1d7]'
                                                : 'bg-[#2b2c2d] text-[#8f897f] hover:bg-[#313234] hover:text-[#e7e1d7]'
                                                }`}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Filters;
