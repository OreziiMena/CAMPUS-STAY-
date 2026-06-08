"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerStudent, checkUsernameAvailable } from "@/app/actions/auth";
import "../signup.css";

export default function StudentSignup() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "taken" | "available">("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = async (val: string) => {
    setUsername(val);
    if (!val) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    try {
      const isAvailable = await checkUsernameAvailable(val);
      if (isAvailable) {
        setUsernameStatus("available");
      } else {
        setUsernameStatus("taken");
      }
    } catch {
      setUsernameStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agreeTerms) {
      setError("You must agree to the Terms and Conditions to create an account.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (usernameStatus === "taken") {
      setError("Please choose a different username.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerStudent({
        fullname,
        email,
        phone,
        university,
        username,
        password,
      });

      setIsLoading(false);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/explore");
        }, 1500);
      } else {
        setError(res.error || "Failed to create account.");
      }
    } catch {
      setIsLoading(false);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <>
      <div className="auth-page">
        <Link href="/auth/rolepick" className="back-link">
          <i className="fas fa-arrow-left"></i> Go Back
        </Link>

        <section className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Sign Up for Campus Stay</h2>
              <p>Join Campus Stay to find your perfect off-campus home.</p>
            </div>

            {success ? (
              <div className="auth-success-container">
                <i className="fas fa-check-circle auth-success-icon"></i>
                <h3 className="auth-success-title">Registration Successful!</h3>
                <p className="auth-success-text">Redirecting you to properties explore page...</p>
              </div>
            ) : (
              <form id="student-signup-form" className="auth-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    placeholder="E.g. Olise Precious Chibuzor"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <small className="helper-text">
                    <i className="fas fa-info-circle"></i> Please use the exact name you enrolled in school with for easy verification.
                  </small>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="olisepreciousc@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="08012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="university">University</label>
                  <div className="select-wrapper">
                    <select
                      id="university"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      disabled={isLoading}
                      required
                    >
                      <option value="" disabled>Select your institution...</option>
                      <option value="FUPRE">Federal University of Petroleum Resources (FUPRE)</option>
                      <option value="DSUST">Delta State University of Science and Technology, Ozoro (DSUST)</option>
                      <option value="DOU">Dennis Osadebay University, Asaba (DOU)</option>
                      <option value="UNIDEL">University of Delta, Agbor (UNIDEL)</option>
                      <option value="WDU">Western Delta University, Oghara (WDU)</option>
                      <option value="NOVENA">Novena University, Ogume-Amai</option>
                      <option value="PTI">Petroleum Training Institute, Effurun (PTI)</option>
                      <option value="FEPO">Federal Polytechnic, Orogun</option>
                      <option value="DSPG">Delta State Polytechnic, Ogwashi-Uku (DSPG)</option>
                      <option value="DESPO">Delta State Polytechnic, Otefe-Oghara (DESPO)</option>
                      <option value="COE_WARRI">College of Education, Warri</option>
                      <option value="COE_MOSOGAR">Delta State College of Physical Education, Mosogar</option>
                    </select>
                    <i className="fas fa-chevron-down select-icon"></i>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <div className="username-wrapper">
                    <span className="at-prefix">@</span>
                    <input
                      type="text"
                      id="username"
                      placeholder="Enter a Preferred Username"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {usernameStatus === "checking" && <small className="helper-text">Checking availability...</small>}
                  {usernameStatus === "taken" && <small className="error-text validation-error" id="username-error">This username is already taken.</small>}
                  {usernameStatus === "available" && <small className="success-text validation-success" id="username-success">This username is available.</small>}
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <i 
                      className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`} 
                      id="toggle-password-icon" 
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                  <small className="helper-text" id="password-reqs">
                    <i className="fas fa-info-circle"></i> Must contain at least 8 characters.
                  </small>
                </div>

                <div className="input-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <i 
                      className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`} 
                      id="toggle-confirm-password-icon" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ></i>
                  </div>
                  {password && confirmPassword && password !== confirmPassword && (
                    <small className="error-text validation-error" id="password-error">Passwords do not match.</small>
                  )}
                </div>

                <div className="checkbox-group checkbox-group-signup">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="terms-checkbox" className="terms-label">
                    I have read and agree to the <Link href="/terms" target="_blank" className="auth-link">Terms and Conditions</Link> and <Link href="/privacy" target="_blank" className="auth-link">Privacy Policy</Link>.
                  </label>
                </div>

                {error && (
                  <small className="error-text terms-error-msg" id="terms-error">
                    {error}
                  </small>
                )}

                <button type="submit" className="auth-submit-btn auth-submit-btn-signup" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="auth-footer-text">
                  Already have an account? <Link href="/auth/login">Log in</Link>
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
