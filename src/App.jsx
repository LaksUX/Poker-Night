import { useState, useEffect, useRef } from "react";

const SCREENS = ["home", "game-detail", "live-game", "leaderboard", "profile"];

const GAMES = [
  { id: 1, name: "Friday Night Felts", host: "Raj K.", date: "Tonight", time: "8:00 PM", location: "Raj's Place, Koramangala", confirmed: 7, max: 9, waitlist: 1, maxWait: 2, banks: 2, rake: 1, status: "open", myRsvp: "confirmed", confirmedPlayers: ["Raj K.", "Priya S.", "Arjun M.", "Neha R.", "Dev P.", "Sana T.", "You"], waitlistPlayers: ["Karan B."] },
  { id: 2, name: "Saturday Shootout", host: "Priya S.", date: "Sat, Apr 19", time: "7:30 PM", location: "Priya's Apt, Indiranagar", confirmed: 4, max: 9, waitlist: 0, maxWait: 2, banks: 1, rake: 0, status: "open", myRsvp: "invited", confirmedPlayers: ["Priya S.", "Arjun M.", "Dev P.", "Sana T."], waitlistPlayers: [] },
  { id: 3, name: "Sunday Deep Stack", host: "Dev P.", date: "Sun, Apr 20", time: "6:00 PM", location: "Dev's Villa, Whitefield", confirmed: 9, max: 9, waitlist: 2, maxWait: 2, banks: 3, rake: 2, status: "full", myRsvp: "waitlisted", confirmedPlayers: ["Dev P.", "Raj K.", "Priya S.", "Arjun M.", "Neha R.", "Sana T.", "Karan B.", "Meera J.", "Vikram S."], waitlistPlayers: ["You", "Aditya K."] },
];

const LEADERBOARD = [
  { rank: 1, name: "Raj K.", points: 142, games: 28, wins: 11, trend: "+12" },
  { rank: 2, name: "Priya S.", points: 128, games: 24, wins: 9, trend: "+5" },
  { rank: 3, name: "You", points: 117, games: 22, wins: 8, trend: "+8", isMe: true },
  { rank: 4, name: "Arjun M.", points: 104, games: 20, wins: 7, trend: "-2" },
  { rank: 5, name: "Dev P.", points: 98, games: 19, wins: 6, trend: "+3" },
  { rank: 6, name: "Sana T.", points: 87, games: 17, wins: 5, trend: "+1" },
  { rank: 7, name: "Karan B.", points: 76, games: 15, wins: 4, trend: "-4" },
  { rank: 8, name: "Neha R.", points: 65, games: 14, wins: 3, trend: "0" },
];

const LIVE_PLAYERS = [
  { name: "Raj K.", bought: 3, cashedOut: false, chips: null, host: true,
    rebuys: [{ ts: "8:04 PM", bank: 1 }, { ts: "8:51 PM", bank: 1 }] },
  { name: "Priya S.", bought: 2, cashedOut: false, chips: null,
    rebuys: [{ ts: "9:12 PM", bank: 1 }] },
  { name: "Arjun M.", bought: 4, cashedOut: true, chips: 320, net: +1.6,
    rebuys: [{ ts: "8:22 PM", bank: 1 }, { ts: "8:47 PM", bank: 1 }, { ts: "9:05 PM", bank: 1 }] },
  { name: "Neha R.", bought: 2, cashedOut: false, chips: null,
    rebuys: [{ ts: "9:30 PM", bank: 1 }] },
  { name: "Dev P.", bought: 3, cashedOut: false, chips: null,
    rebuys: [{ ts: "8:35 PM", bank: 1 }, { ts: "9:18 PM", bank: 1 }] },
  { name: "Sana T.", bought: 1, cashedOut: true, chips: 0, net: -1,
    rebuys: [] },
  { name: "You", bought: 2, cashedOut: false, chips: null, isMe: true,
    rebuys: [{ ts: "8:58 PM", bank: 1 }] },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  :root {
    --felt: #0a1a0f;
    --felt-mid: #0f2318;
    --felt-light: #163020;
    --green: #1a6b35;
    --green-bright: #22c55e;
    --green-glow: rgba(34,197,94,0.15);
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --gold-dim: rgba(201,168,76,0.2);
    --cream: #f5f0e8;
    --white: #ffffff;
    --gray: #8a9a8e;
    --gray-dim: rgba(138,154,142,0.3);
    --red: #e05252;
    --red-dim: rgba(224,82,82,0.15);
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08);
    --border-gold: rgba(201,168,76,0.3);
  }

  body {
    background: var(--felt);
    font-family: 'DM Sans', sans-serif;
    color: var(--cream);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .phone-shell {
    width: 390px;
    min-height: 100vh;
    background: var(--felt);
    position: relative;
    overflow: hidden;
  }

  /* Subtle felt texture */
  .phone-shell::before {
    content: '';
    position: fixed;
    inset: 0;
    width: 390px;
    background-image: 
      radial-gradient(ellipse at 20% 0%, rgba(26,107,53,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 100%, rgba(201,168,76,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .screen { 
    position: relative; 
    z-index: 1;
    min-height: 100vh;
    padding-bottom: 88px;
  }

  /* ── Status Bar ── */
  .status-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 24px 8px;
    font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
    color: var(--gray);
  }
  .status-bar .time { color: var(--cream); font-size: 15px; font-weight: 600; }

  /* ── Top Bar ── */
  .top-bar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 24px 20px;
  }
  .top-bar .wordmark {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700;
    color: var(--cream); letter-spacing: -0.02em;
  }
  .top-bar .wordmark span { color: var(--gold); }
  .icon-btn {
    width: 40px; height: 40px; border-radius: 12px;
    background: var(--surface); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
    color: var(--cream); font-size: 16px;
  }
  .icon-btn:hover { background: var(--surface-hover); }

  /* ── Section label ── */
  .section-label {
    font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--gray);
    padding: 0 24px; margin-bottom: 12px;
  }

  /* ── Game Cards ── */
  .games-list { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }

  .game-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    position: relative; overflow: hidden;
  }
  .game-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent);
  }
  .game-card:hover { background: var(--surface-hover); transform: translateY(-1px); }
  .game-card.featured {
    background: linear-gradient(135deg, rgba(26,107,53,0.25) 0%, rgba(15,35,24,0.8) 100%);
    border-color: rgba(34,197,94,0.2);
  }
  .game-card.full { border-color: rgba(201,168,76,0.25); }

  .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .card-title {
    font-family: 'Playfair Display', serif;
    font-size: 17px; font-weight: 600; color: var(--cream);
    line-height: 1.3;
  }
  .card-host { font-size: 12px; color: var(--gray); margin-top: 3px; }

  .rsvp-pill {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 20px;
    white-space: nowrap; flex-shrink: 0;
  }
  .pill-confirmed { background: rgba(34,197,94,0.15); color: var(--green-bright); border: 1px solid rgba(34,197,94,0.25); }
  .pill-invited   { background: rgba(201,168,76,0.12); color: var(--gold); border: 1px solid var(--border-gold); }
  .pill-waitlisted { background: rgba(224,82,82,0.1); color: var(--red); border: 1px solid rgba(224,82,82,0.25); }
  .pill-full      { background: rgba(255,255,255,0.05); color: var(--gray); border: 1px solid var(--border); }

  .card-meta {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; margin-bottom: 16px;
  }
  .meta-item { display: flex; align-items: center; gap: 6px; }
  .meta-icon { font-size: 13px; opacity: 0.7; }
  .meta-text { font-size: 12px; color: var(--gray); }
  .meta-text strong { color: var(--cream); font-weight: 500; }

  .seat-bar { margin-top: 4px; }
  .seat-bar-track {
    height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px;
    overflow: hidden; margin-bottom: 6px;
  }
  .seat-bar-fill {
    height: 100%; border-radius: 2px;
    background: linear-gradient(90deg, var(--green) 0%, var(--green-bright) 100%);
    transition: width 0.4s ease;
  }
  .seat-bar-fill.almost { background: linear-gradient(90deg, #d97706, #f59e0b); }
  .seat-bar-fill.full-bar { background: linear-gradient(90deg, #b91c1c, #e05252); }
  .seat-info { display: flex; justify-content: space-between; font-size: 11px; color: var(--gray); }
  .seat-info span:last-child { color: var(--gold); font-weight: 500; }

  /* ── Bottom Nav ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 390px; background: rgba(10,26,15,0.92);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display: flex; padding: 12px 8px 28px; gap: 0; z-index: 100;
  }
  .nav-item {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;
    cursor: pointer; padding: 8px 4px; border-radius: 12px;
    transition: all 0.2s; color: var(--gray);
  }
  .nav-item.active { color: var(--green-bright); }
  .nav-item:hover { background: var(--surface); }
  .nav-icon { font-size: 20px; line-height: 1; }
  .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; }
  .nav-dot {
    width: 4px; height: 4px; border-radius: 50%; background: var(--green-bright);
    position: absolute; bottom: 30px;
  }

  /* ── Divider ── */
  .divider { height: 1px; background: var(--border); margin: 20px 24px; }

  /* ── Greeting ── */
  .greeting { padding: 4px 24px 24px; }
  .greeting-sub { font-size: 13px; color: var(--gray); margin-bottom: 4px; }
  .greeting-name {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: var(--cream); letter-spacing: -0.02em;
  }
  .greeting-name span { color: var(--gold); }

  /* ── Stats strip ── */
  .stats-strip {
    display: flex; gap: 10px; padding: 0 16px; margin-bottom: 28px;
  }
  .stat-chip {
    flex: 1; background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 12px; text-align: center;
  }
  .stat-val {
    font-family: 'DM Mono', monospace;
    font-size: 20px; font-weight: 500; color: var(--cream);
    line-height: 1;
  }
  .stat-val.gold { color: var(--gold); }
  .stat-val.green { color: var(--green-bright); }
  .stat-lbl { font-size: 10px; color: var(--gray); margin-top: 4px; letter-spacing: 0.06em; text-transform: uppercase; }

  /* ── Game Detail ── */
  .detail-hero {
    padding: 0 24px 24px; position: relative;
  }
  .back-btn {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: var(--gray); cursor: pointer;
    margin-bottom: 20px; width: fit-content;
  }
  .back-btn:hover { color: var(--cream); }
  .detail-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700; color: var(--cream);
    letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 8px;
  }
  .detail-host { font-size: 13px; color: var(--gray); }
  .detail-host span { color: var(--gold); font-weight: 500; }

  .detail-meta-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 10px; padding: 0 16px; margin-bottom: 24px;
  }
  .detail-meta-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 14px 16px;
  }
  .dmc-label { font-size: 10px; color: var(--gray); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
  .dmc-value { font-size: 15px; font-weight: 500; color: var(--cream); }
  .dmc-value.green { color: var(--green-bright); }
  .dmc-value.gold { color: var(--gold); }

  .rsvp-section { padding: 0 16px; margin-bottom: 24px; }
  .rsvp-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px;
  }
  .rsvp-title { font-size: 13px; font-weight: 600; color: var(--cream); letter-spacing: 0.04em; }
  .rsvp-count { font-size: 12px; color: var(--gray); }
  .rsvp-count span { color: var(--green-bright); font-weight: 600; }

  .player-list { display: flex; flex-direction: column; gap: 8px; }
  .player-row {
    display: flex; align-items: center; gap: 12px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 10px 14px;
  }
  .player-row.me { border-color: rgba(34,197,94,0.25); background: rgba(34,197,94,0.05); }
  .player-row.waitlist-row { border-color: rgba(201,168,76,0.15); background: rgba(201,168,76,0.04); }
  .avatar {
    width: 34px; height: 34px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; flex-shrink: 0;
    background: var(--felt-light); color: var(--gray);
  }
  .avatar.green-av { background: rgba(34,197,94,0.15); color: var(--green-bright); }
  .avatar.gold-av  { background: rgba(201,168,76,0.15); color: var(--gold); }
  .player-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--cream); }
  .player-name.me-name { color: var(--green-bright); }
  .player-badge {
    font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 8px;
  }
  .badge-host { background: rgba(201,168,76,0.15); color: var(--gold); }
  .badge-you  { background: rgba(34,197,94,0.12); color: var(--green-bright); }
  .waitlist-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: var(--gold); font-weight: 500;
    background: var(--gold-dim); border-radius: 6px; padding: 2px 6px;
  }

  .rsvp-actions { display: flex; gap: 10px; padding: 0 16px; margin-bottom: 16px; }
  .btn-primary {
    flex: 1; height: 50px; border-radius: 14px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    letter-spacing: 0.02em; transition: all 0.2s;
    background: linear-gradient(135deg, var(--green) 0%, #16a34a 100%);
    color: white;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-secondary {
    height: 50px; padding: 0 20px; border-radius: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    background: var(--surface); border: 1px solid var(--border); color: var(--gray);
    transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: rgba(255,255,255,0.2); color: var(--cream); }
  .btn-gold {
    flex: 1; height: 50px; border-radius: 14px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    background: linear-gradient(135deg, #92670a 0%, var(--gold) 100%);
    color: #1a0f00; transition: all 0.2s;
  }
  .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-danger {
    height: 50px; padding: 0 20px; border-radius: 14px; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    background: var(--red-dim); border: 1px solid rgba(224,82,82,0.2); color: var(--red);
    transition: all 0.2s;
  }

  /* ── Live Game ── */
  .live-header {
    padding: 0 24px 20px;
  }
  .live-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
    border-radius: 20px; padding: 5px 12px; margin-bottom: 12px;
  }
  .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green-bright); animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .live-badge-text { font-size: 11px; font-weight: 700; color: var(--green-bright); letter-spacing: 0.08em; text-transform: uppercase; }

  .live-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: var(--cream); letter-spacing: -0.02em;
  }

  .bank-tracker {
    margin: 0 16px 24px;
    background: linear-gradient(135deg, rgba(26,107,53,0.2) 0%, rgba(15,35,24,0.6) 100%);
    border: 1px solid rgba(34,197,94,0.2); border-radius: 20px; padding: 20px;
    position: relative; overflow: hidden;
  }
  .bank-tracker::after {
    content: ''; position: absolute; top: -20px; right: -20px;
    width: 100px; height: 100px; border-radius: 50%;
    background: radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%);
  }
  .tracker-label { font-size: 11px; color: var(--gray); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
  .tracker-main {
    font-family: 'DM Mono', monospace;
    font-size: 32px; font-weight: 500; color: var(--green-bright);
    line-height: 1; margin-bottom: 16px;
  }
  .tracker-sub { display: flex; gap: 20px; }
  .tracker-sub-item { }
  .tracker-sub-label { font-size: 10px; color: var(--gray); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px; }
  .tracker-sub-val {
    font-family: 'DM Mono', monospace;
    font-size: 15px; font-weight: 500; color: var(--cream);
  }
  .tracker-sub-val.gold { color: var(--gold); }

  .live-players { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .live-player-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
    transition: all 0.2s;
  }
  .live-player-card.cashed { opacity: 0.5; }
  .live-player-card.me-live { border-color: rgba(34,197,94,0.25); }
  .player-info { flex: 1; }
  .player-info-name { font-size: 14px; font-weight: 500; color: var(--cream); }
  .player-info-name.me-live-name { color: var(--green-bright); }
  .player-info-banks { font-size: 12px; color: var(--gray); margin-top: 1px; }
  .player-info-banks span { font-family: 'DM Mono', monospace; color: var(--gold); font-size: 11px; }
  .net-badge {
    font-family: 'DM Mono', monospace;
    font-size: 13px; font-weight: 500; padding: 4px 8px;
    border-radius: 8px;
  }
  .net-pos { background: rgba(34,197,94,0.1); color: var(--green-bright); }
  .net-neg { background: rgba(224,82,82,0.1); color: var(--red); }
  .net-out { background: rgba(255,255,255,0.05); color: var(--gray); font-size: 10px; letter-spacing: 0.06em; }
  .buy-btn {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(34,197,94,0.3);
    background: rgba(34,197,94,0.08); color: var(--green-bright);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; font-weight: 300; flex-shrink: 0;
    transition: all 0.15s;
  }
  .buy-btn:hover { background: rgba(34,197,94,0.15); }

  /* ── Rebuy log ── */
  .rebuy-log {
    margin-top: 10px; padding-top: 10px;
    border-top: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 5px;
  }
  .rebuy-log-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray); margin-bottom: 4px;
  }
  .rebuy-row {
    display: flex; align-items: center; gap: 8px;
  }
  .rebuy-pip {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold); flex-shrink: 0;
    box-shadow: 0 0 4px rgba(201,168,76,0.5);
  }
  .rebuy-pip.initial {
    background: var(--gray);
    box-shadow: none;
  }
  .rebuy-pip.new-pip {
    background: var(--green-bright);
    box-shadow: 0 0 6px rgba(34,197,94,0.6);
    animation: popIn 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes popIn { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
  .rebuy-ts {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: var(--gray); flex: 1;
  }
  .rebuy-ts.new-ts { color: var(--green-bright); }
  .rebuy-label {
    font-size: 11px; font-weight: 500;
    padding: 2px 7px; border-radius: 6px;
  }
  .rebuy-label.initial-label {
    color: var(--gray); background: rgba(138,154,142,0.1);
  }
  .rebuy-label.rebuy-label-gold {
    color: var(--gold); background: rgba(201,168,76,0.1);
  }
  .rebuy-label.rebuy-label-new {
    color: var(--green-bright); background: rgba(34,197,94,0.1);
  }
  .live-player-card.expanded {
    border-color: rgba(255,255,255,0.12);
  }
  .expand-toggle {
    font-size: 10px; color: var(--gray); cursor: pointer;
    display: flex; align-items: center; gap: 4px;
    padding: 2px 0; transition: color 0.15s; user-select: none;
  }
  .expand-toggle:hover { color: var(--cream); }

  /* ── Leaderboard ── */
  .lb-header { padding: 0 24px 24px; }
  .lb-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px; font-weight: 700; color: var(--cream); letter-spacing: -0.02em;
  }
  .lb-sub { font-size: 13px; color: var(--gray); margin-top: 4px; }

  .podium {
    display: flex; align-items: flex-end; justify-content: center;
    padding: 0 16px; gap: 8px; margin-bottom: 28px;
  }
  .podium-spot { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
  .podium-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: var(--felt);
    position: relative;
  }
  .podium-1 .podium-avatar { width: 64px; height: 64px; background: var(--gold); font-size: 18px; }
  .podium-2 .podium-avatar { background: #C0C0C0; color: #333; }
  .podium-3 .podium-avatar { background: #CD7F32; }
  .podium-crown {
    position: absolute; top: -16px; font-size: 18px;
  }
  .podium-name { font-size: 12px; font-weight: 600; color: var(--cream); text-align: center; }
  .podium-pts {
    font-family: 'DM Mono', monospace;
    font-size: 13px; font-weight: 500; color: var(--gold);
  }
  .podium-block {
    border-radius: 8px 8px 0 0; width: 100%;
    background: var(--surface); border: 1px solid var(--border); border-bottom: none;
  }
  .podium-1 .podium-block { height: 60px; background: linear-gradient(180deg, rgba(201,168,76,0.15) 0%, var(--surface) 100%); border-color: var(--border-gold); }
  .podium-2 .podium-block { height: 45px; }
  .podium-3 .podium-block { height: 32px; }

  .lb-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .lb-row {
    display: flex; align-items: center; gap: 12px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 12px 16px; transition: all 0.2s;
  }
  .lb-row.me-row { border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.06); }
  .lb-rank {
    font-family: 'DM Mono', monospace;
    font-size: 14px; font-weight: 500; color: var(--gray);
    width: 24px; text-align: center; flex-shrink: 0;
  }
  .lb-rank.top { color: var(--gold); }
  .lb-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--cream); }
  .lb-name.me-name { color: var(--green-bright); }
  .lb-games { font-size: 11px; color: var(--gray); }
  .lb-pts {
    font-family: 'DM Mono', monospace;
    font-size: 16px; font-weight: 500; color: var(--cream);
  }
  .lb-trend {
    font-size: 11px; font-weight: 600; font-family: 'DM Mono', monospace;
    width: 36px; text-align: right;
  }
  .trend-up { color: var(--green-bright); }
  .trend-down { color: var(--red); }
  .trend-flat { color: var(--gray); }

  /* ── Profile ── */
  .profile-header { padding: 0 24px 28px; }
  .profile-avatar-wrap { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .profile-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green) 0%, var(--gold) 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700; color: white;
  }
  .profile-name {
    font-family: 'Playfair Display', serif;
    font-size: 22px; font-weight: 700; color: var(--cream);
  }
  .profile-rank { font-size: 13px; color: var(--gray); margin-top: 3px; }
  .profile-rank span { color: var(--gold); font-weight: 600; }

  .profile-stats {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
    margin-bottom: 28px; padding: 0 16px;
  }
  .profile-stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 14px 10px; text-align: center;
  }
  .ps-val {
    font-family: 'DM Mono', monospace;
    font-size: 22px; font-weight: 500; line-height: 1;
    margin-bottom: 4px;
  }
  .ps-val.gold { color: var(--gold); }
  .ps-val.green { color: var(--green-bright); }
  .ps-val.cream { color: var(--cream); }
  .ps-lbl { font-size: 10px; color: var(--gray); letter-spacing: 0.06em; text-transform: uppercase; }

  .history-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .history-row {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .history-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot-win { background: var(--green-bright); }
  .dot-loss { background: var(--red); }
  .dot-break { background: var(--gray); }
  .history-info { flex: 1; }
  .history-game { font-size: 13px; font-weight: 500; color: var(--cream); }
  .history-meta { font-size: 11px; color: var(--gray); margin-top: 2px; }
  .history-result { text-align: right; }
  .history-banks {
    font-family: 'DM Mono', monospace;
    font-size: 14px; font-weight: 500;
  }
  .result-win { color: var(--green-bright); }
  .result-loss { color: var(--red); }
  .result-break { color: var(--gray); }
  .history-pts { font-size: 11px; color: var(--gold); margin-top: 2px; }

  /* ── Notification toast ── */
  .toast {
    position: fixed; top: 60px; left: 50%; transform: translateX(-50%);
    width: 358px; z-index: 999;
    background: rgba(15,35,24,0.96); backdrop-filter: blur(20px);
    border: 1px solid rgba(34,197,94,0.3); border-radius: 16px;
    padding: 14px 16px; display: flex; align-items: center; gap: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    animation: slideDown 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .toast-icon { font-size: 20px; flex-shrink: 0; }
  .toast-title { font-size: 13px; font-weight: 600; color: var(--cream); }
  .toast-body { font-size: 12px; color: var(--gray); margin-top: 2px; }

  .scroll-area { overflow-y: auto; max-height: calc(100vh - 88px); }

  .chip-cards { display: flex; gap: 8px; padding: 0 16px; margin-bottom: 20px; overflow-x: auto; scrollbar-width: none; }
  .chip-cards::-webkit-scrollbar { display: none; }
  .chip-card {
    flex-shrink: 0; background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 12px 16px; cursor: pointer; transition: all 0.2s;
    white-space: nowrap;
  }
  .chip-card.active { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.08); }
  .chip-card-label { font-size: 11px; color: var(--gray); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 3px; }
  .chip-card-val { font-size: 14px; font-weight: 600; color: var(--cream); }
  .chip-card.active .chip-card-val { color: var(--green-bright); }

  /* ── Create Game ── */
  .create-form { padding: 0 16px; display: flex; flex-direction: column; gap: 12px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray); padding-left: 2px;
  }
  .form-input {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 14px 16px;
    font-family: 'DM Sans', sans-serif; font-size: 15px;
    color: var(--cream); outline: none; width: 100%;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: rgba(34,197,94,0.4); }
  .form-input::placeholder { color: var(--gray); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stepper {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 10px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .stepper-val {
    font-family: 'DM Mono', monospace;
    font-size: 20px; font-weight: 500; color: var(--cream);
  }
  .stepper-btn {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--felt-light); border: 1px solid var(--border);
    color: var(--cream); font-size: 18px; font-weight: 300;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.15s; user-select: none;
  }
  .stepper-btn:hover { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.3); color: var(--green-bright); }
  .stepper-label { font-size: 11px; color: var(--gray); margin-top: 2px; text-align: center; }
  .window-options { display: flex; gap: 8px; }
  .window-opt {
    flex: 1; padding: 10px 8px; border-radius: 12px; text-align: center;
    background: var(--surface); border: 1px solid var(--border);
    font-size: 13px; font-weight: 500; color: var(--gray); cursor: pointer;
    transition: all 0.2s;
  }
  .window-opt.selected { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.08); color: var(--green-bright); }
  .section-divider {
    display: flex; align-items: center; gap: 10px; margin: 4px 0;
  }
  .section-divider-line { flex: 1; height: 1px; background: var(--border); }
  .section-divider-text { font-size: 11px; color: var(--gray); letter-spacing: 0.08em; text-transform: uppercase; }

  /* ── Host RSVP Manager ── */
  .host-rsvp-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 12px 16px;
    display: flex; align-items: center; gap: 12px;
    transition: all 0.2s;
  }
  .host-rsvp-card.confirmed-card { border-color: rgba(34,197,94,0.2); }
  .host-rsvp-card.waitlist-card  { border-color: rgba(201,168,76,0.2); }
  .host-rsvp-card.declined-card  { opacity: 0.5; }
  .host-rsvp-card.no-response-card { border-style: dashed; }
  .host-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dot-confirmed  { background: var(--green-bright); }
  .dot-waitlisted { background: var(--gold); }
  .dot-declined   { background: var(--red); }
  .dot-noresp     { background: var(--gray); border: 1px solid var(--gray); background: transparent; }
  .host-player-name { flex: 1; font-size: 14px; font-weight: 500; color: var(--cream); }
  .host-action-btn {
    font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
    padding: 5px 10px; border-radius: 8px; cursor: pointer; border: none;
    transition: all 0.15s;
  }
  .hbtn-move-up  { background: rgba(34,197,94,0.12); color: var(--green-bright); }
  .hbtn-remove   { background: rgba(224,82,82,0.1);  color: var(--red); }
  .hbtn-remind   { background: rgba(138,154,142,0.1); color: var(--gray); }
  .rsvp-section-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px; margin-top: 16px;
  }
  .rsvp-section-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--gray);
  }
  .rsvp-section-count {
    font-family: 'DM Mono', monospace;
    font-size: 12px; font-weight: 500;
  }

  /* ── Settlement ── */
  .settle-hero {
    margin: 0 16px 20px;
    background: linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(15,35,24,0.8) 100%);
    border: 1px solid var(--border-gold); border-radius: 20px; padding: 20px;
    text-align: center;
  }
  .settle-icon { font-size: 32px; margin-bottom: 8px; }
  .settle-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 700; color: var(--cream);
  }
  .settle-sub { font-size: 13px; color: var(--gray); margin-top: 4px; }
  .reconcile-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--border);
  }
  .reconcile-row:last-child { border-bottom: none; }
  .recon-label { font-size: 13px; color: var(--gray); }
  .recon-val {
    font-family: 'DM Mono', monospace;
    font-size: 14px; font-weight: 500; color: var(--cream);
  }
  .recon-val.gold { color: var(--gold); }
  .recon-val.green { color: var(--green-bright); }
  .recon-val.red { color: var(--red); }
  .settle-txn-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 14px 16px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 12px;
  }
  .settle-txn-card.done { opacity: 0.45; }
  .settle-from { font-size: 14px; font-weight: 500; color: var(--red); }
  .settle-arrow { color: var(--gray); font-size: 14px; }
  .settle-to   { font-size: 14px; font-weight: 500; color: var(--green-bright); flex: 1; }
  .settle-amt  {
    font-family: 'DM Mono', monospace;
    font-size: 15px; font-weight: 600; color: var(--gold);
  }
  .settle-check {
    width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; transition: all 0.2s; color: transparent;
  }
  .settle-check.checked { background: rgba(34,197,94,0.15); border-color: var(--green-bright); color: var(--green-bright); }
  .recon-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 16px; margin: 0 16px 20px;
  }
  .recon-card.ok { border-color: rgba(34,197,94,0.25); background: rgba(34,197,94,0.04); }
  .recon-card.err { border-color: rgba(224,82,82,0.25); background: rgba(224,82,82,0.04); }
  .recon-card-title {
    font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; margin-bottom: 12px;
  }
  .ok .recon-card-title { color: var(--green-bright); }
  .err .recon-card-title { color: var(--red); }

  /* ── End Game flow ── */
  .end-step-indicator {
    display: flex; gap: 6px; padding: 0 24px; margin-bottom: 24px;
  }
  .end-step-dot {
    flex: 1; height: 3px; border-radius: 2px; background: var(--border);
    transition: background 0.3s;
  }
  .end-step-dot.done { background: var(--green-bright); }
  .end-step-dot.active { background: var(--gold); }
  .cashout-grid { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
  .cashout-row {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 12px 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .cashout-row.done-row { opacity: 0.5; border-color: rgba(34,197,94,0.2); }
  .cashout-info { flex: 1; }
  .cashout-name { font-size: 14px; font-weight: 500; color: var(--cream); }
  .cashout-bought { font-size: 12px; color: var(--gray); margin-top: 2px; }
  .cashout-bought span { font-family: 'DM Mono', monospace; color: var(--gold); }
  .chip-input-wrap { display: flex; align-items: center; gap: 6px; }
  .chip-input {
    width: 70px; background: var(--felt-light); border: 1px solid var(--border);
    border-radius: 10px; padding: 7px 10px; text-align: center;
    font-family: 'DM Mono', monospace; font-size: 14px; color: var(--cream);
    outline: none;
  }
  .chip-input:focus { border-color: rgba(34,197,94,0.4); }
  .chip-unit { font-size: 11px; color: var(--gray); }
  .cashout-btn-sm {
    padding: 7px 14px; border-radius: 10px; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
    background: rgba(34,197,94,0.12); color: var(--green-bright);
    transition: all 0.15s;
  }
  .cashout-btn-sm:hover { background: rgba(34,197,94,0.2); }
  .cashout-net {
    font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 600;
  }
`;


function StatusBar() {
  return (
    <div className="status-bar">
      <span className="time">9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <span>●●●</span>
        <span>WiFi</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

function Avatar({ name, type = "default", size = 34 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const cls = type === "green" ? "avatar green-av" : type === "gold" ? "avatar gold-av" : "avatar";
  return <div className={cls} style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</div>;
}

function HomeScreen({ onNavigate, showToast, onCreateGame }) {
  const [filter, setFilter] = useState("all");

  return (
    <div className="screen">
      <StatusBar />
      <div className="top-bar">
        <div className="wordmark">Poker<span>Night</span></div>
        <div style={{ display: "flex", gap: 8 }}>
          <div className="icon-btn" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "var(--green-bright)", fontSize: 13, fontWeight: 700, width: "auto", padding: "0 12px", gap: 4 }}
            onClick={onCreateGame}>
            + Game
          </div>
          <div className="icon-btn" onClick={() => showToast("🔔", "Notifications", "2 new updates")}>🔔</div>
          <div className="icon-btn" onClick={() => onNavigate("profile")}>
            <Avatar name="You" size={24} />
          </div>
        </div>
      </div>

      <div className="greeting">
        <div className="greeting-sub">Good evening,</div>
        <div className="greeting-name">Welcome back, <span>Arjun.</span></div>
      </div>

      <div className="stats-strip">
        <div className="stat-chip">
          <div className="stat-val cream">22</div>
          <div className="stat-lbl">Games</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val gold">117</div>
          <div className="stat-lbl">Points</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val green">#3</div>
          <div className="stat-lbl">Rank</div>
        </div>
      </div>

      <div className="chip-cards">
        {["All", "Tonight", "This Week", "Invited"].map(f => (
          <div key={f} className={`chip-card ${filter === f.toLowerCase() ? "active" : ""}`}
            onClick={() => setFilter(f.toLowerCase())}>
            <div className="chip-card-val">{f}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Upcoming Games</div>
      <div className="games-list">
        {GAMES.map(game => {
          const pct = (game.confirmed / game.max) * 100;
          const fillCls = pct >= 100 ? "seat-bar-fill full-bar" : pct >= 78 ? "seat-bar-fill almost" : "seat-bar-fill";
          const pillCls = game.myRsvp === "confirmed" ? "rsvp-pill pill-confirmed" :
            game.myRsvp === "waitlisted" ? "rsvp-pill pill-waitlisted" : "rsvp-pill pill-invited";
          const pillText = game.myRsvp === "confirmed" ? "Confirmed" :
            game.myRsvp === "waitlisted" ? "Waitlisted" : "Invited";
          return (
            <div key={game.id} className={`game-card ${game.myRsvp === "confirmed" ? "featured" : ""} ${game.status === "full" ? "full" : ""}`}
              onClick={() => onNavigate("game-detail", game)}>
              <div className="card-header">
                <div>
                  <div className="card-title">{game.name}</div>
                  <div className="card-host">Hosted by {game.host}</div>
                </div>
                <div className={pillCls}>{pillText}</div>
              </div>
              <div className="card-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span className="meta-text"><strong>{game.date}</strong></span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🕐</span>
                  <span className="meta-text"><strong>{game.time}</strong></span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">📍</span>
                  <span className="meta-text" style={{ fontSize: 11 }}>{game.location.split(",")[0]}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🏦</span>
                  <span className="meta-text"><strong>{game.banks}B</strong> buy-in</span>
                </div>
              </div>
              <div className="seat-bar">
                <div className="seat-bar-track">
                  <div className={fillCls} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="seat-info">
                  <span>{game.confirmed}/{game.max} confirmed</span>
                  <span>{game.waitlist > 0 ? `${game.waitlist} waitlisted` : "Seats available"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

function GameDetailScreen({ game, onBack, onNavigate, showToast }) {
  const [rsvp, setRsvp] = useState(game.myRsvp);

  const handleConfirm = () => {
    setRsvp("confirmed");
    showToast("✅", "RSVP Confirmed", `You're in for ${game.name}`);
  };
  const handleDecline = () => {
    setRsvp("declined");
    showToast("👋", "RSVP Declined", "You've declined this game");
  };
  const handleJoinWaitlist = () => {
    setRsvp("waitlisted");
    showToast("⏳", "Added to Waitlist", "You're #1 on the waitlist");
  };

  const isGameFull = game.confirmed >= game.max;

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: "8px 24px 0" }}>
        <div className="back-btn" onClick={onBack}>← Back</div>
      </div>

      <div className="detail-hero">
        <div className="detail-title">{game.name}</div>
        <div className="detail-host">Hosted by <span>{game.host}</span></div>
      </div>

      <div className="detail-meta-grid">
        <div className="detail-meta-card">
          <div className="dmc-label">Date & Time</div>
          <div className="dmc-value">{game.date}</div>
          <div style={{ fontSize: 13, color: "var(--gray)", marginTop: 2 }}>{game.time}</div>
        </div>
        <div className="detail-meta-card">
          <div className="dmc-label">Location</div>
          <div className="dmc-value" style={{ fontSize: 13 }}>{game.location}</div>
        </div>
        <div className="detail-meta-card">
          <div className="dmc-label">Buy-in</div>
          <div className="dmc-value gold">{game.banks} Bank{game.banks > 1 ? "s" : ""}</div>
        </div>
        <div className="detail-meta-card">
          <div className="dmc-label">Rake</div>
          <div className="dmc-value" style={{ color: game.rake > 0 ? "var(--red)" : "var(--green-bright)" }}>
            {game.rake > 0 ? `${game.rake} Bank${game.rake > 1 ? "s" : ""}` : "No rake"}
          </div>
        </div>
      </div>

      {/* RSVP Actions */}
      <div className="rsvp-actions">
        {rsvp === "confirmed" ? (
          <>
            <div className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "var(--green-bright)", cursor: "default" }}>
              ✓ You're Confirmed
            </div>
            <button className="btn-danger" onClick={handleDecline}>Cancel</button>
          </>
        ) : rsvp === "waitlisted" ? (
          <>
            <div style={{ flex: 1, background: "rgba(201,168,76,0.08)", border: "1px solid var(--border-gold)", borderRadius: 14, height: 50, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: 13, fontWeight: 600 }}>
              ⏳ On Waitlist
            </div>
            <button className="btn-secondary" onClick={() => setRsvp("invited")}>Leave</button>
          </>
        ) : rsvp === "declined" ? (
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setRsvp("invited")}>
            Change mind? RSVP again
          </button>
        ) : isGameFull ? (
          <button className="btn-gold" onClick={handleJoinWaitlist}>Join Waitlist</button>
        ) : (
          <>
            <button className="btn-primary" onClick={handleConfirm}>Confirm Seat</button>
            <button className="btn-secondary" onClick={handleDecline}>Decline</button>
          </>
        )}
      </div>

      {/* Confirmed Players */}
      <div className="rsvp-section">
        <div className="rsvp-header">
          <div className="rsvp-title">CONFIRMED PLAYERS</div>
          <div className="rsvp-count"><span>{game.confirmed}</span>/{game.max} seats</div>
        </div>
        <div className="player-list">
          {game.confirmedPlayers.map((name, i) => {
            const isMe = name === "You";
            const isHost = name === game.host;
            return (
              <div key={i} className={`player-row ${isMe ? "me" : ""}`}>
                <Avatar name={isMe ? "Me" : name} type={isMe ? "green" : isHost ? "gold" : "default"} />
                <div className={`player-name ${isMe ? "me-name" : ""}`}>{isMe ? "You" : name}</div>
                {isHost && <span className="player-badge badge-host">Host</span>}
                {isMe && <span className="player-badge badge-you">You</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Waitlist */}
      {(game.waitlistPlayers.length > 0 || game.myRsvp === "waitlisted") && (
        <div className="rsvp-section">
          <div className="rsvp-header">
            <div className="rsvp-title" style={{ color: "var(--gold)" }}>WAITLIST</div>
            <div className="rsvp-count"><span style={{ color: "var(--gold)" }}>{game.waitlistPlayers.length}</span>/{game.maxWait} slots</div>
          </div>
          <div className="player-list">
            {game.waitlistPlayers.map((name, i) => {
              const isMe = name === "You";
              return (
                <div key={i} className={`player-row waitlist-row ${isMe ? "me" : ""}`}>
                  <Avatar name={isMe ? "Me" : name} type={isMe ? "green" : "default"} />
                  <div className={`player-name ${isMe ? "me-name" : ""}`}>{isMe ? "You" : name}</div>
                  <span className="waitlist-num">#{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  );
}

function LiveGameScreen({ showToast, onNavigate }) {
  const [players, setPlayers] = useState(LIVE_PLAYERS);
  const [expanded, setExpanded] = useState({});
  const rake = 1;
  const totalIn = players.reduce((s, p) => s + p.bought, 0);

  const now = () => {
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const handleBuyIn = (idx) => {
    const p = players[idx];
    if (p.cashedOut) return;
    const ts = now();
    const updated = [...players];
    updated[idx] = {
      ...p,
      bought: p.bought + 1,
      rebuys: [...p.rebuys, { ts, bank: 1, isNew: true }],
    };
    setPlayers(updated);
    // Auto-expand the log for this player on rebuy
    setExpanded(prev => ({ ...prev, [idx]: true }));
    showToast("🏦", "Rebuy Recorded", `${p.name} — ${updated[idx].bought} banks · ${ts}`);
    // Fade the "new" highlight after 4s
    setTimeout(() => {
      setPlayers(cur => {
        const next = [...cur];
        next[idx] = {
          ...next[idx],
          rebuys: next[idx].rebuys.map(r => ({ ...r, isNew: false })),
        };
        return next;
      });
    }, 4000);
  };

  const toggleExpand = (idx) =>
    setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: "8px 24px 0" }}>
        <div className="live-badge">
          <div className="live-dot" />
          <span className="live-badge-text">Live Game</span>
        </div>
        <div className="live-title">Friday Night Felts</div>
        <div style={{ fontSize: 13, color: "var(--gray)", marginTop: 4 }}>Hosted by Raj K. · 8 players active</div>
      </div>

      <div style={{ height: 20 }} />

      <div className="bank-tracker">
        <div className="tracker-label">Banks in Play</div>
        <div className="tracker-main">{totalIn - rake}B</div>
        <div className="tracker-sub">
          <div className="tracker-sub-item">
            <div className="tracker-sub-label">Total In</div>
            <div className="tracker-sub-val">{totalIn}B</div>
          </div>
          <div className="tracker-sub-item">
            <div className="tracker-sub-label">Rake</div>
            <div className="tracker-sub-val gold">{rake}B</div>
          </div>
          <div className="tracker-sub-item">
            <div className="tracker-sub-label">Active</div>
            <div className="tracker-sub-val">{players.filter(p => !p.cashedOut).length}</div>
          </div>
        </div>
      </div>

      <div className="section-label">Players</div>
      <div className="live-players">
        {players.map((p, i) => {
          const isOpen = expanded[i];
          const rebuysOnly = p.rebuys;
          const hasHistory = rebuysOnly.length > 0;

          return (
            <div key={i} className={`live-player-card ${p.cashedOut ? "cashed" : ""} ${p.isMe ? "me-live" : ""} ${isOpen ? "expanded" : ""}`}
              style={{ flexDirection: "column", alignItems: "stretch" }}>

              {/* Main row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={p.isMe ? "Me" : p.name} type={p.isMe ? "green" : p.host ? "gold" : "default"} />
                <div className="player-info" style={{ flex: 1 }}>
                  <div className={`player-info-name ${p.isMe ? "me-live-name" : ""}`}>
                    {p.isMe ? "You" : p.name}
                    {p.host && <span style={{ fontSize: 10, color: "var(--gold)", marginLeft: 6, fontWeight: 600 }}>HOST</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <div className="player-info-banks">
                      <span>{p.bought}B</span> bought in
                      {p.cashedOut && " · cashed out"}
                    </div>
                    {hasHistory && (
                      <div className="expand-toggle" onClick={() => toggleExpand(i)}>
                        {isOpen ? "▲" : "▼"} {rebuysOnly.length} rebuy{rebuysOnly.length > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                </div>
                {p.cashedOut ? (
                  <div className={`net-badge ${p.net > 0 ? "net-pos" : p.net < 0 ? "net-neg" : "net-out"}`}>
                    {p.net > 0 ? `+${p.net}B` : p.net < 0 ? `${p.net}B` : "EVEN"}
                  </div>
                ) : (
                  <div className="buy-btn" onClick={() => handleBuyIn(i)}>+</div>
                )}
              </div>

              {/* Rebuy log — expanded */}
              {isOpen && hasHistory && (
                <div className="rebuy-log">
                  <div className="rebuy-log-title">Transaction Log</div>

                  {/* Initial buy-in row */}
                  <div className="rebuy-row">
                    <div className="rebuy-pip initial" />
                    <span className="rebuy-ts">8:00 PM</span>
                    <span className="rebuy-label initial-label">Buy-in · 1B</span>
                  </div>

                  {/* Rebuys */}
                  {rebuysOnly.map((r, ri) => (
                    <div key={ri} className="rebuy-row">
                      <div className={`rebuy-pip ${r.isNew ? "new-pip" : ""}`} />
                      <span className={`rebuy-ts ${r.isNew ? "new-ts" : ""}`}>{r.ts}</span>
                      <span className={`rebuy-label ${r.isNew ? "rebuy-label-new" : "rebuy-label-gold"}`}>
                        Rebuy #{ri + 1} · {r.bank}B
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <button className="btn-danger" style={{ width: "100%", fontSize: 15 }}
          onClick={() => onNavigate("end-game")}>
          End Game
        </button>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

function LeaderboardScreen() {
  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: "8px 24px 0" }}>
        <div className="lb-header">
          <div className="lb-title">Leaderboard</div>
          <div className="lb-sub">Points — All time · 8 players</div>
        </div>
      </div>

      {/* Podium */}
      <div className="podium">
        <div className="podium-spot podium-2">
          <div className="podium-avatar">{top3[1].name.split(" ").map(w=>w[0]).join("")}</div>
          <div className="podium-name">{top3[1].name.split(" ")[0]}</div>
          <div className="podium-pts">{top3[1].points}pts</div>
          <div className="podium-block" />
        </div>
        <div className="podium-spot podium-1">
          <div className="podium-avatar" style={{ position: "relative" }}>
            <span className="podium-crown">👑</span>
            {top3[0].name.split(" ").map(w=>w[0]).join("")}
          </div>
          <div className="podium-name">{top3[0].name.split(" ")[0]}</div>
          <div className="podium-pts">{top3[0].points}pts</div>
          <div className="podium-block" />
        </div>
        <div className="podium-spot podium-3">
          <div className="podium-avatar">{top3[2].name.split(" ").map(w=>w[0]).join("")}</div>
          <div className="podium-name" style={{ color: "var(--green-bright)", fontWeight: 700 }}>{top3[2].name.split(" ")[0]}</div>
          <div className="podium-pts" style={{ color: "var(--green-bright)" }}>{top3[2].points}pts</div>
          <div className="podium-block" />
        </div>
      </div>

      <div className="lb-list">
        {rest.map((p) => (
          <div key={p.rank} className={`lb-row ${p.isMe ? "me-row" : ""}`}>
            <div className={`lb-rank ${p.rank <= 3 ? "top" : ""}`}>#{p.rank}</div>
            <Avatar name={p.isMe ? "Me" : p.name} type={p.isMe ? "green" : "default"} />
            <div style={{ flex: 1 }}>
              <div className={`lb-name ${p.isMe ? "me-name" : ""}`}>{p.isMe ? "You" : p.name}</div>
              <div className="lb-games">{p.games} games · {p.wins} wins</div>
            </div>
            <div className="lb-pts">{p.points}</div>
            <div className={`lb-trend ${p.trend.startsWith("+") ? "trend-up" : p.trend.startsWith("-") ? "trend-down" : "trend-flat"}`}>
              {p.trend === "0" ? "—" : p.trend}
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

function ProfileScreen() {
  const history = [
    { name: "Friday Night Felts", host: "Raj K.", date: "Apr 11", banks: "+1.5", result: "win", pts: "+4" },
    { name: "Saturday Shootout", host: "Priya S.", date: "Apr 5", banks: "-2", result: "loss", pts: "+1" },
    { name: "Sunday Deep Stack", host: "Dev P.", date: "Mar 30", banks: "+3.5", result: "win", pts: "+5" },
    { name: "Friday Night Felts", host: "Raj K.", date: "Mar 21", banks: "0", result: "break", pts: "+1" },
    { name: "Monthly Classic", host: "Karan B.", date: "Mar 15", banks: "-1", result: "loss", pts: "+1" },
  ];

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: "8px 24px 0" }}>
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">A</div>
            <div>
              <div className="profile-name">Arjun Mehta</div>
              <div className="profile-rank">Ranked <span>#3</span> · 117 points</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <div className="ps-val cream">22</div>
          <div className="ps-lbl">Games</div>
        </div>
        <div className="profile-stat">
          <div className="ps-val green">8</div>
          <div className="ps-lbl">Wins</div>
        </div>
        <div className="profile-stat">
          <div className="ps-val gold">117</div>
          <div className="ps-lbl">Points</div>
        </div>
        <div className="profile-stat">
          <div className="ps-val" style={{ color: "var(--green-bright)", fontSize: 18 }}>+6.5B</div>
          <div className="ps-lbl">Best Win</div>
        </div>
        <div className="profile-stat">
          <div className="ps-val" style={{ color: "var(--red)", fontSize: 18 }}>-3B</div>
          <div className="ps-lbl">Worst</div>
        </div>
        <div className="profile-stat">
          <div className="ps-val" style={{ color: "var(--gold)", fontSize: 18 }}>36%</div>
          <div className="ps-lbl">Win Rate</div>
        </div>
      </div>

      <div className="section-label">Game History</div>
      <div className="history-list">
        {history.map((h, i) => (
          <div key={i} className="history-row">
            <div className={`history-dot ${h.result === "win" ? "dot-win" : h.result === "loss" ? "dot-loss" : "dot-break"}`} />
            <div className="history-info">
              <div className="history-game">{h.name}</div>
              <div className="history-meta">{h.host} · {h.date}</div>
            </div>
            <div className="history-result">
              <div className={`history-banks ${h.result === "win" ? "result-win" : h.result === "loss" ? "result-loss" : "result-break"}`}>
                {h.result === "break" ? "Even" : `${h.banks}B`}
              </div>
              <div className="history-pts">{h.pts} pts</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE GAME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function CreateGameScreen({ onBack, onNavigate, showToast }) {
  const [form, setForm] = useState({ name: "", date: "", time: "", location: "", banks: 1, rake: 0, window: "30" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCreate = () => {
    if (!form.name || !form.date || !form.time) {
      showToast("⚠️", "Missing Details", "Name, date and time are required");
      return;
    }
    showToast("🎉", "Game Created!", `${form.name} is live — share the invite link`);
    setTimeout(() => onNavigate("host-rsvp"), 800);
  };

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: "8px 24px 20px" }}>
        <div className="back-btn" onClick={onBack}>← Back</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--cream)", letterSpacing: "-0.02em" }}>
          Create Game
        </div>
        <div style={{ fontSize: 13, color: "var(--gray)", marginTop: 4 }}>Set up your next session</div>
      </div>

      <div className="create-form">
        {/* Game name */}
        <div className="form-group">
          <div className="form-label">Game Name</div>
          <input className="form-input" placeholder="e.g. Friday Night Felts"
            value={form.name} onChange={e => set("name", e.target.value)} />
        </div>

        {/* Date & Time */}
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">Date</div>
            <input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)}
              style={{ colorScheme: "dark" }} />
          </div>
          <div className="form-group">
            <div className="form-label">Time</div>
            <input className="form-input" type="time" value={form.time} onChange={e => set("time", e.target.value)}
              style={{ colorScheme: "dark" }} />
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <div className="form-label">Location</div>
          <input className="form-input" placeholder="Venue name or address"
            value={form.location} onChange={e => set("location", e.target.value)} />
        </div>

        <div className="section-divider">
          <div className="section-divider-line" />
          <div className="section-divider-text">Game Settings</div>
          <div className="section-divider-line" />
        </div>

        {/* Buy-in & Rake steppers */}
        <div className="form-row">
          <div className="form-group">
            <div className="form-label">Buy-in</div>
            <div className="stepper">
              <div className="stepper-btn" onClick={() => set("banks", Math.max(1, form.banks - 1))}>−</div>
              <div style={{ textAlign: "center" }}>
                <div className="stepper-val" style={{ color: "var(--gold)" }}>{form.banks}B</div>
                <div className="stepper-label">banks</div>
              </div>
              <div className="stepper-btn" onClick={() => set("banks", form.banks + 1)}>+</div>
            </div>
          </div>
          <div className="form-group">
            <div className="form-label">Rake</div>
            <div className="stepper">
              <div className="stepper-btn" onClick={() => set("rake", Math.max(0, form.rake - 1))}>−</div>
              <div style={{ textAlign: "center" }}>
                <div className="stepper-val" style={{ color: form.rake > 0 ? "var(--red)" : "var(--gray)" }}>
                  {form.rake > 0 ? `${form.rake}B` : "—"}
                </div>
                <div className="stepper-label">{form.rake > 0 ? "rake" : "no rake"}</div>
              </div>
              <div className="stepper-btn" onClick={() => set("rake", form.rake + 1)}>+</div>
            </div>
          </div>
        </div>

        <div className="section-divider">
          <div className="section-divider-line" />
          <div className="section-divider-text">Waitlist Window</div>
          <div className="section-divider-line" />
        </div>

        {/* Waitlist acceptance window */}
        <div className="form-group">
          <div className="form-label">Seat offer expires after</div>
          <div className="window-options">
            {["15", "30", "60"].map(w => (
              <div key={w} className={`window-opt ${form.window === w ? "selected" : ""}`}
                onClick={() => set("window", w)}>
                {w} min
              </div>
            ))}
          </div>
        </div>

        {/* Summary card */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 16, marginTop: 4 }}>
          <div style={{ fontSize: 11, color: "var(--gray)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Game Summary</div>
          {[
            ["Max Players", "9 confirmed + 2 waitlist"],
            ["Buy-in", `${form.banks} bank${form.banks > 1 ? "s" : ""} per player`],
            ["Rake", form.rake > 0 ? `${form.rake} bank${form.rake > 1 ? "s" : ""} (game total)` : "None"],
            ["Seat window", `${form.window} minutes to accept`],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 13, color: "var(--gray)" }}>{l}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--cream)" }}>{v}</span>
            </div>
          ))}
        </div>

        <button className="btn-primary" style={{ marginTop: 4 }} onClick={handleCreate}>
          Create &amp; Get Invite Link
        </button>
        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOST RSVP MANAGEMENT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_RSVP_PLAYERS = [
  { name: "Raj K.", status: "confirmed", isHost: true },
  { name: "Priya S.", status: "confirmed" },
  { name: "Arjun M.", status: "confirmed" },
  { name: "Neha R.", status: "confirmed" },
  { name: "Dev P.", status: "confirmed" },
  { name: "Sana T.", status: "waitlisted", wlPos: 1 },
  { name: "Karan B.", status: "waitlisted", wlPos: 2 },
  { name: "Meera J.", status: "declined" },
  { name: "Vikram S.", status: "no-response" },
  { name: "Aditya K.", status: "no-response" },
];

function HostRSVPScreen({ onBack, onNavigate, showToast }) {
  const [players, setPlayers] = useState(INITIAL_RSVP_PLAYERS);
  const [countdown, setCountdown] = useState(null);

  const confirmed  = players.filter(p => p.status === "confirmed");
  const waitlisted = players.filter(p => p.status === "waitlisted").sort((a, b) => a.wlPos - b.wlPos);
  const declined   = players.filter(p => p.status === "declined");
  const noResp     = players.filter(p => p.status === "no-response");

  const promoteWaitlist = (name) => {
    if (confirmed.length >= 9) { showToast("⚠️", "Game Full", "Remove a confirmed player first"); return; }
    setPlayers(prev => prev.map(p => p.name === name ? { ...p, status: "confirmed", wlPos: undefined } : p)
      .map(p => p.status === "waitlisted" ? { ...p, wlPos: p.wlPos - 1 } : p));
    showToast("✅", "Promoted!", `${name} moved to confirmed`);
  };

  const removePlayer = (name) => {
    setPlayers(prev => {
      const removed = prev.find(p => p.name === name);
      let updated = prev.map(p => p.name === name ? { ...p, status: "declined" } : p);
      // If confirmed was removed and there's a waitlisted player, trigger seat offer
      if (removed?.status === "confirmed" && updated.some(p => p.status === "waitlisted")) {
        const firstWL = updated.filter(p => p.status === "waitlisted").sort((a, b) => a.wlPos - b.wlPos)[0];
        setCountdown({ name: firstWL.name, mins: 30 });
        showToast("🔔", "Seat Offered", `${firstWL.name} has 30 min to accept`);
      } else {
        showToast("👋", "Player Removed", `${name} moved to declined`);
      }
      return updated;
    });
  };

  const remind = (name) => showToast("🔔", "Reminder Sent", `Push notification sent to ${name}`);

  const statusDot = (s) => {
    const cls = s === "confirmed" ? "dot-confirmed" : s === "waitlisted" ? "dot-waitlisted" : s === "declined" ? "dot-declined" : "dot-noresp";
    return <div className={`host-status-dot ${cls}`} />;
  };

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: "8px 24px 16px" }}>
        <div className="back-btn" onClick={onBack}>← Back</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--cream)", letterSpacing: "-0.02em" }}>
          Friday Night Felts
        </div>
        <div style={{ fontSize: 13, color: "var(--gray)", marginTop: 3 }}>Tonight · 8:00 PM · RSVP Dashboard</div>
      </div>

      {/* Summary strip */}
      <div className="stats-strip" style={{ marginBottom: 16 }}>
        <div className="stat-chip">
          <div className="stat-val green">{confirmed.length}<span style={{ fontSize: 14, color: "var(--gray)" }}>/9</span></div>
          <div className="stat-lbl">Confirmed</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val gold">{waitlisted.length}<span style={{ fontSize: 14, color: "var(--gray)" }}>/2</span></div>
          <div className="stat-lbl">Waitlist</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val" style={{ color: "var(--gray)" }}>{noResp.length}</div>
          <div className="stat-lbl">No Reply</div>
        </div>
      </div>

      {/* Countdown banner */}
      {countdown && (
        <div style={{ margin: "0 16px 16px", background: "rgba(201,168,76,0.1)", border: "1px solid var(--border-gold)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>⏳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>Seat Offer Active</div>
            <div style={{ fontSize: 12, color: "var(--gray)", marginTop: 2 }}>{countdown.name} has {countdown.mins} min to accept</div>
          </div>
          <div style={{ fontFamily: "'DM Mono'", fontSize: 16, fontWeight: 600, color: "var(--gold)" }}>30:00</div>
        </div>
      )}

      {/* Invite link bar */}
      <div style={{ margin: "0 16px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>🔗</span>
        <div style={{ flex: 1, fontSize: 12, color: "var(--gray)", fontFamily: "'DM Mono'", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          pokernight.app/join/fnf-apr18
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--green-bright)", cursor: "pointer" }}
          onClick={() => showToast("📋", "Copied!", "Invite link copied to clipboard")}>
          Copy
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* Confirmed */}
        <div className="rsvp-section-header">
          <div className="rsvp-section-title">Confirmed</div>
          <div className="rsvp-section-count" style={{ color: "var(--green-bright)" }}>{confirmed.length} / 9</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
          {confirmed.map(p => (
            <div key={p.name} className="host-rsvp-card confirmed-card">
              {statusDot("confirmed")}
              <div className="host-player-name">
                {p.name}
                {p.isHost && <span style={{ fontSize: 10, color: "var(--gold)", marginLeft: 6, fontWeight: 700 }}>HOST</span>}
              </div>
              {!p.isHost && (
                <button className="host-action-btn hbtn-remove" onClick={() => removePlayer(p.name)}>Remove</button>
              )}
            </div>
          ))}
        </div>

        {/* Waitlist */}
        <div className="rsvp-section-header">
          <div className="rsvp-section-title" style={{ color: "var(--gold)" }}>Waitlist</div>
          <div className="rsvp-section-count" style={{ color: "var(--gold)" }}>{waitlisted.length} / 2</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
          {waitlisted.map(p => (
            <div key={p.name} className="host-rsvp-card waitlist-card">
              {statusDot("waitlisted")}
              <div className="host-player-name">
                {p.name}
                <span style={{ fontSize: 11, color: "var(--gold)", marginLeft: 6, fontFamily: "'DM Mono'" }}>#{p.wlPos}</span>
              </div>
              {confirmed.length < 9 && (
                <button className="host-action-btn hbtn-move-up" onClick={() => promoteWaitlist(p.name)}>Promote</button>
              )}
            </div>
          ))}
          {waitlisted.length === 0 && (
            <div style={{ fontSize: 13, color: "var(--gray)", padding: "8px 0" }}>No players on waitlist</div>
          )}
        </div>

        {/* No Response */}
        {noResp.length > 0 && <>
          <div className="rsvp-section-header">
            <div className="rsvp-section-title">No Response</div>
            <div className="rsvp-section-count" style={{ color: "var(--gray)" }}>{noResp.length}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
            {noResp.map(p => (
              <div key={p.name} className="host-rsvp-card no-response-card">
                {statusDot("no-response")}
                <div className="host-player-name">{p.name}</div>
                <button className="host-action-btn hbtn-remind" onClick={() => remind(p.name)}>Remind</button>
              </div>
            ))}
          </div>
        </>}

        {/* Declined */}
        {declined.length > 0 && <>
          <div className="rsvp-section-header">
            <div className="rsvp-section-title">Declined</div>
            <div className="rsvp-section-count" style={{ color: "var(--red)" }}>{declined.length}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
            {declined.map(p => (
              <div key={p.name} className="host-rsvp-card declined-card">
                {statusDot("declined")}
                <div className="host-player-name">{p.name}</div>
              </div>
            ))}
          </div>
        </>}

        <div style={{ height: 8 }} />
        <button className="btn-primary" onClick={() => onNavigate("end-game")}>
          Start Game
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// END GAME / CASH-OUT FLOW
// ─────────────────────────────────────────────────────────────────────────────
const CASHOUT_PLAYERS = [
  { name: "Raj K.", bought: 3, host: true },
  { name: "Priya S.", bought: 2 },
  { name: "Arjun M.", bought: 4 },
  { name: "Neha R.", bought: 2 },
  { name: "Dev P.", bought: 3 },
  { name: "You", bought: 2, isMe: true },
];

function EndGameScreen({ onBack, onNavigate, showToast }) {
  const rake = 1;
  const [chips, setChips] = useState({});
  const [cashedOut, setCashedOut] = useState({});
  const [step, setStep] = useState("cashout"); // cashout | reconcile

  const totalBought = CASHOUT_PLAYERS.reduce((s, p) => s + p.bought, 0);
  const totalChipsOut = Object.values(chips).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const chipsToBanks = (c) => (c / 100).toFixed(1); // 100 chips = 1 bank
  const totalBanksOut = Object.values(chips).reduce((s, v) => s + (parseFloat(v) / 100 || 0), 0);
  const allCashedOut = CASHOUT_PLAYERS.every(p => cashedOut[p.name]);

  const doCashOut = (name) => {
    const c = parseFloat(chips[name]);
    if (!c && c !== 0) { showToast("⚠️", "Enter Chip Count", `Add chips for ${name}`); return; }
    setCashedOut(prev => ({ ...prev, [name]: true }));
    const banksOut = (c / 100).toFixed(1);
    const bought = CASHOUT_PLAYERS.find(p => p.name === name)?.bought || 0;
    const net = (parseFloat(banksOut) - bought).toFixed(1);
    showToast(parseFloat(net) >= 0 ? "🟢" : "🔴", `${name} cashed out`, `${banksOut}B · Net: ${net >= 0 ? "+" : ""}${net}B`);
  };

  const netFor = (name) => {
    const c = parseFloat(chips[name]) || 0;
    const bought = CASHOUT_PLAYERS.find(p => p.name === name)?.bought || 0;
    return (c / 100 - bought).toFixed(1);
  };

  const reconcileDelta = (totalBought - rake - totalBanksOut).toFixed(2);

  return (
    <div className="screen">
      <StatusBar />
      <div style={{ padding: "8px 24px 16px" }}>
        <div className="back-btn" onClick={onBack}>← Live Game</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--cream)" }}>End Game</div>
        <div style={{ fontSize: 13, color: "var(--gray)", marginTop: 3 }}>Friday Night Felts</div>
      </div>

      {/* Step indicator */}
      <div className="end-step-indicator">
        <div className={`end-step-dot ${step === "cashout" ? "active" : "done"}`} />
        <div className={`end-step-dot ${step === "reconcile" ? "active" : step === "settle" ? "done" : ""}`} />
      </div>

      {step === "cashout" && <>
        <div style={{ padding: "0 24px 16px", fontSize: 13, color: "var(--gray)" }}>
          Enter chip count for each player, then confirm cash-out.
        </div>

        {/* Bank tracker summary */}
        <div style={{ margin: "0 16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {[["Total In", `${totalBought}B`, "var(--cream)"], ["Rake", `${rake}B`, "var(--gold)"], ["Expected Out", `${totalBought - rake}B`, "var(--green-bright)"]].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Mono'", fontSize: 16, fontWeight: 500, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: "var(--gray)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cashout-grid">
          {CASHOUT_PLAYERS.map(p => {
            const done = cashedOut[p.name];
            const net = done ? netFor(p.name) : null;
            return (
              <div key={p.name} className={`cashout-row ${done ? "done-row" : ""}`}>
                <Avatar name={p.isMe ? "Me" : p.name} type={p.isMe ? "green" : p.host ? "gold" : "default"} />
                <div className="cashout-info">
                  <div className="cashout-name">
                    {p.isMe ? "You" : p.name}
                    {p.host && <span style={{ fontSize: 10, color: "var(--gold)", marginLeft: 6 }}>HOST</span>}
                  </div>
                  <div className="cashout-bought">Bought in: <span>{p.bought}B</span></div>
                </div>
                {done ? (
                  <div className="cashout-net" style={{ color: parseFloat(net) >= 0 ? "var(--green-bright)" : "var(--red)" }}>
                    {parseFloat(net) >= 0 ? "+" : ""}{net}B
                  </div>
                ) : (
                  <div className="chip-input-wrap">
                    <input className="chip-input" type="number" placeholder="0"
                      value={chips[p.name] || ""}
                      onChange={e => setChips(prev => ({ ...prev, [p.name]: e.target.value }))} />
                    <span className="chip-unit">chips</span>
                    <button className="cashout-btn-sm" onClick={() => doCashOut(p.name)}>Out</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "20px 16px 0" }}>
          <button className="btn-primary"
            style={{ width: "100%", opacity: allCashedOut ? 1 : 0.5 }}
            onClick={() => { if (allCashedOut) setStep("reconcile"); else showToast("⚠️", "Not Done", "Cash out all players first"); }}>
            Reconcile &amp; Settle →
          </button>
        </div>
        <div style={{ height: 20 }} />
      </>}

      {step === "reconcile" && (
        <SettlementScreen
          players={CASHOUT_PLAYERS} chips={chips} rake={rake}
          totalBought={totalBought} delta={reconcileDelta}
          onNavigate={onNavigate} showToast={showToast}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTLEMENT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function SettlementScreen({ players, chips, rake, totalBought, delta, onNavigate, showToast }) {
  const [settled, setSettled] = useState({});

  // Compute net positions
  const positions = players.map(p => {
    const chipVal = (parseFloat(chips?.[p.name]) || 0) / 100;
    return { name: p.name, net: parseFloat((chipVal - p.bought).toFixed(2)) };
  });

  // Minimum transaction algorithm
  const txns = (() => {
    const debtors  = positions.filter(p => p.net < 0).map(p => ({ ...p, rem: -p.net })).sort((a, b) => b.rem - a.rem);
    const creditors = positions.filter(p => p.net > 0).map(p => ({ ...p, rem: p.net })).sort((a, b) => b.rem - a.rem);
    const out = [];
    let di = 0, ci = 0;
    while (di < debtors.length && ci < creditors.length) {
      const d = debtors[di], c = creditors[ci];
      const amt = Math.min(d.rem, c.rem);
      if (amt > 0.01) out.push({ from: d.name, to: c.name, banks: parseFloat(amt.toFixed(2)) });
      d.rem -= amt; c.rem -= amt;
      if (d.rem < 0.01) di++;
      if (c.rem < 0.01) ci++;
    }
    return out;
  })();

  const isBalanced = Math.abs(parseFloat(delta)) < 0.05;
  const settledCount = Object.values(settled).filter(Boolean).length;

  return (
    <>
      {/* Reconciliation card */}
      <div className={`recon-card ${isBalanced ? "ok" : "err"}`}>
        <div className="recon-card-title">{isBalanced ? "✓ Balanced" : "⚠ Discrepancy"}</div>
        {[
          ["Total Bought In", `${totalBought}B`, ""],
          ["Rake Collected", `${rake}B`, "gold"],
          ["Total Cash-outs", `${(totalBought - rake).toFixed(1)}B`, "green"],
          ["Balance", isBalanced ? "0.0B" : `${delta}B`, isBalanced ? "green" : "red"],
        ].map(([l, v, c]) => (
          <div className="reconcile-row" key={l}>
            <span className="recon-label">{l}</span>
            <span className={`recon-val ${c}`}>{v}</span>
          </div>
        ))}
      </div>

      {/* Settlement transactions */}
      <div style={{ padding: "0 24px 12px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--gray)", marginBottom: 12 }}>
          Settlement — {txns.length} transaction{txns.length !== 1 ? "s" : ""}
        </div>
        {txns.map((t, i) => {
          const key = `${t.from}-${t.to}`;
          const done = settled[key];
          return (
            <div key={i} className={`settle-txn-card ${done ? "done" : ""}`}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="settle-from">{t.from}</span>
                  <span className="settle-arrow">→</span>
                  <span className="settle-to">{t.to}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--gray)", marginTop: 3 }}>
                  owes <span style={{ fontFamily: "'DM Mono'", color: "var(--gold)", fontWeight: 600 }}>{t.banks}B</span>
                </div>
              </div>
              <div className={`settle-check ${done ? "checked" : ""}`}
                onClick={() => setSettled(prev => ({ ...prev, [key]: !prev[key] }))}>
                {done && "✓"}
              </div>
            </div>
          );
        })}

        {txns.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--gray)", fontSize: 14 }}>
            Everyone is even — no settlements needed!
          </div>
        )}
      </div>

      {/* Summary + share */}
      <div style={{ padding: "0 16px 0" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "12px 16px", marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "var(--gray)" }}>Settled</span>
            <span style={{ fontFamily: "'DM Mono'", fontSize: 14, fontWeight: 600, color: "var(--green-bright)" }}>
              {settledCount} / {txns.length}
            </span>
          </div>
          <div style={{ marginTop: 8, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 2, width: txns.length ? `${(settledCount / txns.length) * 100}%` : "0%", background: "var(--green-bright)", transition: "width 0.3s" }} />
          </div>
        </div>

        <button className="btn-gold" style={{ width: "100%", marginBottom: 10 }}
          onClick={() => showToast("📤", "Shared!", "Settlement summary sent to group")}>
          Share Settlement Summary
        </button>
        <button className="btn-primary" style={{ width: "100%" }}
          onClick={() => { showToast("🏁", "Game Closed", "Points updated. Leaderboard refreshed."); onNavigate("home"); }}>
          Close Game &amp; Update Leaderboard
        </button>
        <div style={{ height: 20 }} />
      </div>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selectedGame, setSelectedGame] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (icon, title, body) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ icon, title, body });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const navigate = (s, data) => {
    if (s === "game-detail" && data) setSelectedGame(data);
    setScreen(s);
  };

  const navItems = [
    { id: "home", icon: "♠", label: "Home" },
    { id: "live-game", icon: "🎮", label: "Live" },
    { id: "leaderboard", icon: "🏆", label: "Board" },
    { id: "profile", icon: "◎", label: "Profile" },
  ];

  const isFullScreen = ["create-game", "host-rsvp", "end-game"].includes(screen);

  return (
    <>
      <style>{styles}</style>
      <div className="phone-shell">
        {toast && (
          <div className="toast">
            <span className="toast-icon">{toast.icon}</span>
            <div>
              <div className="toast-title">{toast.title}</div>
              <div className="toast-body">{toast.body}</div>
            </div>
          </div>
        )}

        <div className="scroll-area">
          {screen === "home" && (
            <HomeScreen onNavigate={navigate} showToast={showToast}
              onCreateGame={() => navigate("create-game")} />
          )}
          {screen === "game-detail" && selectedGame && (
            <GameDetailScreen game={selectedGame} onBack={() => setScreen("home")}
              onNavigate={navigate} showToast={showToast} />
          )}
          {screen === "live-game" && (
            <LiveGameScreen showToast={showToast} onNavigate={navigate} />
          )}
          {screen === "leaderboard" && <LeaderboardScreen />}
          {screen === "profile"     && <ProfileScreen />}
          {screen === "create-game" && (
            <CreateGameScreen onBack={() => navigate("home")} onNavigate={navigate} showToast={showToast} />
          )}
          {screen === "host-rsvp"   && (
            <HostRSVPScreen onBack={() => navigate("home")} onNavigate={navigate} showToast={showToast} />
          )}
          {screen === "end-game"    && (
            <EndGameScreen onBack={() => navigate("live-game")} onNavigate={navigate} showToast={showToast} />
          )}
        </div>

        {!isFullScreen && (
          <nav className="bottom-nav">
            {navItems.map(item => (
              <div key={item.id}
                className={`nav-item ${screen === item.id || (item.id === "home" && ["game-detail"].includes(screen)) ? "active" : ""}`}
                onClick={() => navigate(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
