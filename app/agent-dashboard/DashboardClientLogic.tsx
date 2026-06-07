"use client";
import { useEffect } from "react";
import Chart from "chart.js/auto";

export default function DashboardClientLogic({ isAnalytics = false, isSettings = false }) {
    useEffect(() => {
        // --- 1. Dark Mode Logic ---
        const themeToggleBtn = document.getElementById("theme-toggle-btn");
        const themeIcon = document.getElementById("theme-icon");

        function applyTheme(isDark: boolean) {
            if (isDark) {
                document.body.classList.add("dark-mode");
                if (themeIcon) {
                    themeIcon.classList.remove("fa-moon");
                    themeIcon.classList.add("fa-sun");
                    themeIcon.style.color = "#f1c40f"; 
                }
            } else {
                document.body.classList.remove("dark-mode");
                if (themeIcon) {
                    themeIcon.classList.remove("fa-sun");
                    themeIcon.classList.add("fa-moon");
                    themeIcon.style.color = ""; 
                }
            }
        }

        const savedTheme = localStorage.getItem("campus_stay_theme");
        if (savedTheme === "dark") {
            applyTheme(true);
        }

        const handleThemeToggle = () => {
            const isCurrentlyDark = document.body.classList.contains("dark-mode");
            if (isCurrentlyDark) {
                applyTheme(false);
                localStorage.setItem("campus_stay_theme", "light");
            } else {
                applyTheme(true);
                localStorage.setItem("campus_stay_theme", "dark");
            }
            if(isAnalytics) window.location.reload(); // Quick hack to re-render charts in new theme
        };

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener("click", handleThemeToggle);
        }

        // --- 2. Sidebar Logic ---
        const sidebar = document.getElementById("sidebar");
        const menuToggle = document.getElementById("menu-toggle");
        const closeSidebarBtn = document.getElementById("close-sidebar");

        if (menuToggle && sidebar) {
            menuToggle.addEventListener("click", () => sidebar.classList.add("active"));
        }
        if (closeSidebarBtn && sidebar) {
            closeSidebarBtn.addEventListener("click", () => sidebar.classList.remove("active"));
        }

        // --- 3. Profile Dropdown Logic ---
        const profileBtn = document.getElementById("profile-dropdown-btn");
        const dropdownMenu = document.getElementById("dropdown-menu");

        const toggleDropdown = (e: Event) => {
            dropdownMenu?.classList.toggle("active");
            e.stopPropagation();
        };

        const closeDropdown = (e: Event) => {
            if (profileBtn && !profileBtn.contains(e.target as Node)) {
                dropdownMenu?.classList.remove("active");
            }
        };

        if (profileBtn) {
            profileBtn.addEventListener("click", toggleDropdown);
            document.addEventListener("click", closeDropdown);
        }

        // --- 4. Settings Tabs Logic ---
        if (isSettings) {
            const tabBtns = document.querySelectorAll(".tab-btn");
            const tabContents = document.querySelectorAll(".tab-content");

            tabBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    tabBtns.forEach(b => b.classList.remove("active"));
                    tabContents.forEach(c => (c as HTMLElement).style.display = "none");
                    
                    btn.classList.add("active");
                    const targetId = btn.getAttribute("data-target");
                    if (targetId) {
                        const targetContent = document.getElementById(targetId);
                        if(targetContent) {
                            targetContent.style.display = "block";
                            // Ensure the 'active' class is also added for CSS animations if any
                            tabContents.forEach(c => c.classList.remove("active"));
                            targetContent.classList.add("active");
                        }
                    }
                });
            });

            // Settings Save Button Simulation
            const saveBtn = document.getElementById("save-preferences-btn");
            if (saveBtn) {
                saveBtn.addEventListener("click", () => {
                    const origText = saveBtn.innerText;
                    saveBtn.innerText = "Saving...";
                    (saveBtn as HTMLButtonElement).disabled = true;
                    setTimeout(() => {
                        saveBtn.innerText = "Saved!";
                        saveBtn.style.backgroundColor = "#28a745";
                        saveBtn.style.color = "#fff";
                        setTimeout(() => {
                            saveBtn.innerText = origText;
                            saveBtn.style.backgroundColor = "";
                            saveBtn.style.color = "";
                            (saveBtn as HTMLButtonElement).disabled = false;
                        }, 2000);
                    }, 1000);
                });
            }
        }

        // --- 5. Analytics Charts Logic ---
        if (isAnalytics) {
            const isDarkMode = document.body.classList.contains("dark-mode");
            const textColor = isDarkMode ? "#a0a0a0" : "#666";
            const gridColor = isDarkMode ? "#333" : "#eaeaea";
            Chart.defaults.color = textColor;
            Chart.defaults.font.family = "'Open Sans', sans-serif";

            const ctx1 = document.getElementById('engagementChart') as HTMLCanvasElement;
            const ctx2 = document.getElementById('propertyViewsChart') as HTMLCanvasElement;
            const ctx3 = document.getElementById('demographicsChart') as HTMLCanvasElement;

            let charts: Chart[] = [];

            if (ctx1) {
                charts.push(new Chart(ctx1.getContext('2d')!, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Profile Views',
                            data: [12, 19, 15, 25, 22, 30, 28],
                            borderColor: '#28a745',
                            backgroundColor: 'rgba(40, 167, 69, 0.1)',
                            tension: 0.4,
                            fill: true
                        }, {
                            label: 'Inquiries',
                            data: [5, 8, 4, 12, 9, 15, 10],
                            borderColor: '#f39c12',
                            backgroundColor: 'transparent',
                            tension: 0.4,
                            borderDash: [5, 5]
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: gridColor } }, x: { grid: { color: gridColor } } } }
                }));
            }

            if (ctx2) {
                charts.push(new Chart(ctx2.getContext('2d')!, {
                    type: 'bar',
                    data: {
                        labels: ['Property A', 'Property B', 'Property C'],
                        datasets: [{
                            label: 'Total Views',
                            data: [120, 85, 40],
                            backgroundColor: '#02351c',
                            borderRadius: 4
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, scales: { y: { grid: { color: gridColor } }, x: { grid: { display: false } } } }
                }));
            }

            if (ctx3) {
                charts.push(new Chart(ctx3.getContext('2d')!, {
                    type: 'doughnut',
                    data: {
                        labels: ['FUPRE', 'PTI', 'Novena', 'Other'],
                        datasets: [{
                            data: [45, 30, 15, 10],
                            backgroundColor: ['#02351c', '#d35400', '#28a745', '#f39c12'],
                            borderWidth: isDarkMode ? 2 : 0,
                            borderColor: isDarkMode ? '#1e1e1e' : '#fff'
                        }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, cutout: '70%' }
                }));
            }

            return () => {
                charts.forEach(c => c.destroy());
                if (themeToggleBtn) themeToggleBtn.removeEventListener("click", handleThemeToggle);
                document.removeEventListener("click", closeDropdown);
            };
        }

        return () => {
            if (themeToggleBtn) themeToggleBtn.removeEventListener("click", handleThemeToggle);
            document.removeEventListener("click", closeDropdown);
        };
    }, [isAnalytics, isSettings]);

    return null; // This component strictly runs side effects
}
