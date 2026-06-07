"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./styles.css";
import "../signup.css";

export default function Rolepick() {
    return (
        <>


            <nav className="sticky-top">
                <div className="brand">
                    <img src="/Assets/CAMPUS STAY LOGO.png" alt="logo" className="logo" /><h2 className="logo-text">Campus Stay</h2>
                </div>
                <div className="btn-btn">
                    <Link href="/"><button className="start-btn">Back to Home</button></Link>
                </div>
            </nav>

            <section className="role-selection-section">
                <div className="role-container">

                    <h2 className="role-header">Welcome To Campus Stay </h2>
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
