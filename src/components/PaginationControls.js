import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange, label }) => {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePageCount = Math.min(5, totalPages);
  const halfWindow = Math.floor(visiblePageCount / 2);
  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = startPage + visiblePageCount - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePageCount + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#7c8197]">
        {label} &middot; Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap items-center gap-2 rounded-[0.9rem] bg-[#242526] p-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="tab-pill bg-transparent !border-transparent !bg-transparent !shadow-none [backdrop-filter:none] [-webkit-backdrop-filter:none] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:transform-none"
          aria-label={`Previous page for ${label}`}
        >
          Previous
        </button>
        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Go to page ${pageNumber} for ${label}`}
              aria-current={isActive ? 'page' : undefined}
              className={`tab-pill min-w-[2.75rem] px-4 ${isActive ? 'tab-pill-active' : '!border-transparent !bg-transparent !shadow-none [backdrop-filter:none] [-webkit-backdrop-filter:none]'}`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="tab-pill bg-transparent !border-transparent !bg-transparent !shadow-none [backdrop-filter:none] [-webkit-backdrop-filter:none] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:transform-none"
          aria-label={`Next page for ${label}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
