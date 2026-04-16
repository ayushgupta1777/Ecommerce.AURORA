import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-16 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === 1 
            ? 'text-slate-300 cursor-not-allowed' 
            : 'text-slate-600 hover:bg-white hover:shadow-md hover:text-pink-500'
        } glass`}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="text-slate-400 px-2">
              <MoreHorizontal size={16} />
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] h-10 rounded-full text-sm font-bold transition-all ${
                currentPage === page 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-110' 
                  : 'text-slate-500 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === totalPages 
            ? 'text-slate-300 cursor-not-allowed' 
            : 'text-slate-600 hover:bg-white hover:shadow-md hover:text-pink-500'
        } glass`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
