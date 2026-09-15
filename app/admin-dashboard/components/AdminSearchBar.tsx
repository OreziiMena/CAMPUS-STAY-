import React from "react";

interface AdminSearchBarProps {
  activeTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AdminSearchBar({
  activeTab,
  searchQuery,
  setSearchQuery,
}: AdminSearchBarProps) {
  if (activeTab === "broadcast" || activeTab === "analytics") {
    return null;
  }

  const getPlaceholder = () => {
    switch (activeTab) {
      case "students":
        return "Search students by name, username, email, or phone...";
      case "agents":
        return "Search agents by name, email, or phone...";
      case "properties":
        return "Search hostel properties by title, location, school, or agent...";
      case "roommates":
        return "Search roommate spaces by title, location, school, or student...";
      case "activity-logs":
        return "Search activity logs by agent name, email, property title...";
      case "reports":
        return "Search flagged reports by reporter email, description, listing...";
      case "payments":
        return "Search payments by reference, student, agent, or property...";
      default:
        return "Search verification queues...";
    }
  };

  return (
    <div className="admin-search-wrapper">
      <div className="admin-search-input-box">
        <i className="fas fa-search admin-search-icon"></i>
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="admin-search-input"
        />
      </div>
      {searchQuery && (
        <button 
          onClick={() => setSearchQuery("")}
          className="reject-btn admin-search-clear-btn"
        >
          Clear
        </button>
      )}
    </div>
  );
}
