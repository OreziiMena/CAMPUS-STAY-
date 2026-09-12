import React, { useState } from "react";

interface VerificationsTabProps {
  students: any[];
  agents: any[];
  propertiesQueue: any[];
  roommatesQueue: any[];
  filteredQueueStudents: any[];
  filteredQueueAgents: any[];
  filteredQueueProperties: any[];
  filteredQueueRoommates: any[];
  actionLoading: string | null;
  onVerifyUser: (profileId: string, role: "STUDENT" | "AGENT") => void;
  onRejectUser: (profileId: string, role: "STUDENT" | "AGENT") => void;
  onVerifyProperty: (propertyId: string) => void;
  onRejectProperty: (propertyId: string) => void;
  onPreviewDoc: (doc: { url: string; title: string }) => void;
}

export default function VerificationsTab({
  students,
  agents,
  propertiesQueue,
  roommatesQueue,
  filteredQueueStudents,
  filteredQueueAgents,
  filteredQueueProperties,
  filteredQueueRoommates,
  actionLoading,
  onVerifyUser,
  onRejectUser,
  onVerifyProperty,
  onRejectProperty,
  onPreviewDoc,
}: VerificationsTabProps) {
  const [activeQueueTab, setActiveQueueTab] = useState<"students" | "agents" | "properties" | "roommates">("students");

  return (
    <div>
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeQueueTab === "students" ? "active" : ""}`}
          onClick={() => setActiveQueueTab("students")}
        >
          Students Queue ({students.length})
        </button>
        <button 
          className={`tab-btn ${activeQueueTab === "agents" ? "active" : ""}`}
          onClick={() => setActiveQueueTab("agents")}
        >
          Agents Queue ({agents.length})
        </button>
        <button 
          className={`tab-btn ${activeQueueTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveQueueTab("properties")}
        >
          Properties Queue ({propertiesQueue.length})
        </button>
        <button 
          className={`tab-btn ${activeQueueTab === "roommates" ? "active" : ""}`}
          onClick={() => setActiveQueueTab("roommates")}
        >
          Roommates Queue ({roommatesQueue.length})
        </button>
      </div>

      {activeQueueTab === "students" && (
        <div className="admin-card">
          <h2><i className="fas fa-user-graduate"></i> Pending Student Verifications</h2>
          {students.length === 0 ? (
            <div className="no-data-text">No pending student verification requests.</div>
          ) : filteredQueueStudents.length === 0 ? (
            <div className="no-data-text">No matching student verification requests.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>University</th>
                    <th>Contact Details</th>
                    <th>Verification Documents</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueueStudents.map((student) => (
                    <tr key={student.id}>
                      <td><strong>{student.fullName}</strong></td>
                      <td>@{student.username}</td>
                      <td>{student.university}</td>
                      <td>
                        <div>{student.user.email}</div>
                        <div className="user-sub-contact">{student.user.phone}</div>
                      </td>
                      <td>
                        <div className="doc-links-cell">
                          {!student.idCardDoc && !student.feesReceiptDoc && !student.portalScreenshotDoc && !student.jambLetterDoc && (
                            <span className="no-doc-uploaded">No documents uploaded</span>
                          )}
                          {student.idCardDoc && (
                            <button 
                              onClick={() => onPreviewDoc({ url: student.idCardDoc, title: `${student.fullName}'s Student ID Card` })}
                              className="doc-link-btn"
                            >
                              <i className="fas fa-id-card"></i> Student ID Card
                            </button>
                          )}
                          {student.feesReceiptDoc && (
                            <button 
                              onClick={() => onPreviewDoc({ url: student.feesReceiptDoc, title: `${student.fullName}'s School Fees Receipt` })}
                              className="doc-link-btn"
                            >
                              <i className="fas fa-receipt"></i> School Fees Receipt
                            </button>
                          )}
                          {student.portalScreenshotDoc && (
                            <button 
                              onClick={() => onPreviewDoc({ url: student.portalScreenshotDoc, title: `${student.fullName}'s Portal Screenshot` })}
                              className="doc-link-btn"
                            >
                              <i className="fas fa-desktop"></i> Portal Screenshot
                            </button>
                          )}
                          {student.jambLetterDoc && (
                            <button 
                              onClick={() => onPreviewDoc({ url: student.jambLetterDoc, title: `${student.fullName}'s JAMB Letter` })}
                              className="doc-link-btn"
                            >
                              <i className="fas fa-envelope-open-text"></i> JAMB Letter
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onVerifyUser(student.id, "STUDENT")}
                            disabled={actionLoading !== null}
                            className="approve-btn"
                          >
                            {actionLoading === student.id ? "Approving..." : "Approve"}
                          </button>
                          <button 
                            onClick={() => onRejectUser(student.id, "STUDENT")}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === student.id ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeQueueTab === "agents" && (
        <div className="admin-card">
          <h2><i className="fas fa-user-tie"></i> Pending Agent/Landlord Verifications</h2>
          {agents.length === 0 ? (
            <div className="no-data-text">No pending agent verification requests.</div>
          ) : filteredQueueAgents.length === 0 ? (
            <div className="no-data-text">No matching agent verification requests.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Business Address</th>
                    <th>Contact Details</th>
                    <th>Verification Document</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueueAgents.map((agent) => (
                    <tr key={agent.id}>
                      <td><strong>{agent.fullName}</strong></td>
                      <td>{agent.address || "No office address provided"}</td>
                      <td>
                        <div>{agent.user.email}</div>
                        <div className="user-sub-contact">{agent.user.phone}</div>
                      </td>
                      <td>
                        {agent.ninDocument ? (
                          <button 
                            onClick={() => onPreviewDoc({ url: agent.ninDocument, title: `${agent.fullName}'s NIN / Govt ID Document` })}
                            className="doc-link-btn"
                          >
                            <i className="fas fa-file-alt"></i> NIN / Govt ID Document
                          </button>
                        ) : (
                          <span className="no-doc-uploaded danger">No Document Uploaded</span>
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onVerifyUser(agent.id, "AGENT")}
                            disabled={actionLoading !== null}
                            className="approve-btn"
                          >
                            {actionLoading === agent.id ? "Approving..." : "Approve"}
                          </button>
                          <button 
                            onClick={() => onRejectUser(agent.id, "AGENT")}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === agent.id ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeQueueTab === "properties" && (
        <div className="admin-card">
          <h2><i className="fas fa-building"></i> Pending Property Approvals</h2>
          {propertiesQueue.length === 0 ? (
            <div className="no-data-text">No pending property approvals.</div>
          ) : filteredQueueProperties.length === 0 ? (
            <div className="no-data-text">No matching property approvals.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Property details</th>
                    <th>Type</th>
                    <th>Price & Fee Breakdown</th>
                    <th>Location & Distance</th>
                    <th>Listed By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueueProperties.map((property) => (
                    <tr key={property.id}>
                      <td>
                        {(() => {
                          const mediaUrl = property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3";
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
                                    alt={property.title} 
                                    className="property-preview-media"
                                  />
                                )}
                                {isVideo && (
                                  <span className="video-play-indicator">
                                    ▶
                                  </span>
                                )}
                              </div>
                              <span className="property-preview-title">{property.title}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td>{property.hostelType}</td>
                      <td>
                        <div className="property-price-container">
                          <strong className="property-price-heading">
                            ₦{property.price.toLocaleString()}
                            <span className="property-price-period"> / yr</span>
                          </strong>
                          <div className="property-fees-box">
                            <div><span className="property-fee-label">Rent:</span> ₦{(property.rentAmount ?? property.price).toLocaleString()}</div>
                            <div>
                              <span className="property-fee-label">Agent Fee:</span> ₦{(property.agentFee ?? 0).toLocaleString()}{" "}
                              {property.isNegotiable ? (
                                <span className="badge-negotiable">
                                  Negotiable
                                </span>
                              ) : (
                                <span className="badge-fixed">(Fixed)</span>
                              )}
                            </div>
                            {property.cautionFee !== null && property.cautionFee !== undefined && property.cautionFee > 0 && (
                              <div><span className="property-fee-label">Caution Fee:</span> ₦{property.cautionFee.toLocaleString()}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{property.location}</div>
                        <div className="user-sub-contact">{property.distance}</div>
                      </td>
                      <td>
                        {property.agent ? (
                          <div>
                            <div className="user-cell-name">
                              <strong>{property.agent.username ? `@${property.agent.username}` : property.agent.fullName}</strong>
                              {property.agent.isVerified && (
                                <span className="verified-icon-inline" title="Verified Owner">
                                  <i className="fas fa-check-circle"></i>
                                </span>
                              )}
                            </div>
                            <div className="user-sub-contact">Agent/Landlord</div>
                          </div>
                        ) : (
                          "CS Official"
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onVerifyProperty(property.id)}
                            disabled={actionLoading !== null}
                            className="approve-btn"
                          >
                            {actionLoading === property.id ? "Approving..." : "Approve"}
                          </button>
                          <button 
                            onClick={() => onRejectProperty(property.id)}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === property.id ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeQueueTab === "roommates" && (
        <div className="admin-card">
          <h2><i className="fas fa-user-friends"></i> Pending Roommate Space Approvals</h2>
          {roommatesQueue.length === 0 ? (
            <div className="no-data-text">No pending roommate space approvals.</div>
          ) : filteredQueueRoommates.length === 0 ? (
            <div className="no-data-text">No matching roommate space approvals.</div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Room Details</th>
                    <th>Type</th>
                    <th>Shared Rent / Budget</th>
                    <th>University & Location</th>
                    <th>Student Profile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueueRoommates.map((property) => (
                    <tr key={property.id}>
                      <td>
                        {(() => {
                          const mediaUrl = property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3";
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
                                    alt={property.title} 
                                    className="property-preview-media"
                                  />
                                )}
                                {isVideo && (
                                  <span className="video-play-indicator">
                                    ▶
                                  </span>
                                )}
                              </div>
                              <span className="property-preview-title">{property.title}</span>
                            </div>
                          );
                        })()}
                      </td>
                      <td>{property.hostelType || "Bedsitter"}</td>
                      <td>
                        <strong className="property-price-heading">
                          ₦{property.price.toLocaleString()}
                          <span className="property-price-period"> / yr</span>
                        </strong>
                        {property.roommateGenderPreference && (
                          <div className="gender-pref-chip">
                            Prefers: {property.roommateGenderPreference}
                          </div>
                        )}
                      </td>
                      <td>
                        <div>{property.location}</div>
                        <div className="user-sub-contact">Near {property.university} ({property.distance})</div>
                      </td>
                      <td>
                        {property.student ? (
                          <div>
                            <div className="user-cell-name">
                              <strong>{property.student.fullName || (property.student.username ? `@${property.student.username}` : "Student")}</strong>
                              {property.student.isVerified && (
                                <span className="verified-icon-inline" title="Verified Student">
                                  <i className="fas fa-check-circle"></i>
                                </span>
                              )}
                            </div>
                            <div className="user-sub-contact">
                              {property.student.username ? `@${property.student.username}` : property.student.university || "Student Listing"}
                            </div>
                          </div>
                        ) : (
                          "Student Listing"
                        )}
                      </td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            onClick={() => onVerifyProperty(property.id)}
                            disabled={actionLoading !== null}
                            className="approve-btn"
                          >
                            {actionLoading === property.id ? "Approving..." : "Approve"}
                          </button>
                          <button 
                            onClick={() => onRejectProperty(property.id)}
                            disabled={actionLoading !== null}
                            className="reject-btn"
                          >
                            {actionLoading === property.id ? "Rejecting..." : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
