"use client";
import React, { useState, useRef, useEffect } from "react";

interface Option {
  code: string;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showSearch?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  disabled = false,
  required = false,
  showSearch = options.length > 5,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.code === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase()) ||
    opt.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="searchable-select-container">
      <div
        className={`searchable-select-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="trigger-text">{selectedOption ? selectedOption.name : placeholder}</span>
        <i className={`fas fa-chevron-down select-chevron ${isOpen ? "rotate" : ""}`}></i>
      </div>

      {isOpen && (
        <div className="searchable-select-dropdown">
          {showSearch && (
            <div className="searchable-select-search-box">
              <i className="fas fa-search search-box-icon"></i>
              <input
                type="text"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="search-box-input"
              />
              {search && (
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSearch(""); }}
                  className="search-box-clear"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>
          )}

          <div className="searchable-select-options-list">
            {filteredOptions.length === 0 ? (
              <div className="no-options-found">No institutions found</div>
            ) : (
              filteredOptions.map((opt) => (
                <div
                  key={opt.code}
                  className={`searchable-select-option ${opt.code === value ? "selected" : ""}`}
                  onClick={() => {
                    onChange(opt.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <span>{opt.name}</span>
                  {opt.code === value && <i className="fas fa-check option-check-icon"></i>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hidden input to support standard HTML form validation */}
      <input 
        type="hidden" 
        value={value} 
        required={required} 
        disabled={disabled}
      />

      <style jsx>{`
        *, *:before, *:after {
          box-sizing: border-box;
        }
        .searchable-select-container {
          position: relative;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          font-family: 'Open Sans', sans-serif;
        }

        .searchable-select-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          box-sizing: border-box;
          padding: 12px 16px;
          background-color: white;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          color: #333;
          transition: all 0.2s ease;
          user-select: none;
          min-height: 48px;
          overflow: hidden;
        }

        .trigger-text {
          flex: 1 1 0%;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
          display: block;
        }

        .searchable-select-trigger:hover:not(.disabled) {
          border-color: rgb(2, 53, 28);
          box-shadow: 0 2px 8px rgba(2, 53, 28, 0.05);
        }

        .searchable-select-trigger.open {
          border-color: rgb(2, 53, 28);
          box-shadow: 0 0 0 3px rgba(2, 53, 28, 0.1);
        }

        .searchable-select-trigger.disabled {
          background-color: #f5f5f5;
          color: #999;
          cursor: not-allowed;
        }

        .select-chevron {
          font-size: 0.85rem;
          color: #777;
          transition: transform 0.2s ease;
          flex-shrink: 0;
        }

        .select-chevron.rotate {
          transform: rotate(180deg);
        }

        .searchable-select-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          width: 100%;
          background: white;
          border: 1px solid #eaeaea;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .searchable-select-search-box {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid #f0f0f0;
          gap: 10px;
          background-color: #fafafa;
        }

        .search-box-icon {
          color: #888;
          font-size: 0.9rem;
        }

        .search-box-input {
          flex-grow: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.9rem;
          color: #333;
          font-family: 'Open Sans', sans-serif;
          width: 100%;
        }

        .search-box-clear {
          background: none;
          border: none;
          color: #bbb;
          cursor: pointer;
          font-size: 0.95rem;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.15s ease;
        }

        .search-box-clear:hover {
          color: #666;
        }

        .searchable-select-options-list {
          max-height: 240px;
          overflow-y: auto;
          padding: 6px 0;
        }

        /* Custom Scrollbar */
        .searchable-select-options-list::-webkit-scrollbar {
          width: 6px;
        }
        .searchable-select-options-list::-webkit-scrollbar-track {
          background: #f9f9f9;
        }
        .searchable-select-options-list::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 3px;
        }
        .searchable-select-options-list::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }

        .searchable-select-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          font-size: 0.9rem;
          color: #444;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: 'Open Sans', sans-serif;
        }

        .searchable-select-option:hover {
          background-color: #e8fdf4;
          color: rgb(2, 53, 28);
          font-weight: 500;
        }

        .searchable-select-option.selected {
          background-color: rgba(2, 53, 28, 0.06);
          color: rgb(2, 53, 28);
          font-weight: 600;
        }

        .option-check-icon {
          font-size: 0.8rem;
          color: rgb(2, 53, 28);
          flex-shrink: 0;
          margin-left: 10px;
        }

        .no-options-found {
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
