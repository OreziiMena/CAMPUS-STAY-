import React from "react";

interface DirectoriesTabProps {
  activeTab: "students" | "agents" | "properties" | "roommates";
  studentUsers: any[];
  agentUsers: any[];
  allHostelProperties: any[];
  allRoommateListings: any[];
  filteredStudents: any[];
  filteredAgents: any[];
  filteredAllProperties: any[];
  filteredAllRoommates: any[];
  verifiedStudentsCount: number;
  verifiedAgentsCount: number;
  verifiedPropertiesCount: number;
  verifiedRoommatesCount: number;
  actionLoading: string | null;
  onToggleVerificationUser: (userId: string, role: "STUDENT" | "AGENT", currentStatus: boolean) => void;
  onDeleteUser: (userId: string, role: "STUDENT" | "AGENT") => void;
  onTogglePropertyVerification: (propertyId: string, currentStatus: boolean) => void;
  onDeleteProperty: (propertyId: string) => void;
}

export default function DirectoriesTab({
  activeTab,
  studentUsers,
  agentUsers,
  allHostelProperties,
  allRoommateListings,
  filteredStudents,
  filteredAgents,
  filteredAllProperties,
  filteredAllRoommates,
  verifiedStudentsCount,
  verifiedAgentsCount,
  verifiedPropertiesCount,
  verifiedRoommatesCount,
  actionLoading,
  onToggleVerificationUser,
  onDeleteUser,
  onTogglePropertyVerification,
  onDeleteProperty,
}: DirectoriesTabProps) {
  if (activeTab === "students") {
    return (
      <div className="admin-card">
        <h2>
          <i className="fas fa-user-graduate"></i> Student Users Directory{" "}
          <span className="dir-count-badge student">
            {verifiedStudentsCount} Verified / {studentUsers.length} Total
          </span>
        </h2>
        {studentUsers.length === 0 ? (
          <div className="no-data-text">No student accounts found.</div>
        ) : filteredStudents.length === 0 ? (
          <div className="no-data-text">No matching student accounts found.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Username</th>
                  <th>University</th>
                  <th>Email / Contact</th>
                  <th>Verification Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((u) => {
                  const isVerified = u.studentProfile?.isVerified || false;
                  return (
                    <tr key={u.id}>
                      <td className="user-cell-name">
                        <strong>{u.studentProfile?.fullName || "Student"}</strong>
                        {isVerified && (
                          <i className="fas fa-check-circle verified-icon-inline"></i>
                        )}
                      </td>
                      <td>{u.studentProfile?.username ? `@${u.studentProfile.username}` : "N/A"}</td>
                      <td>{u.studentProfile?.university || "N/A"}</td>
                      <td>
                        <div>{u.email}</div>
                        <div className="user-sub-contact">{u.phone}</div>
                      </td>
                      <td>
                        {isVerified ? (
                          <span className="status-badge verified"><i className="fas fa-check-circle"></i> Verified</span>
                        ) : (
                          <span className="status-badge unverified"><i className="fas fa-hourglass-half"></i> Unverified</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onToggleVerificationUser(u.id, "STUDENT", isVerified)}
                            disabled={actionLoading !== null}
                            className={`${isVerified ? "reject-btn" : "approve-btn"} admin-action-btn-wide`}
                          >
                            {actionLoading === u.id ? "Updating..." : (isVerified ? "Revoke Verify" : "Verify Account")}
                          </button>
                          <button 
                            onClick={() => onDeleteUser(u.id, "STUDENT")}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === u.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "agents") {
    return (
      <div className="admin-card">
        <h2>
          <i className="fas fa-user-tie"></i> Agent / Landlord Directory{" "}
          <span className="dir-count-badge agent">
            {verifiedAgentsCount} Verified / {agentUsers.length} Total
          </span>
        </h2>
        {agentUsers.length === 0 ? (
          <div className="no-data-text">No agent accounts found.</div>
        ) : filteredAgents.length === 0 ? (
          <div className="no-data-text">No matching agent accounts found.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Agent Name</th>
                  <th>Office Address</th>
                  <th>Email / Contact</th>
                  <th>Verification Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((u) => {
                  const isVerified = u.agentProfile?.isVerified || false;
                  return (
                    <tr key={u.id}>
                      <td className="user-cell-name">
                        <strong>{u.agentProfile?.fullName || "Agent"}</strong>
                        {isVerified && (
                          <i className="fas fa-check-circle verified-icon-inline"></i>
                        )}
                      </td>
                      <td>{u.agentProfile?.address || "No office address"}</td>
                      <td>
                        <div>{u.email}</div>
                        <div className="user-sub-contact">{u.phone}</div>
                      </td>
                      <td>
                        {isVerified ? (
                          <span className="status-badge verified"><i className="fas fa-check-circle"></i> Verified</span>
                        ) : (
                          <span className="status-badge unverified"><i className="fas fa-hourglass-half"></i> Unverified</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onToggleVerificationUser(u.id, "AGENT", isVerified)}
                            disabled={actionLoading !== null}
                            className={`${isVerified ? "reject-btn" : "approve-btn"} admin-action-btn-wide`}
                          >
                            {actionLoading === u.id ? "Updating..." : (isVerified ? "Revoke Verify" : "Verify Account")}
                          </button>
                          <button 
                            onClick={() => onDeleteUser(u.id, "AGENT")}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === u.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "properties") {
    return (
      <div className="admin-card">
        <h2>
          <i className="fas fa-building"></i> Hostels & Properties Directory{" "}
          <span className="dir-count-badge property">
            {verifiedPropertiesCount} Verified / {allHostelProperties.length} Total
          </span>
        </h2>
        {allHostelProperties.length === 0 ? (
          <div className="no-data-text">No listed hostel properties found.</div>
        ) : filteredAllProperties.length === 0 ? (
          <div className="no-data-text">No matching hostel properties found.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property Details</th>
                  <th>Type</th>
                  <th>Price & Fee Breakdown</th>
                  <th>Location & School</th>
                  <th>Listed By Agent</th>
                  <th>Verification Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllProperties.map((p) => {
                  const isVerified = p.isVerified || false;
                  const isOwnerVerified = p.agent ? p.agent.isVerified : false;
                  return (
                    <tr key={p.id}>
                      <td>
                        {(() => {
                          const mediaUrl = p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3";
                          const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                          return (
                            <div className="property-preview-cell">
                              <div className="property-preview-media-box">
                                {isVideo ? (
                                  <video 
                                    src={mediaUrl} 
                                    className="property-preview-media"
                                    muted
                                    playsInline
                                    preload="metadata"
                                  />
                                ) : (
                                  <img 
                                    src={mediaUrl} 
                                    alt={p.title} 
                                    className="property-preview-media"
                                  />
                                )}
                                {isVideo && (
                                  <span className="video-play-indicator">
                                    ▶
                                  </span>
                                )}
                              </div>
                              <span className="property-preview-title">{p.title}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td>{p.hostelType}</td>
                      <td>
                        <div className="property-price-container">
                          <strong className="property-price-heading">
                            ₦{p.price.toLocaleString()}
                            <span className="property-price-period"> / yr</span>
                          </strong>
                          <div className="property-fees-box">
                            <div><span className="property-fee-label">Rent:</span> ₦{(p.rentAmount ?? p.price).toLocaleString()}</div>
                            <div>
                              <span className="property-fee-label">Agent Fee:</span> ₦{(p.agentFee ?? 0).toLocaleString()}{" "}
                              {p.isNegotiable ? (
                                <span className="badge-negotiable">
                                  Negotiable
                                </span>
                              ) : (
                                <span className="badge-fixed">(Fixed)</span>
                              )}
                            </div>
                            {p.cautionFee !== null && p.cautionFee !== undefined && p.cautionFee > 0 && (
                              <div><span className="property-fee-label">Caution Fee:</span> ₦{p.cautionFee.toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{p.location}</div>
                        <div className="user-sub-contact">Near {p.university} ({p.distance})</div>
                      </td>
                      <td>
                        {p.agent ? (
                          <div className="user-cell-name">
                            <strong>{p.agent.fullName}</strong>
                            {p.agent.isVerified && (
                              <span className="verified-icon-inline" title="Verified Owner">
                                <i className="fas fa-check-circle"></i>
                              </span>
                            )}
                          </div>
                        ) : (
                          "CS Official"
                        )}
                      </td>
                      <td>
                        {isOwnerVerified ? (
                          <span className="status-badge verified"><i className="fas fa-check-circle"></i> Verified Agent</span>
                        ) : (
                          <span className="status-badge unverified"><i className="fas fa-hourglass-half"></i> Unverified Agent</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onTogglePropertyVerification(p.id, isVerified)}
                            disabled={actionLoading !== null}
                            className={`${isVerified ? "reject-btn" : "approve-btn"} admin-action-btn-wide`}
                          >
                            {actionLoading === p.id ? "Updating..." : (isVerified ? "Revoke Approval" : "Approve Listing")}
                          </button>
                          <button 
                            onClick={() => onDeleteProperty(p.id)}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === p.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === "roommates") {
    return (
      <div className="admin-card">
        <h2>
          <i className="fas fa-user-friends"></i> Roommate Listings Directory{" "}
          <span className="dir-count-badge roommate">
            {verifiedRoommatesCount} Verified / {allRoommateListings.length} Total
          </span>
        </h2>
        {allRoommateListings.length === 0 ? (
          <div className="no-data-text">No listed roommate spaces found.</div>
        ) : filteredAllRoommates.length === 0 ? (
          <div className="no-data-text">No matching roommate listings found.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room Details</th>
                  <th>Type</th>
                  <th>Shared Rent / Budget</th>
                  <th>University & Location</th>
                  <th>Listed By Student</th>
                  <th>Verification Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllRoommates.map((p) => {
                  const isVerified = p.isVerified || false;
                  const isStudentVerified = p.student?.isVerified || false;
                  return (
                    <tr key={p.id}>
                      <td>
                        {(() => {
                          const mediaUrl = p.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3";
                          const isVideo = mediaUrl.match(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i);
                          return (
                            <div className="property-preview-cell">
                              <div className="property-preview-media-box">
                                {isVideo ? (
                                  <video 
                                    src={mediaUrl} 
                                    className="property-preview-media"
                                    muted
                                    playsInline
                                    preload="metadata"
                                  />
                                ) : (
                                  <img 
                                    src={mediaUrl} 
                                    alt={p.title} 
                                    className="property-preview-media"
                                  />
                                )}
                                {isVideo && (
                                  <span className="video-play-indicator">
                                    ▶
                                  </span>
                                )}
                              </div>
                              <span className="property-preview-title">{p.title}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td>{p.hostelType || "Bedsitter"}</td>
                      <td>
                        <strong className="property-price-heading">
                          ₦{p.price.toLocaleString()}
                          <span className="property-price-period"> / yr</span>
                        </strong>
                        {p.roommateGenderPreference && (
                          <div className="gender-pref-chip">
                            Prefers: {p.roommateGenderPreference}
                          </div>
                        )}
                      </td>
                      <td>
                        <div>{p.location}</div>
                        <div className="user-sub-contact">Near {p.university} ({p.distance})</div>
                      </td>
                      <td>
                        {p.student ? (
                          <div>
                            <div className="user-cell-name">
                              <strong>{p.student.fullName || (p.student.username ? `@${p.student.username}` : "Student")}</strong>
                              {isStudentVerified && (
                                <span className="verified-icon-inline" title="Verified Student">
                                  <i className="fas fa-check-circle"></i>
                                </span>
                              )}
                            </div>
                            <div className="user-sub-contact">
                              {p.student.username ? `@${p.student.username}` : "Student Profile"}
                            </div>
                          </div>
                        ) : (
                          "Student Space"
                        )}
                      </td>
                      <td>
                        {isStudentVerified ? (
                          <span className="status-badge verified"><i className="fas fa-check-circle"></i> Verified Student</span>
                        ) : (
                          <span className="status-badge unverified"><i className="fas fa-hourglass-half"></i> Unverified Student</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onTogglePropertyVerification(p.id, isVerified)}
                            disabled={actionLoading !== null}
                            className={`${isVerified ? "reject-btn" : "approve-btn"} admin-action-btn-wide`}
                          >
                            {actionLoading === p.id ? "Updating..." : (isVerified ? "Revoke Approval" : "Approve Listing")}
                          </button>
                          <button 
                            onClick={() => onDeleteProperty(p.id)}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === p.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return null;
}
