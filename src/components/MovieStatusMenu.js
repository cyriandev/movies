import React, { useEffect, useRef, useState } from 'react';
import { RiBookmark3Fill, RiBookmark3Line, RiLoader4Line } from 'react-icons/ri';

const OPTION_LABELS = {
  planned: 'To watch',
  watched: 'Watched',
  remove: 'Remove',
};

const MovieStatusMenu = ({
  title,
  inWatchlist,
  pending,
  currentStatus,
  onSelect,
  positionClassName,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (pending) {
      setOpen(false);
    }
  }, [pending]);

  const handleToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!pending) {
      setOpen((prev) => !prev);
    }
  };

  const handleSelect = async (event, value) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
    await onSelect(value);
  };

  const buttonStateClass = inWatchlist
    ? 'bg-[linear-gradient(135deg,#ffe28a,var(--accent))] text-[#1b1c27] ring-[rgba(var(--accent-rgb),0.28)] shadow-[0_8px_18px_rgba(var(--accent-rgb),0.24)]'
    : 'bg-black/78 text-white ring-white/10 hover:bg-black/82';

  return (
    <div
      ref={menuRef}
      className={`absolute ${positionClassName}`}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-grid h-9 w-9 place-items-center overflow-hidden rounded-full leading-none shadow-[0_2px_8px_rgba(0,0,0,0.16)] ring-1 backdrop-blur-md transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${buttonStateClass} ${pending ? 'cursor-wait' : ''}`}
        aria-label={`Set watch status for ${title}`}
        title={`Set watch status for ${title}`}
        disabled={pending}
      >
        {pending ? (
          <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <RiLoader4Line className="block animate-spin" size={15} />
          </span>
        ) : inWatchlist ? (
          <RiBookmark3Fill size={15} />
        ) : (
          <RiBookmark3Line size={15} />
        )}
      </button>

      {open ? (
        <div className="absolute bottom-full right-0 z-20 mb-2 min-w-[8.5rem] overflow-hidden rounded-[1rem] bg-[#242526]/96 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] ring-1 ring-white/10 backdrop-blur-xl">
          {['planned', 'watched', ...(inWatchlist ? ['remove'] : [])].map((value) => {
            const isActive = value !== 'remove' && currentStatus === value;

            return (
              <button
                key={value}
                type="button"
                onClick={(event) => handleSelect(event, value)}
                className={`flex w-full items-center justify-between rounded-[0.8rem] px-3 py-2 text-left text-[0.72rem] font-medium transition-all duration-300 ${isActive ? 'bg-[rgba(255,204,53,0.16)] text-[var(--accent)]' : 'text-[#e7e1d7] hover:bg-white/5'}`}
              >
                <span>{OPTION_LABELS[value]}</span>
                {isActive ? <RiBookmark3Fill size={13} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default MovieStatusMenu;
