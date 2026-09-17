"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { 
  updateStudentProfile, 
  saveStudentPreferences 
} from "@/app/actions/student";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";
import SearchableSelect from "@/components/SearchableSelect";

const GENDER_OPTIONS = [
  { code: "Any", name: "Any / Prefer not to say" },
  { code: "Male", name: "Male" },
  { code: "Female", name: "Female" }
];

const LEVEL_OPTIONS = [
  { code: "100L", name: "100 Level (Freshman)" },
  { code: "200L", name: "200 Level" },
  { code: "300L", name: "300 Level" },
  { code: "400L", name: "400 Level" },
  { code: "500L", name: "500 Level (Finalist)" },
  { code: "Postgraduate", name: "Postgraduate" }
];

const CLEANLINESS_OPTIONS = [
  { code: "Very Clean", name: "Very Clean" },
  { code: "Average", name: "Average" },
  { code: "Relaxed", name: "Relaxed" }
];

const SLEEP_OPTIONS = [
  { code: "Early Bird", name: "Early Bird" },
  { code: "Night Owl", name: "Night Owl" },
  { code: "Flexible", name: "Flexible" }
];

const NOISE_OPTIONS = [
  { code: "Quiet environment", name: "Quiet environment" },
  { code: "Social/Group study", name: "Social/Group study" },
  { code: "Flexible", name: "Flexible" }
];

export default function StudentProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [activeTab, setActiveTab] = useState("details-section");

  // Roommate Preferences state
  const [openToRoommates, setOpenToRoommates] = useState(false);
  const [budgetLimit, setBudgetLimit] = useState("");
  const [gender, setGender] = useState("Any");
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("100L");
  const [cleanliness, setCleanliness] = useState("Average");
  const [sleepSchedule, setSleepSchedule] = useState("Flexible");
  const [noiseLevel, setNoiseLevel] = useState("Flexible");

  // Status/saving helpers
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [prefLoading, setPrefLoading] = useState(false);
  const [prefStatus, setPrefStatus] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user || user.role !== "STUDENT") {
        router.push("/auth/login");
        return;
      }

      const profile = user.studentProfile;
      setEmail(user.email);
      setPhone(user.phone);
      setUniversity(profile?.university || "");

      const names = (profile?.fullName || "").trim().split(/\s+/);
      setFirstName(names[0] || "");
      setLastName(names.slice(1).join(" ") || "");

      // Load preferences
      const prefs = profile?.preferences as any;
      if (prefs) {
        setOpenToRoommates(prefs.openToRoommates || false);
        setBudgetLimit(prefs.budgetLimit ? String(prefs.budgetLimit) : "");
        setGender(prefs.gender || "Any");
        setDepartment(prefs.department || "");
        setLevel(prefs.level || "100L");
        setCleanliness(prefs.cleanliness || "Average");
        setSleepSchedule(prefs.sleepSchedule || "Flexible");
        setNoiseLevel(prefs.noiseLevel || "Flexible");
      }

      setLoading(false);
    };
    loadProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveStatus("");

    const res = await updateStudentProfile({
      firstName,
      lastName,
      phone,
      university,
    });

    if (res.success) {
      setSaveStatus("Profile saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus(`Error: ${res.error}`);
    }
    setSaveLoading(false);
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrefLoading(true);
    setPrefStatus("");

    const parsedBudget = budgetLimit ? parseFloat(budgetLimit) : 0;
    const res = await saveStudentPreferences({
      openToRoommates,
      budgetLimit: parsedBudget,
      gender,
      department,
      level,
      cleanliness,
      sleepSchedule,
      noiseLevel,
    });

    if (res.success) {
      setPrefStatus("Preferences updated successfully!");
      setTimeout(() => setPrefStatus(""), 3000);
    } else {
      setPrefStatus(`Error: ${res.error}`);
    }
    setPrefLoading(false);
  };

  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "--";

  return (
    <>
      <Navbar />

      <main className="student-profile-layout">
        {loading ? (
          <div className="student-profile-loader">
            <i className="fas fa-spinner fa-spin"></i> Loading profile...
          </div>
        ) : (
          <div className="profile-layout">
            {/* Header Card */}
            <div className="profile-header-card">
              <div className="profile-avatar-large">
                <span>{initials}</span>
              </div>
              <div className="profile-title">
                <h2>
                  <span>{firstName} {lastName}</span>
                </h2>
                <p><span>{email}</span></p>
                <span className="status-pill verified">
                  Student Account
                </span>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="profile-tabs">
              <button className={`tab-btn ${activeTab === "details-section" ? "active" : ""}`} onClick={() => setActiveTab("details-section")}>Personal Details</button>
              <button className={`tab-btn ${activeTab === "roommate-section" ? "active" : ""}`} onClick={() => setActiveTab("roommate-section")}>Roommate Preferences</button>
            </div>

            {/* personal details */}
            {activeTab === "details-section" && (
              <section id="details-section" className="tab-content active">
                <h3 className="h-header">Update Information</h3>
                <form onSubmit={handleUpdateProfile}>
                  <div className="form-grid">
                    <div className="input-group">
                      <label>First Name</label>
                      <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>Last Name</label>
                      <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>Phone Number</label>
                      <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="input-group">
                      <label>University / Campus</label>
                      <input type="text" placeholder="University / Campus" value={university} onChange={(e) => setUniversity(e.target.value)} required />
                    </div>
                  </div>

                  {saveStatus && (
                    <p className={`status-message-text ${saveStatus.startsWith("Error") ? "error" : "success"}`}>
                      {saveStatus}
                    </p>
                  )}

                  <button type="submit" className="primary-btn" disabled={saveLoading}>
                    {saveLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </section>
            )}

            {/* roommate preferences */}
            {activeTab === "roommate-section" && (
              <section id="roommate-section" className="tab-content active">
                <h3 className="h-header">Roommate & Budget Settings</h3>
                <p className="p-header">Manage your roommate search status and preferences.</p>

                <form onSubmit={handleSavePreferences}>
                  <div className="settings-group">
                    <div className="settings-item-checkbox">
                      <div className="settings-info">
                        <h4>Open to Roommate Matching</h4>
                        <p>Allow other students on Campus Tent to find you when looking for sharing roommates.</p>
                      </div>
                      <label className="checkbox-toggle">
                        <input 
                          type="checkbox" 
                          checked={openToRoommates} 
                          onChange={(e) => setOpenToRoommates(e.target.checked)} 
                        />
                        <span className="checkbox-toggle-slider"></span>
                      </label>
                    </div>

                    <div className="form-grid preferences-form-grid">
                      <div className="input-group font-bold">
                        <label>Maximum Yearly Rent Budget (₦)</label>
                        <input 
                          type="number" 
                          placeholder="Maximum budget" 
                          value={budgetLimit} 
                          onChange={(e) => setBudgetLimit(e.target.value)} 
                        />
                      </div>

                      <div className="input-group font-bold input-group-select">
                        <label>Your Gender</label>
                        <SearchableSelect
                          options={GENDER_OPTIONS}
                          value={gender}
                          onChange={(val) => setGender(val)}
                        />
                      </div>

                      <div className="input-group font-bold">
                        <label>Academic Department</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Computer Science, Accounting" 
                          value={department} 
                          onChange={(e) => setDepartment(e.target.value)} 
                        />
                      </div>

                      <div className="input-group font-bold input-group-select">
                        <label>Academic Level</label>
                        <SearchableSelect
                          options={LEVEL_OPTIONS}
                          value={level}
                          onChange={(val) => setLevel(val)}
                        />
                      </div>

                      <div className="input-group font-bold input-group-select">
                        <label>Cleanliness Habit</label>
                        <SearchableSelect
                          options={CLEANLINESS_OPTIONS}
                          value={cleanliness}
                          onChange={(val) => setCleanliness(val)}
                        />
                      </div>

                      <div className="input-group font-bold input-group-select">
                        <label>Sleep Schedule</label>
                        <SearchableSelect
                          options={SLEEP_OPTIONS}
                          value={sleepSchedule}
                          onChange={(val) => setSleepSchedule(val)}
                        />
                      </div>

                      <div className="input-group font-bold input-group-select">
                        <label>Study / Noise Preference</label>
                        <SearchableSelect
                          options={NOISE_OPTIONS}
                          value={noiseLevel}
                          onChange={(val) => setNoiseLevel(val)}
                        />
                      </div>
                    </div>
                  </div>

                  {prefStatus && (
                    <p className={`status-message-text ${prefStatus.startsWith("Error") ? "error" : "success"}`}>
                      {prefStatus}
                    </p>
                  )}

                  <button type="submit" className="primary-btn" disabled={prefLoading}>
                    {prefLoading ? "Saving Preferences..." : "Save Preferences"}
                  </button>
                </form>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
