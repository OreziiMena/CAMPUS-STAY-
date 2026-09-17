"use client";
import React from "react";
import Link from "next/link";
import "./styles.css";

export default function Rolepick() {
    return (
        <>
            <nav className="rolepick-nav sticky-top">
                <Link href="/" className="rolepick-brand" aria-label="Campus Tent Home">
                    <img src="/Assets/CAMPUS STAY LOGO.png" alt="Campus Tent Logo" className="rolepick-logo" />
                    <h2 className="rolepick-logo-text">Campus Tent</h2>
                </Link>
                <div className="rolepick-nav-actions">
                    <Link href="/" className="rolepick-back-btn" aria-label="Back to Home">
                        <i className="fas fa-arrow-left" aria-hidden="true"></i>
                        <span className="rolepick-btn-text-full">Back to Home</span>
                        <span className="rolepick-btn-text-short">Home</span>
                    </Link>
                </div>
            </nav>

            <section className="role-selection-section">
                <div className="role-container">

                    <h2 className="role-header">Welcome To Campus Tent </h2>
                    <p className="role-subheader">Choose Your Role To Get Started With Your Journey</p>

                    <div className="role-cards-wrapper">

                        <Link href="/auth/student-signup" className="role-card">
                            <div className="role-icon-wrapper student-icon">
                                <i className="fas fa-user-graduate"></i>
                            </div>
                            <h3>I am a Student</h3>
                            <p>Find verified apartments, connect with roommates, and secure your perfect off-campus home.</p>
                            <span className="role-btn">Join as Student <i className="fas fa-arrow-right"></i></span>
                        </Link>

                        <Link href="/auth/agent-signup" className="role-card">
                            <div className="role-icon-wrapper agent-icon">
                                <i className="fas fa-home"></i>
                            </div>
                            <h3>I am an Agent / Landlord</h3>
                            <p>List your properties, reach thousands of students, and manage your apartment inquiries easily.</p>
                            <span className="role-btn">Join as Agent <i className="fas fa-arrow-right"></i></span>
                        </Link>

                    </div>

                </div>
            </section>



        </>
    );
}
