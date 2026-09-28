const fs = require('fs');

const frames = JSON.parse(fs.readFileSync('frames.json', 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Mohammad Ismaeel (Andro) — Web Designer & Digital Solutions Specialist</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      --bg-dark: #07080a;
      --text-white: #ffffff;
      --text-muted: #9ea4b0;
      --orange-accent: #ff4811;
      --orange-tag: #ff5424;
      --green-online: #34d399;
      --font-main: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    html, body {
      width: 100%;
      min-height: 100%;
      background-color: var(--bg-dark);
      color: var(--text-white);
      font-family: var(--font-main);
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Fixed Canvas Animation Background */
    #scroll-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: block;
      z-index: 0;
      pointer-events: none;
    }

    /* Clean Subtle Depth: completely clear in center so the face is 100% visible */
    .canvas-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1;
      pointer-events: none;
      background: 
        radial-gradient(ellipse at 50% 40%, rgba(7, 8, 10, 0.0) 0%, rgba(7, 8, 10, 0.0) 45%, rgba(7, 8, 10, 0.45) 80%, rgba(7, 8, 10, 0.85) 100%),
        linear-gradient(to bottom, rgba(7, 8, 10, 0.25) 0%, rgba(7, 8, 10, 0.0) 25%, rgba(7, 8, 10, 0.0) 60%, rgba(7, 8, 10, 0.7) 90%, #07080a 100%);
    }

    /* Page Container */
    .page-wrapper {
      position: relative;
      z-index: 10;
      width: 100%;
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 32px;
    }

    /* =========================================================
       SPECULAR LIQUID GLASS STYLES (Based on user reference)
       ========================================================= */
    .glass-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.3);
      border-left: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 12px 28px rgba(0, 0, 0, 0.25);
    }

    .glass-pill {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 50%, rgba(255, 255, 255, 0.03) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-top: 1.2px solid rgba(255, 255, 255, 0.35);
      border-left: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 9999px;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 8px 20px rgba(0, 0, 0, 0.2);
    }

    /* Header / Navbar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 26px 0 20px;
      width: 100%;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #ffffff;
      text-decoration: none;
      cursor: pointer;
    }

    .brand-moniker {
      background: rgba(255, 72, 17, 0.18);
      border: 1px solid rgba(255, 72, 17, 0.4);
      color: var(--orange-tag);
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    /* Nav Links: Clean floating navigation links without background container */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 6px;
      list-style: none;
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border: none;
      padding: 0;
      box-shadow: none;
    }

    .nav-links a {
      color: rgba(255, 255, 255, 0.88);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 9999px;
      transition: all 0.25s ease;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85);
    }

    .nav-links a:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }

    /* Pill Buttons */
    .btn-nav {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background-color: #ffffff;
      color: #0b0c10;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 700;
      padding: 6px 6px 6px 18px;
      border-radius: 9999px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
    }

    .btn-nav:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(255, 255, 255, 0.25);
    }

    .btn-nav .icon-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: var(--orange-accent);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-nav:hover .icon-circle {
      transform: rotate(45deg);
    }

    .btn-orange {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background-color: var(--orange-accent);
      color: #ffffff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 8px 8px 24px;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(255, 72, 17, 0.38);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
    }

    .btn-orange:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(255, 72, 17, 0.55);
    }

    .btn-orange .icon-circle-white {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #ffffff;
      color: var(--orange-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-orange:hover .icon-circle-white {
      transform: rotate(45deg);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-top: 1.2px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 24px;
      border-radius: 9999px;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.22);
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
    }

    /* Hero Section */
    .hero-card {
      position: relative;
      min-height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px 0 40px;
    }

    .hero-meta-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    /* Glass Status & Location Badges (Like reference photo) */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(34, 197, 94, 0.05) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-top: 1.2px solid rgba(255, 255, 255, 0.35);
      border-left: 1px solid rgba(255, 255, 255, 0.22);
      color: var(--green-online);
      font-size: 12px;
      font-weight: 700;
      padding: 7px 18px;
      border-radius: 9999px;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--green-online);
      box-shadow: 0 0 8px var(--green-online);
    }

    .location-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border: none;
      color: rgba(255, 255, 255, 0.92);
      font-size: 13px;
      font-weight: 600;
      padding: 4px 0;
      box-shadow: none;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.85);
    }

    /* Hero Main: Open center corridor so the face is clearly framed and visible */
    .hero-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: clamp(40px, 14vw, 320px);
      margin: 15px 0 35px;
      position: relative;
    }

    /* Hero Left: Pure floating text without background container */
    .hero-left {
      max-width: 460px;
      flex: 1 1 430px;
      z-index: 2;
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      border: none;
      border-radius: 0;
      padding: 6px 0;
      box-shadow: none;
    }

    .hero-left .hero-eyebrow {
      font-size: 15px;
      font-weight: 700;
      color: var(--orange-tag);
      margin-bottom: 12px;
      letter-spacing: -0.01em;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
    }

    .hero-left .hero-title {
      font-size: clamp(28px, 3.2vw, 46px);
      font-weight: 900;
      line-height: 1.14;
      letter-spacing: -0.035em;
      color: #ffffff;
      text-shadow: 0 4px 24px rgba(0, 0, 0, 0.95), 0 2px 8px rgba(0, 0, 0, 0.9);
      margin-bottom: 14px;
      hyphens: none;
      -webkit-hyphens: none;
    }

    .no-break {
      display: inline-block;
      white-space: nowrap;
    }

    .hero-left .hero-role {
      font-size: 15px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      letter-spacing: -0.01em;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
    }

    /* Hero Right: Far right docked glass styled container */
    .hero-right {
      max-width: 400px;
      flex: 1 1 370px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      text-align: right;
      margin-left: auto;
      z-index: 2;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.32);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 32px;
      padding: 30px 34px;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 12px 32px rgba(0, 0, 0, 0.22);
    }

    .hero-right .hero-subheadline {
      font-size: clamp(15px, 1.35vw, 17.5px);
      font-weight: 600;
      line-height: 1.55;
      letter-spacing: -0.015em;
      color: rgba(255, 255, 255, 0.94);
      margin-bottom: 22px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
      text-align: right;
    }

    .hero-cta-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    /* 4 Core Services Grid in Hero: Glass Styled Cards */
    .hero-services {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      padding-top: 36px;
    }

    .service-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      padding: 24px 22px;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.2),
        0 10px 24px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }

    .service-item:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 72, 17, 0.4);
    }

    .service-item .service-num {
      color: var(--orange-tag);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .service-item .service-title {
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.015em;
      line-height: 1.25;
    }

    .service-item .service-desc {
      font-size: 12.5px;
      line-height: 1.45;
      color: var(--text-muted);
    }

    /* Tech Stack & Toolkit: Large Glass Pill Dock (like reference photo) */
    .tech-strip {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.025) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.32);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 9999px;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      margin: 40px 0 90px;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 10px 24px rgba(0, 0, 0, 0.2);
    }

    .tech-label {
      font-size: 13px;
      line-height: 1.45;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.7);
      max-width: 150px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .tech-pills {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 10px;
    }

    .tech-pill {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-top: 1.2px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      padding: 7px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 4px 10px rgba(0, 0, 0, 0.15);
      transition: all 0.25s ease;
    }

    .tech-pill:hover {
      background: rgba(255, 72, 17, 0.2);
      border-color: rgba(255, 72, 17, 0.5);
      transform: translateY(-2px);
    }

    /* About Section */
    .about-section {
      padding: 20px 0 90px;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 0.9fr 1.1fr;
      gap: 60px;
      align-items: flex-start;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.32);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 36px;
      padding: 56px 50px;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 12px 32px rgba(0, 0, 0, 0.22);
    }

    .about-left .about-tag {
      color: var(--orange-tag);
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 14px;
      display: inline-block;
    }

    .about-left .about-headline {
      font-size: clamp(34px, 3.8vw, 50px);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 24px;
    }

    .about-tagline {
      font-size: 17px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.5;
      padding-left: 18px;
      border-left: 3px solid var(--orange-accent);
      margin-bottom: 30px;
    }

    .about-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .stat-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      padding: 22px;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.18);
    }

    .stat-card .stat-val {
      font-size: 32px;
      font-weight: 900;
      color: var(--orange-accent);
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }

    .stat-card .stat-lbl {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .about-right {
      display: flex;
      flex-direction: column;
      gap: 20px;
      font-size: 15.5px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.85);
    }

    .about-right strong {
      color: #ffffff;
    }

    .lang-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 14px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }

    .lang-badge {
      font-size: 12.5px;
      font-weight: 700;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1px solid rgba(255, 255, 255, 0.25);
      padding: 6px 16px;
      border-radius: 999px;
      color: #ffffff;
    }

    /* Projects Showcase Section */
    .showcase-section {
      padding: 40px 0 100px;
    }

    .showcase-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 40px;
      margin-bottom: 48px;
    }

    .showcase-header-left .showcase-tag {
      color: var(--orange-tag);
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 12px;
      display: inline-block;
    }

    .showcase-header-left .showcase-title {
      font-size: clamp(34px, 4vw, 54px);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: #ffffff;
    }

    .showcase-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      width: 100%;
    }

    .project-item-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.32);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 28px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 12px 28px rgba(0, 0, 0, 0.25);
    }

    .project-item-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 24px 50px rgba(0, 0, 0, 0.6);
      border-color: rgba(255, 72, 17, 0.45);
    }

    .project-item-card .img-wrap {
      width: 100%;
      aspect-ratio: 16 / 10;
      position: relative;
      overflow: hidden;
      background: #111318;
    }

    .project-item-card .img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .project-item-card:hover .img-wrap img {
      transform: scale(1.05);
    }

    .project-card-body {
      padding: 26px 28px 28px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
    }

    .project-cat {
      color: var(--orange-tag);
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 8px;
    }

    .project-item-title {
      font-size: 21px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
    }

    .project-item-summary {
      font-size: 14px;
      line-height: 1.55;
      color: var(--text-muted);
      margin-bottom: 20px;
    }

    .project-item-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .item-features {
      font-size: 11.5px;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 600;
    }

    .link-inquire {
      color: #ffffff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: color 0.2s;
    }

    .link-inquire:hover {
      color: var(--orange-accent);
    }

    /* Why Work With Me (Value Proposition) */
    .value-section {
      padding: 20px 0 100px;
    }

    .value-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 50px;
    }

    .value-tag {
      color: var(--orange-tag);
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 12px;
      display: inline-block;
    }

    .value-title {
      font-size: clamp(32px, 3.8vw, 48px);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #ffffff;
    }

    .value-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .value-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.02) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.32);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 28px;
      padding: 36px 40px;
      display: flex;
      gap: 22px;
      align-items: flex-start;
      transition: transform 0.3s ease, border-color 0.3s ease;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 12px 28px rgba(0, 0, 0, 0.22);
    }

    .value-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 72, 17, 0.4);
    }

    .value-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(255, 72, 17, 0.25) 0%, rgba(255, 255, 255, 0.08) 100%);
      border: 1px solid rgba(255, 72, 17, 0.4);
      color: var(--orange-tag);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3);
    }

    .value-text h3 {
      font-size: 19px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .value-text p {
      font-size: 14.5px;
      line-height: 1.6;
      color: var(--text-muted);
    }

    /* Contact Section */
    .contact-section {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.008) 50%, rgba(255, 255, 255, 0.025) 100%);
      backdrop-filter: blur(8px) saturate(120%);
      -webkit-backdrop-filter: blur(8px) saturate(120%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.32);
      border-left: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 36px;
      padding: 60px;
      margin: 20px 0 80px;
      box-shadow: 
        inset 0 1px 1px rgba(255, 255, 255, 0.22),
        0 16px 36px rgba(0, 0, 0, 0.25);
    }

    .contact-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      align-items: center;
    }

    .contact-left .contact-tag {
      color: var(--orange-tag);
      font-size: 14px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 12px;
      display: inline-block;
    }

    .contact-left h2 {
      font-size: clamp(34px, 4vw, 52px);
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 16px;
    }

    .contact-left p {
      font-size: 16px;
      line-height: 1.6;
      color: var(--text-muted);
      max-width: 440px;
    }

    .contact-right {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .contact-card-link {
      display: flex;
      align-items: center;
      gap: 18px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      padding: 18px 24px;
      text-decoration: none;
      color: #ffffff;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.18);
      transition: all 0.25s ease;
    }

    .contact-card-link:hover {
      background: rgba(255, 72, 17, 0.18);
      border-color: rgba(255, 72, 17, 0.5);
      transform: translateX(4px);
    }

    .contact-card-link .c-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--orange-accent);
      flex-shrink: 0;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3);
    }

    .contact-card-link .c-meta span {
      display: block;
      font-size: 11.5px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .contact-card-link .c-meta strong {
      display: block;
      font-size: 16px;
      font-weight: 700;
      margin-top: 2px;
    }

    /* Footer */
    .site-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding: 40px 0 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13.5px;
      color: var(--text-muted);
    }

    .site-footer a {
      color: var(--text-white);
      text-decoration: none;
      font-weight: 600;
    }

    /* Mobile Menu Toggle Button */
    .mobile-menu-btn {
      display: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-top: 1.2px solid rgba(255, 255, 255, 0.32);
      color: #ffffff;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .mobile-menu-btn:active {
      transform: scale(0.95);
      background: rgba(255, 72, 17, 0.2);
      border-color: rgba(255, 72, 17, 0.4);
    }

    /* Mobile Navigation Dropdown */
    .mobile-nav-panel {
      display: none;
      position: absolute;
      top: 80px;
      left: 20px;
      right: 20px;
      z-index: 100;
      background: rgba(13, 15, 20, 0.94);
      backdrop-filter: blur(24px) saturate(140%);
      -webkit-backdrop-filter: blur(24px) saturate(140%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-top: 1.2px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      padding: 14px;
      flex-direction: column;
      gap: 4px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
    }
    .mobile-nav-panel.active {
      display: flex;
      animation: slideDownNav 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideDownNav {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .mobile-nav-link {
      color: rgba(255, 255, 255, 0.88);
      text-decoration: none;
      font-size: 15px;
      font-weight: 700;
      padding: 12px 18px;
      border-radius: 14px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mobile-nav-link:hover, .mobile-nav-link:active {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }
    .mobile-nav-link.highlight {
      background: rgba(255, 72, 17, 0.14);
      border: 1px solid rgba(255, 72, 17, 0.3);
      color: var(--orange-tag);
    }

    /* =========================================================
       TABLET & IPAD OPTIMIZATIONS (max-width: 1024px)
       ========================================================= */
    @media (max-width: 1024px) {
      .page-wrapper {
        padding: 0 28px;
      }
      .navbar {
        padding: 20px 0 16px;
      }
      .nav-links {
        gap: 2px;
      }
      .nav-links a {
        font-size: 13px;
        padding: 6px 10px;
      }
      .hero-card {
        min-height: auto;
        padding-top: clamp(160px, 22vh, 260px);
        padding-bottom: 36px;
      }
      .hero-main {
        flex-direction: column;
        align-items: stretch;
        gap: 32px;
        margin: 10px 0 28px;
      }
      .hero-left {
        max-width: 100%;
        text-align: left;
      }
      .hero-left .hero-title {
        font-size: clamp(30px, 4.4vw, 42px);
        line-height: 1.15;
      }
      .hero-right {
        max-width: 100%;
        text-align: left;
        align-items: flex-start;
        padding: 26px 28px;
        border-radius: 28px;
      }
      .hero-right .hero-subheadline {
        text-align: left;
        font-size: 15.5px;
      }
      .hero-cta-group {
        justify-content: flex-start;
      }
      .hero-services {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding-top: 26px;
      }
      .tech-strip {
        border-radius: 30px;
        flex-direction: column;
        align-items: flex-start;
        padding: 24px 26px;
        gap: 16px;
        margin: 32px 0 65px;
      }
      .tech-label {
        max-width: 100%;
        font-size: 12px;
      }
      .tech-pills {
        justify-content: flex-start;
      }
      .about-grid {
        grid-template-columns: 1fr;
        padding: 40px 32px;
        border-radius: 30px;
        gap: 32px;
      }
      .about-left .about-headline {
        font-size: clamp(28px, 4vw, 40px);
      }
      .showcase-header {
        align-items: flex-start;
        gap: 20px;
      }
      .showcase-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      .value-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      .contact-main {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .contact-section {
        padding: 40px 32px;
        border-radius: 30px;
      }
    }

    /* =========================================================
       SMARTPHONE & SMALL TABLET OPTIMIZATIONS (max-width: 768px)
       ========================================================= */
    @media (max-width: 768px) {
      .page-wrapper {
        padding: 0 20px;
      }
      .navbar {
        padding: 16px 0 12px;
        position: relative;
      }
      .brand-logo {
        font-size: 17px;
        gap: 8px;
      }
      .brand-moniker {
        font-size: 10px;
        padding: 2px 7px;
      }
      .nav-links {
        display: none;
      }
      .mobile-menu-btn {
        display: flex;
      }
      .nav-actions {
        gap: 10px;
      }
      .btn-nav {
        font-size: 12.5px;
        padding: 6px 6px 6px 14px;
        gap: 8px;
      }
      .btn-nav .icon-circle {
        width: 24px;
        height: 24px;
      }
      .hero-card {
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-top: clamp(330px, 50svh, 440px);
        padding-bottom: 24px;
      }
      .hero-meta-bar {
        gap: 8px;
        margin-bottom: 12px;
      }
      .status-badge {
        font-size: 11px;
        padding: 5px 12px;
      }
      .location-badge {
        font-size: 11.5px;
      }
      .hero-main {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        margin: 0 0 16px;
        background: linear-gradient(135deg, rgba(14, 16, 22, 0.72) 0%, rgba(8, 9, 13, 0.85) 100%);
        backdrop-filter: blur(14px) saturate(130%);
        -webkit-backdrop-filter: blur(14px) saturate(130%);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-top: 1.2px solid rgba(255, 255, 255, 0.3);
        border-radius: 24px;
        padding: 22px 20px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
      }
      .hero-left {
        padding: 0;
      }
      .hero-left .hero-eyebrow {
        font-size: 13px;
        margin-bottom: 6px;
      }
      .hero-left .hero-title {
        font-size: clamp(21px, 5.6vw, 26px);
        line-height: 1.22;
        letter-spacing: -0.025em;
        margin-bottom: 8px;
      }
      .hero-left .hero-title br {
        display: none;
      }
      .hero-left .hero-role {
        font-size: 12px;
        line-height: 1.4;
        color: rgba(255, 255, 255, 0.82);
      }
      .hero-right {
        padding: 0;
        background: transparent;
        border: none;
        box-shadow: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
      }
      .hero-right .hero-subheadline {
        font-size: 13.5px;
        line-height: 1.5;
        margin-bottom: 14px;
        text-align: left;
        color: rgba(255, 255, 255, 0.85);
      }
      .hero-cta-group {
        display: flex;
        flex-direction: row;
        gap: 10px;
        width: 100%;
        justify-content: flex-start;
      }
      .btn-orange {
        font-size: 12.5px;
        padding: 8px 8px 8px 16px;
        flex: 1 1 auto;
        justify-content: center;
      }
      .btn-orange .icon-circle-white {
        width: 26px;
        height: 26px;
      }
      .btn-secondary {
        font-size: 12.5px;
        padding: 9px 16px;
        flex: 1 1 auto;
        justify-content: center;
      }
      .hero-services {
        grid-template-columns: 1fr;
        gap: 12px;
        padding-top: 20px;
      }
      .service-item {
        padding: 16px 18px;
        border-radius: 18px;
      }
      .service-title {
        font-size: 15px;
      }
      .service-desc {
        font-size: 13px;
      }
      .tech-strip {
        padding: 18px 18px;
        border-radius: 22px;
        margin: 26px 0 50px;
        gap: 12px;
      }
      .tech-pill {
        font-size: 12px;
        padding: 6px 12px;
      }
      .about-section {
        padding: 10px 0 50px;
      }
      .about-grid {
        padding: 26px 20px;
        border-radius: 24px;
        gap: 24px;
      }
      .about-left .about-headline {
        font-size: clamp(24px, 6.2vw, 32px);
        margin-bottom: 14px;
      }
      .about-tagline {
        font-size: 14px;
        padding-left: 12px;
        margin-bottom: 18px;
      }
      .about-stats {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
      .stat-num {
        font-size: 24px;
      }
      .stat-label {
        font-size: 10px;
      }
      .showcase-section {
        padding: 10px 0 50px;
      }
      .showcase-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        margin-bottom: 22px;
      }
      .showcase-header-left .showcase-title {
        font-size: clamp(25px, 6.2vw, 34px);
      }
      .showcase-grid {
        grid-template-columns: 1fr;
        gap: 18px;
      }
      .project-card-body {
        padding: 20px 18px 22px;
      }
      .value-section {
        padding: 10px 0 50px;
      }
      .value-header {
        margin-bottom: 26px;
      }
      .value-title {
        font-size: clamp(25px, 6.2vw, 34px);
      }
      .value-grid {
        grid-template-columns: 1fr;
        gap: 14px;
      }
      .value-card {
        padding: 20px 18px;
        border-radius: 20px;
        gap: 14px;
      }
      .value-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
      }
      .value-text h3 {
        font-size: 16px;
      }
      .value-text p {
        font-size: 13px;
      }
      .contact-section {
        padding: 26px 20px;
        border-radius: 24px;
        margin: 10px 0 45px;
      }
      .contact-left h2 {
        font-size: clamp(25px, 6.5vw, 34px);
      }
      .contact-card-link {
        padding: 13px 16px;
        border-radius: 16px;
        gap: 12px;
      }
      .contact-card-link .c-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
      }
      .site-footer {
        flex-direction: column;
        gap: 14px;
        text-align: center;
        padding: 28px 0 36px;
      }
    }

    /* =========================================================
       COMPACT SMARTPHONES (max-width: 480px)
       ========================================================= */
    @media (max-width: 480px) {
      .page-wrapper {
        padding: 0 16px;
      }
      .brand-logo {
        font-size: 15px;
      }
      .brand-moniker {
        font-size: 9.5px;
        padding: 2px 6px;
      }
      .btn-nav span:first-child {
        display: none;
      }
      .btn-nav::before {
        content: 'Start';
        font-size: 12px;
      }
      .btn-nav {
        padding: 5px 5px 5px 12px;
      }
      .hero-left .hero-title {
        font-size: 24px;
      }
      .hero-cta-group {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-orange, .btn-secondary {
        width: 100%;
        justify-content: center;
      }
      .about-stats {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      .mobile-nav-panel {
        left: 12px;
        right: 12px;
      }
    }
  </style>
</head>
<body>
  <!-- Fixed Scroll Animation Canvas in background -->
  <canvas id="scroll-canvas"></canvas>
  <div class="canvas-overlay"></div>

  <!-- Page Content -->
  <div class="page-wrapper">
    <!-- Navbar -->
    <header class="navbar">
      <a href="index.html" class="brand-logo" title="Mohammad Ismaeel">
        <span>Mohammad Ismaeel</span>
        <span class="brand-moniker">Andro</span>
      </a>
      <div class="nav-actions">
        <!-- Floating Glass Nav Dock for Tablets/Desktop -->
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="projects.html">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <a href="https://wa.me/9647810768984?text=Hi%20Mohammad,%20I%20would%20like%20to%20start%20a%20project" target="_blank" rel="noopener noreferrer" class="btn-nav">
          <span>Start a Project</span>
          <span class="icon-circle">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
        <!-- Mobile Menu Toggle Button -->
        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Toggle Navigation Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>

    <!-- Mobile Navigation Dropdown Panel -->
    <nav class="mobile-nav-panel" id="mobileNavPanel">
      <a href="#home" class="mobile-nav-link">
        <span>Home</span>
        <span>&rarr;</span>
      </a>
      <a href="#about" class="mobile-nav-link">
        <span>About</span>
        <span>&rarr;</span>
      </a>
      <a href="#services" class="mobile-nav-link">
        <span>Services</span>
        <span>&rarr;</span>
      </a>
      <a href="projects.html" class="mobile-nav-link highlight">
        <span>Projects &bull; Selected Works</span>
        <span>&rarr;</span>
      </a>
      <a href="#contact" class="mobile-nav-link">
        <span>Contact</span>
        <span>&rarr;</span>
      </a>
    </nav>

    <!-- Hero Section -->
    <section class="hero-card" id="home">
      <!-- Status & Location Glass Meta Bar -->
      <div class="hero-meta-bar">
        <div class="status-badge">
          <span class="status-dot"></span>
          <span>Available for New Projects</span>
        </div>
        <div class="location-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span>Erbil, Kurdistan Region, Iraq</span>
        </div>
      </div>

      <!-- Main Hero 2-Column Split: Face in Center completely clear -->
      <div class="hero-main">
        <div class="hero-left">
          <div class="hero-eyebrow">Hey, I'm Mohammad Ismaeel ("Andro")</div>
          <h1 class="hero-title">Designing Fast,<br><span class="no-break">High&#8209;Converting</span> &amp;<br><span class="no-break">Custom&#8209;Crafted</span> Websites.</h1>
          <div class="hero-role">Web Designer &amp; Digital Solutions Specialist • 100% Handcrafted Design</div>
        </div>

        <div class="hero-right">
          <p class="hero-subheadline">
            Helping modern businesses, startups, and creators build sleek digital platforms that captivate audiences and drive measurable results.
          </p>
          <div class="hero-cta-group">
            <a href="https://wa.me/9647810768984?text=Hi%20Mohammad,%20I%20would%20like%20to%20start%20a%20project" target="_blank" rel="noopener noreferrer" class="btn-orange">
              <span>Start a Project</span>
              <span class="icon-circle-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </a>
            <a href="projects.html" class="btn-secondary">
              <span>View Selected Works</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M7 17L17 7M7 7h10v10"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- 4 Core Services: Glass Styled Cards -->
      <div class="hero-services" id="services">
        <div class="service-item">
          <span class="service-num">#01</span>
          <h3 class="service-title">High-Converting Landing Pages</h3>
          <p class="service-desc">Tailored for product launches, local businesses, and targeted ad campaigns with clean UI/UX and intuitive calls-to-action.</p>
        </div>
        <div class="service-item">
          <span class="service-num">#02</span>
          <h3 class="service-title">Bespoke Custom Web Development</h3>
          <p class="service-desc">Every site is 100% designed and coded by myself using Framer, Webflow &amp; modern code. High-speed 24 to 72 hour turnaround with handcrafted pixel precision.</p>
        </div>
        <div class="service-item">
          <span class="service-num">#03</span>
          <h3 class="service-title">Responsive E-Commerce &amp; Service Sites</h3>
          <p class="service-desc">Mobile-first layouts with integrated order forms, direct WhatsApp chat funnels, and seamless booking systems.</p>
        </div>
        <div class="service-item">
          <span class="service-num">#04</span>
          <h3 class="service-title">Speed &amp; Search Engine Optimization (SEO)</h3>
          <p class="service-desc">Near-instant load speeds, clean semantic markup, and fundamental on-page SEO to ensure top visibility on Google search.</p>
        </div>
      </div>
    </section>

    <!-- Tech Stack & Toolkit Large Glass Pill Strip -->
    <section class="tech-strip">
      <div class="tech-label">
        Tech Stack &amp; Toolkit
      </div>
      <div class="tech-pills">
        <span class="tech-pill">⚡ Framer</span>
        <span class="tech-pill">🌐 Webflow</span>
        <span class="tech-pill">💼 WordPress</span>
        <span class="tech-pill">🎨 Figma</span>
        <span class="tech-pill">💻 HTML5 / CSS3</span>
        <span class="tech-pill">🚀 Core Web Vitals</span>
        <span class="tech-pill">📱 WhatsApp Funnels</span>
        <span class="tech-pill">🎬 Adobe Suite</span>
      </div>
    </section>

    <!-- About Me Section in Glass Card -->
    <section class="about-section" id="about">
      <div class="about-grid">
        <div class="about-left">
          <span class="about-tag">About Mohammad Ismaeel</span>
          <h2 class="about-headline">Bridging Technical Precision &amp; Modern Design.</h2>
          <div class="about-tagline">
            "Bridging technical precision, modern design, and rapid delivery."
          </div>

          <div class="about-stats">
            <div class="stat-card">
              <div class="stat-val">8+</div>
              <div class="stat-lbl">Years Hands-on Digital Experience</div>
            </div>
            <div class="stat-card">
              <div class="stat-val">24-72h</div>
              <div class="stat-lbl">Rapid Project Delivery Capability</div>
            </div>
          </div>
        </div>

        <div class="about-right">
          <p>
            I am a digital solutions specialist and web designer with <strong>over 8 years of hands-on experience</strong> across digital media platforms, technical troubleshooting, and online audience engagement.
          </p>
          <p>
            Today, I personally design and build every digital platform from the ground up using modern frameworks (including Framer, Webflow, and custom responsive code stacks) to craft sleek, accessible, and lightning-fast websites. Every website is 100% my own handcrafted work—designed and developed by myself with artisan precision. Because I come from a strong background in customer experience and technical operations, I don't just build sites that look clean—<strong>I engineer user journeys that convert visitors into loyal clients</strong>.
          </p>
          <p>
            Whether you need a high-impact corporate landing page, a personal brand showcase, or an automated lead-generation platform, I deliver market-ready digital assets with industry-leading turnaround times.
          </p>

          <div class="lang-row">
            <span style="font-size: 13px; font-weight: 700; color: var(--text-muted); margin-right: 4px;">Languages Spoken:</span>
            <span class="lang-badge">Kurdish (Native)</span>
            <span class="lang-badge">Arabic (Native)</span>
            <span class="lang-badge">English (Professional)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Projects Showcase Section -->
    <section class="showcase-section" id="projects">
      <div class="showcase-header">
        <div class="showcase-header-left">
          <span class="showcase-tag">Featured Works</span>
          <h2 class="showcase-title">High-Impact Websites &amp;<br>Digital Solutions</h2>
        </div>
        <div>
          <a href="projects.html" class="btn-orange">
            <span>View All Works</span>
            <span class="icon-circle-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </a>
        </div>
      </div>

      <!-- 3 Real Project Glass Cards -->
      <div class="showcase-grid">
        <!-- Project 1 -->
        <article class="project-item-card">
          <div class="img-wrap">
            <img src="assets/project1.jpg" alt="Modern Corporate Showcase" loading="lazy">
          </div>
          <div class="project-card-body">
            <div>
              <div class="project-cat">B2B &amp; Professional Services</div>
              <h3 class="project-item-title">Modern Corporate Showcase</h3>
              <p class="project-item-summary">A sleek, minimalist business landing page engineered to establish brand authority and capture prospective enterprise leads.</p>
            </div>
            <div class="project-item-footer">
              <span class="item-features">Dynamic Hero &bull; Booking &bull; Lead-Gen</span>
              <a href="https://wa.me/9647810768984?text=Hi%20Mohammad,%20tell%20me%20more%20about%20the%20Corporate%20Showcase%20solution" target="_blank" rel="noopener noreferrer" class="link-inquire">
                <span>Inquire</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>

        <!-- Project 2 -->
        <article class="project-item-card">
          <div class="img-wrap">
            <img src="assets/project3.jpg" alt="High-Velocity E-Commerce Store" loading="lazy">
          </div>
          <div class="project-card-body">
            <div>
              <div class="project-cat">Retail &amp; Direct-to-Consumer</div>
              <h3 class="project-item-title">High-Velocity E-Commerce / Local Store</h3>
              <p class="project-item-summary">A streamlined storefront built with a rapid WhatsApp-checkout flow, allowing customers to order directly from mobile devices.</p>
            </div>
            <div class="project-item-footer">
              <span class="item-features">WhatsApp Checkout &bull; Zero Friction</span>
              <a href="https://wa.me/9647810768984?text=Hi%20Mohammad,%20tell%20me%20more%20about%20the%20WhatsApp%20Store%20solution" target="_blank" rel="noopener noreferrer" class="link-inquire">
                <span>Inquire</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>

        <!-- Project 3 -->
        <article class="project-item-card">
          <div class="img-wrap">
            <img src="assets/project2.jpg" alt="Creator & Personal Brand Hub" loading="lazy">
          </div>
          <div class="project-card-body">
            <div>
              <div class="project-cat">Portfolio &amp; Content Strategy</div>
              <h3 class="project-item-title">Creator &amp; Personal Brand Hub</h3>
              <p class="project-item-summary">An interactive digital hub designed for digital creators to centralize portfolio assets, social followings, and brand sponsorship inquiries.</p>
            </div>
            <div class="project-item-footer">
              <span class="item-features">Social Proof &bull; Newsletter &bull; Media</span>
              <a href="https://wa.me/9647810768984?text=Hi%20Mohammad,%20tell%20me%20more%20about%20the%20Creator%20Brand%20Hub" target="_blank" rel="noopener noreferrer" class="link-inquire">
                <span>Inquire</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>
      </div>

      <div style="text-align: center; margin-top: 50px;">
        <a href="projects.html" class="btn-orange" style="padding: 10px 10px 10px 28px; font-size: 15px;">
          <span>Browse All Websites &amp; Digital Case Studies</span>
          <span class="icon-circle-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </a>
      </div>
    </section>

    <!-- Why Work With Me (Value Proposition) in Glass Cards -->
    <section class="value-section">
      <div class="value-header">
        <span class="value-tag">Value Proposition</span>
        <h2 class="value-title">Why Work With Mohammad Ismaeel</h2>
      </div>

      <div class="value-grid">
        <div class="value-card">
          <div class="value-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div class="value-text">
            <h3>Lightning-Fast Turnaround</h3>
            <p>From initial concept to live market-ready deployment in days (24 to 72 hours), not months. Perfect for high-urgency launches.</p>
          </div>
        </div>

        <div class="value-card">
          <div class="value-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div class="value-text">
            <h3>Business-First Approach</h3>
            <p>Clean aesthetics backed by clear conversion logic, ensuring your website drives actual sales, inquiries, and customer loyalty.</p>
          </div>
        </div>

        <div class="value-card">
          <div class="value-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="value-text">
            <h3>Direct Communication</h3>
            <p>Clear, transparent milestone tracking with direct support in Kurdish (Native), Arabic (Native), or English (Professional).</p>
          </div>
        </div>

        <div class="value-card">
          <div class="value-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div class="value-text">
            <h3>Full Ownership</h3>
            <p>You get complete control and administrative access to your platform, code, and domains with zero lock-in contracts.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Direct Contact Section in Glass Card -->
    <section class="contact-section" id="contact">
      <div class="contact-main">
        <div class="contact-left">
          <span class="contact-tag">Get In Touch</span>
          <h2>Let's Build Something Exceptional Together.</h2>
          <p>
            Whether you have an upcoming product launch, want to revamp your brand identity, or need an automated lead machine, I'm ready to collaborate.
          </p>
        </div>

        <div class="contact-right">
          <!-- WhatsApp / Phone -->
          <a href="https://wa.me/9647810768984?text=Hi%20Mohammad,%20I%20am%20interested%20in%20discussing%20a%20project" target="_blank" rel="noopener noreferrer" class="contact-card-link">
            <div class="c-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div class="c-meta">
              <span>Direct WhatsApp &amp; Phone</span>
              <strong>+964 781 076 8984</strong>
            </div>
          </a>

          <!-- Email -->
          <a href="mailto:andro200121@gmail.com" class="contact-card-link">
            <div class="c-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div class="c-meta">
              <span>Email Address</span>
              <strong>andro200121@gmail.com</strong>
            </div>
          </a>

          <!-- Location -->
          <div class="contact-card-link" style="cursor: default;">
            <div class="c-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div class="c-meta">
              <span>Headquarters</span>
              <strong>Erbil, Kurdistan Region, Iraq</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer with Secret Owner Trigger Dot -->
    <footer class="site-footer">
      <div>
        &copy; 2026 Mohammad Ismaeel Abdulla.<span class="secret-trigger-dot" title=""></span> All rights reserved.
      </div>
      <div>
        Web Designer &amp; Digital Solutions Specialist &bull; <a href="#home">Back to top &uarr;</a>
      </div>
    </footer>
  </div>

  <!-- Local Lenis for smooth momentum physics -->
  <script src="lenis.min.js"></script>
  <script>
    (function () {
      const FRAME_PATHS = %%FRAMES_PLACEHOLDER%%;
      const TOTAL_FRAMES = FRAME_PATHS.length;

      const canvas = document.getElementById('scroll-canvas');
      const ctx = canvas.getContext('2d', { alpha: false });

      const images = new Array(TOTAL_FRAMES);

      let currentFrame = 0;
      let targetFrame = 0;
      let lastDrawnIndex = -1;
      let isFirstFrameDrawn = false;

      // High-DPI Canvas Setup
      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.round(window.innerWidth * dpr);
        const h = Math.round(window.innerHeight * dpr);

        canvas.width = w;
        canvas.height = h;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        lastDrawnIndex = -1;
        drawCurrent();
      }

      window.addEventListener('resize', resizeCanvas, { passive: true });
      resizeCanvas();

      // Centered Cover Drawing: fits full screen crisply on any aspect ratio
      function drawImageCover(img) {
        if (!img || !img._loaded) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth || 1280;
        const ih = img.naturalHeight || 720;

        const scale = Math.max(cw / iw, ch / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const nx = (cw - nw) * 0.5;
        const ny = (ch - nh) * 0.5;

        ctx.drawImage(img, nx, ny, nw, nh);
      }

      // Nearest loaded frame fallback to guarantee 0 flickering
      function getBestAvailableFrame(index) {
        const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
        if (images[target] && images[target]._loaded) {
          return images[target];
        }

        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = target - offset;
          if (prev >= 0 && images[prev] && images[prev]._loaded) {
            return images[prev];
          }
          const next = target + offset;
          if (next < TOTAL_FRAMES && images[next] && images[next]._loaded) {
            return images[next];
          }
        }
        return null;
      }

      function drawCurrent() {
        const frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
        if (frameIndex === lastDrawnIndex) return;

        const img = getBestAvailableFrame(frameIndex);
        if (img) {
          drawImageCover(img);
          lastDrawnIndex = frameIndex;
        }
      }

      // Calculate scroll progress across the document height
      function updateScrollProgress() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
        targetFrame = progress * (TOTAL_FRAMES - 1);
      }

      updateScrollProgress();
      currentFrame = targetFrame;

      // Progressive image preloader for main hero
      function preloadImages() {
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          const img = new Image();
          img._loaded = false;

          const onImageLoaded = () => {
            if (img._loaded) return;
            img._loaded = true;
            if (!isFirstFrameDrawn) {
              const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
              if (i === target || (i === 0 && !images[target]?._loaded)) {
                isFirstFrameDrawn = true;
                drawImageCover(img);
                lastDrawnIndex = i;
              }
            }
          };

          img.onload = onImageLoaded;
          img.src = FRAME_PATHS[i];

          if (img.complete && img.naturalWidth > 0) {
            onImageLoaded();
          }

          images[i] = img;
        }
      }

      preloadImages();

      // Automatically sync if the folder contents change in the future
      fetch('/api/frames')
        .then(r => r.json())
        .then(serverFrames => {
          if (Array.isArray(serverFrames) && serverFrames.length > 0 && serverFrames.length !== TOTAL_FRAMES) {
            location.reload();
          }
        })
        .catch(() => {});

      // Initialize Lenis for smooth momentum physics
      let lenis = null;
      if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
        });

        lenis.on('scroll', ({ progress }) => {
          targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, progress * (TOTAL_FRAMES - 1)));
          updateScrollProgress();
        });
      }

      // Native scroll listener ensures targetFrame stays perfectly in sync
      window.addEventListener('scroll', updateScrollProgress, { passive: true });

      // Continuous RAF loop with smooth lerping
      function render(time) {
        if (lenis) {
          lenis.raf(time);
        }

        const delta = targetFrame - currentFrame;
        if (Math.abs(delta) > 0.0005) {
          currentFrame += delta * 0.12;
        } else {
          currentFrame = targetFrame;
        }

        drawCurrent();

        requestAnimationFrame(render);
      }

      requestAnimationFrame(render);
    })();
  </script>

  <!-- Mobile Menu Interactions -->
  <script>
    (function() {
      const btn = document.getElementById('mobileMenuBtn');
      const panel = document.getElementById('mobileNavPanel');
      if (btn && panel) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          panel.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
          if (!panel.contains(e.target) && e.target !== btn) {
            panel.classList.remove('active');
          }
        });
        panel.querySelectorAll('a').forEach(function(link) {
          link.addEventListener('click', function() {
            panel.classList.remove('active');
          });
        });
      }
    })();
  </script>

  <!-- Include Secret Owner Admin Script -->
  <script src="admin.js"></script>
</body>
</html>
`;

const output = htmlContent.replace('%%FRAMES_PLACEHOLDER%%', JSON.stringify(frames));
fs.writeFileSync('index.html', output);
console.log('Successfully generated index.html with liquid specular glass style!');
