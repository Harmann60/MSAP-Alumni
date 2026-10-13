import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
globalThis.React = React;
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import MembershipPage from '../pages/MembershipPage';
import HeroSection from '../components/HeroSection';

describe('MSAP Alumni UI Unit Tests', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('Navbar renders navigation links including Contact Us and Membership', () => {
    const html = renderToString(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(html).toContain('Contact Us');
    expect(html).toContain('Membership');
    expect(html).toContain('News');
    expect(html).toContain('Gallery');
    expect(html).toContain('Association of MSAP Alumni, Manipur');
    expect(html).toContain('Sign in');
    expect(html).toContain('Register');
  });

  it('NewsCard displays title, excerpt, last-edited author and Facebook link', () => {
    const mockNews = {
      slug: 'centenary-celebration',
      title: 'Centenary Campus Celebration',
      excerpt: 'Alumni gathered to mark 100 years of academic distinction.',
      cardLabel: 'Campus Event',
      updatedAt: '2026-03-20T14:30:00.000Z',
      editorName: 'Dr. R. K. Singh',
      sourceUrl: 'https://facebook.com/msap/posts/101',
    };

    const html = renderToString(
      <MemoryRouter>
        <NewsCard item={mockNews} />
      </MemoryRouter>
    );

    expect(html).toContain('Centenary Campus Celebration');
    expect(html).toContain('Alumni gathered to mark 100 years');
    expect(html).toContain('Campus Event');
    expect(html).toContain('Last edited:');
    expect(html).toContain('Dr. R. K. Singh');
    expect(html).toContain('Facebook');
    expect(html).toContain('https://facebook.com/msap/posts/101');
  });

  it('NewsCard renders RBAC Edit button when user has MODERATOR or ADMIN role in session', () => {
    const mockNews = {
      slug: 'annual-assembly',
      title: 'Annual General Assembly',
      excerpt: 'Review of the past year milestones.',
      cardLabel: 'Notice',
      updatedAt: '2026-01-10T00:00:00.000Z',
    };

    // Anonymous guest session: no Edit button
    const htmlGuest = renderToString(
      <MemoryRouter>
        <NewsCard item={mockNews} />
      </MemoryRouter>
    );
    expect(htmlGuest).not.toContain('✏️ Edit');

    // Moderator session: has Edit button
    sessionStorage.setItem('msap_admin_user', JSON.stringify({ role: 'MODERATOR', name: 'Editor Mod' }));
    const htmlModerator = renderToString(
      <MemoryRouter>
        <NewsCard item={mockNews} />
      </MemoryRouter>
    );
    expect(htmlModerator).toContain('✏️ Edit');
  });

  it('MembershipPage renders tiers, perks, and FAQ sections', () => {
    const html = renderToString(
      <MemoryRouter>
        <MembershipPage />
      </MemoryRouter>
    );

    // Single Lifetime Membership Tier
    expect(html).toContain('Life Member');
    expect(html).toContain('₹3,000');
    expect(html).toContain('One-time lifetime joining');

    // Perks & FAQ
    expect(html).toContain('Why join the MSAP alumni network?');
    expect(html).toContain('Frequently Asked Questions');
    expect(html).toContain('Who is eligible to register for MSAP Alumni membership?');
    expect(html).toContain('How is the membership fund utilized?');
  });

  it('HeroSection renders headline, CTA buttons, and memory gallery carousel', () => {
    const html = renderToString(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>
    );

    expect(html).toContain('For fifty years, Manipuri students came to Pune to build their futures.');
    expect(html).toContain('Register for verification');
    expect(html).toContain('Membership &amp; Perks');
    expect(html).toContain('Golden Jubilee');
    expect(html).toContain('50+');
    expect(html).toContain('Years of legacy');
  });
});
