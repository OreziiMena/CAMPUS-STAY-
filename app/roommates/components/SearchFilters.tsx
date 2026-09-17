"use client";

import React from "react";
import SearchableSelect from "@/components/SearchableSelect";

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  university: string;
  onUniversityChange: (val: string) => void;
  campusOptions: Array<{ code: string; name: string }>;
  gender: string;
  onGenderChange: (val: string) => void;
  genderOptions: Array<{ code: string; name: string }>;
  maxBudget: string;
  onMaxBudgetChange: (val: string) => void;
}

export default function SearchFilters({
  searchQuery,
  onSearchChange,
  university,
  onUniversityChange,
  campusOptions,
  gender,
  onGenderChange,
  genderOptions,
  maxBudget,
  onMaxBudgetChange,
}: SearchFiltersProps) {
  return (
    <section className="roommates-search-section">
      <div className="roommates-search-card">
        <div className="roommates-filters-grid">
          {/* Search input */}
          <div className="filter-item">
            <label>Search Listings</label>
            <input
              type="text"
              placeholder="Search by title, location, or name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="filter-input"
            />
          </div>

          {/* University Selector */}
          <div className="filter-item">
            <label>Campus</label>
            <SearchableSelect
              options={campusOptions}
              value={university}
              onChange={onUniversityChange}
            />
          </div>

          {/* Gender Selector */}
          <div className="filter-item">
            <label>Roommate Gender</label>
            <SearchableSelect
              options={genderOptions}
              value={gender}
              onChange={onGenderChange}
            />
          </div>

          {/* Budget Limit input */}
          <div className="filter-item">
            <label>Max Rent (₦)</label>
            <input
              type="number"
              placeholder="Max budget (₦)"
              value={maxBudget}
              onChange={(e) => onMaxBudgetChange(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
