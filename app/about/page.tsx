"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./styles.css";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <h1>Connecting Students to <span>Comfort</span></h1>
        <p>
          We bridge the gap between tertiary students and off-campus housing. Finding secure, close-to-campus accommodation has never been this simple, transparent, and quick.
        </p>
      </section>

      {/* Story & Pillars Section */}
      <section className="about-section">
        <div className="story-container">
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Campus Stay was born out of a common student struggle: the exhausting, stressful process of searching for off-campus hostels. We realized that students spent days walking around university towns, dealing with untrustworthy middle-men, and paying hidden fees.
            </p>
            <p>
              We envisioned a central platform where properties are verified, walking distances are computed honestly, and students can chat directly with vetted landlords without agents standing in the way.
            </p>
          </div>
          <div className="story-image-placeholder">
            <i className="fas fa-university"></i>
            <h4>Founded on Campuses</h4>
            <p>Built by students, for students, to bring convenience and transparency to off-campus stay search.</p>
          </div>
        </div>

        <div className="pillars-heading">
          <h2>Our Core Pillars</h2>
          <p>The values that guide how we help thousands of students find their perfect home.</p>
        </div>

        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-shield-alt"></i></div>
            <h3>Vetted Listings</h3>
            <p>We require NIN verification and document checks from all agents to eliminate accommodation scams.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-walking"></i></div>
            <h3>Proximity Focus</h3>
            <p>We calculate accurate walk times so you can choose a room that fits your lecture schedules.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon"><i className="fas fa-comments"></i></div>
            <h3>Direct Chat</h3>
            <p>Inquire and chat directly with property hosts on WhatsApp immediately without middleman fees.</p>
          </div>
        </div>

        {/* Stats Showcase Banner */}
        <div className="stats-banner">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Active Listings</p>
          </div>
          <div className="stat-item">
            <h3>300+</h3>
            <p>Students Housed</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Vetted Landlords</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
