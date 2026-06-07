"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../footer.css";

export default function Terms() {
  return (
    <>
      

    <nav className="static-nav">
        <h2 className="logo-text">Campus Stay</h2>
        <a href="/" className="back-link">Back to Home</a>
    </nav>

    <header className="static-header">
        <h1>Terms of Service</h1>
        <p>Last updated: April 2026</p>
    </header>

    <main className="static-content">
        
        <section className="content-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Campus Stay. By accessing our platform, you agree to these terms. We serve the university community by connecting students with verified landlords and agents.</p>
        </section>

        <section className="content-section">
            <h2>2. User Accounts</h2>
            <p>Whether you are registering as a Student or an Agent, you are responsible for maintaining the security of your account and password. Campus Stay is not liable for any loss or damage from your failure to comply with this security obligation.</p>
        </section>

        <section className="content-section">
            <h2>3. Property Listings & Accuracy</h2>
            <p>Agents must ensure all uploaded properties are accurate and currently available. Misrepresentation of properties (e.g., uploading fake images or incorrect pricing) will result in immediate account suspension.</p>
        </section>

        <section className="content-section">
            <h2>4. The Information We Collect</h2>
            <p>To provide a secure, reliable, and trustworthy marketplace for the university community, Campus Stay collects specific personal and verification data when you register and use our platform.</p>

            <h3>A. Basic Account Information</h3>
            <p>When you create an account, whether as a Student or an Agent, we collect standard profile information, including:</p>
            <ul>
                <li>Your full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Account password</li>
            </ul>

            <h3>B. Identity & Verification Data</h3>
            <p>Because Campus Stay facilitates real-world housing transactions, the safety of our community is our highest priority. To prevent fraud and ensure that users are who they claim to be, we require specific verification documents based on your account type:</p>
            <ul>
                <li><strong>For Students:</strong> To maintain Campus Stay as a dedicated student community, you may be required to provide proof of your active student status. This may include uploading a valid University ID card, an official admission letter, or relevant university portal documentation.</li>
                <li><strong>For Agents & Landlords:</strong> To protect our students and verify the legitimacy of property managers on our platform, you will be required to undergo an identity verification process. This will require submitting a valid, government-issued identification document, which may specifically include your <strong>National Identification Number (NIN)</strong> or other approved statutory identification.</li>
            </ul>

            <h3>C. Platform Activity & Communication Data</h3>
            <p>We collect data on how you interact with the platform to improve your experience. This includes:</p>
            <ul>
                <li>Properties you view, save, or inquire about.</li>
                <li>Messages, inquiries, and communications sent through the Campus Stay platform between Students and Agents.</li>
            </ul>

            <h3>D. Why We Collect This Information</h3>
            <p>Your verification documents (such as your NIN or Student ID) are strictly used for security, compliance, and identity authentication. We collect this data to:</p>
            <ul>
                <li>Verify that you are a legitimate student or a genuine property agent.</li>
                <li>Prevent fraudulent listings, scams, and unauthorized access.</li>
                <li>Resolve disputes and enforce our platform's safety guidelines.</li>
            </ul>
        </section>

        <section className="content-section">
            <h2>5. How We Use Your Information</h2>
            <p>Campus Stay uses the data we collect to operate, improve, and protect our platform. Specifically, your information allows us to:</p>
            <ul>
                <li><strong>Facilitate Connections:</strong> Enable students to seamlessly browse, save, and inquire about properties, and allow agents to manage and respond to these inquiries.</li>
                <li><strong>Maintain Platform Safety:</strong> Authenticate accounts, verify NINs and Student IDs, and actively monitor for fraudulent or suspicious activity.</li>
                <li><strong>Communicate with You:</strong> Send essential service updates, account notifications, password reset links, and responses to your support inquiries.</li>
                <li><strong>Improve User Experience:</strong> Analyze how our platform is used to fix bugs, design better features, and optimize the overall Campus Stay experience.</li>
            </ul>
        </section>

        <section className="content-section">
            <h2>6. Sharing Your Information</h2>
            <p>We do not sell, rent, or trade your personal information to third parties. We only share your information in the following limited circumstances:</p>
            <ul>
                <li><strong>Between Students and Agents:</strong> When a student makes an inquiry on a property, we share necessary details (such as the student's name, university, and message) with the verified agent to facilitate communication.</li>
                <li><strong>Service Providers:</strong> We may share data with trusted third-party services that help us operate our platform (e.g., secure cloud hosting providers, database management, and email delivery services). These providers are legally obligated to protect your data.</li>
                <li><strong>Legal and Safety Requirements:</strong> We may disclose your information if required by Nigerian law, legal processes, or to protect the rights, property, and safety of Campus Stay, our users, or the public.</li>
            </ul>
        </section>

        <section className="content-section">
            <h2>7. Security</h2>
            <p>We take the security of your personal information and verification documents seriously. Campus Stay implements industry-standard technical and organizational measures to protect your data.</p>
            
            <h3>A. Data Protection Measures</h3>
            <ul>
                <li><strong>Encryption:</strong> Sensitive data, including passwords and verification documents like your NIN or Student ID, are encrypted and stored securely within our database infrastructure.</li>
                <li><strong>Access Control:</strong> Strict access controls are in place to ensure that only authorized system administrators can access verification documents solely for the purpose of account approval.</li>
            </ul>

            <h3>B. Your Responsibilities</h3>
            <p>While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. You are responsible for keeping your password confidential and for ensuring you log out of shared devices after using the Campus Stay platform.</p>
        </section>

    </main>

    <footer className="main-footer">
    <div className="footer-grid">
        <div className="footer-brand">
            <img src="/Assets/CAMPUS STAY LOGO.png" alt="logo" className="footer-logo" />
            <p className="brand-tagline">Connecting Students with <br />Trusted Off-Campus Housing.</p>
        </div>

        <div className="footer-links">
            <h4>PLATFORM</h4>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About Us</a></li>
                <li><a href="/">Explore Properties</a></li>
                <li><a href="/">Find a Roommate</a></li>
                <li><a href="#">How it Works</a></li>
            </ul>
        </div>

        <div className="footer-links">
            <h4>RESOURCES</h4>
            <ul>
                <li><a href="#">Help Center / Support</a></li>
                <li><a href="#">Tenant Guide</a></li>
                <li><a href="#">Landlord Hub</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
            </ul>
        </div>

        <div className="footer-contact">
            <h4>CONNECT</h4>
            <ul>
                <li><a href="mailto:support@campusstay.com"><i className="fa-solid fa-envelope"></i> support@campusstay.com</a></li>
                <li><a href="https://wa.me/2349161863877?text=Hi%20Campus%20Stay%20Support,%20I%20need%20help" target="_blank"><i className="fa-brands fa-whatsapp"></i> Chat with Us</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
            </ul>
        </div>
    </div>

    <div className="footer-bottom">
        <p>© 2024 Campus Stay. All rights reserved.</p>
    </div>
    
</footer>


    </>
  );
}
