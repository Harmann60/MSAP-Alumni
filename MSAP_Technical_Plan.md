# MSAP Pune – Website & App Technical Plan

**Project:** Manipur Students' Association Pune (MSAP)

---

# 1. Overview

## What we're building

The **MSAP Digital Platform** consists of two primary components:

- A **public website** to showcase the association, its activities, committee members, events, news, and gallery.
- A **mobile application** exclusively for verified alumni members to facilitate networking, communication, event participation, and community engagement.

## Main Goals

- Digitize alumni communication.
- Improve engagement between alumni and current students.
- Provide a centralized platform for events and announcements.
- Build a secure alumni directory.
- Enable community interaction through messaging.
- Simplify content management for administrators.

---

# 2. Scope

## In Scope (MVP)

### Website

- Home Page
- About MSAP
- Executive Committee
- Events
- News & Announcements
- Gallery
- Contact Page

### Mobile App

- Login & Registration
- Admin Approval Workflow
- Home Dashboard
- Member Directory
- Member Profiles
- Events
- News
- Gallery
- Profile Management
- Settings
- Real-time Chat

---

## Out of Scope (Future Versions)

- Online Donations
- Job Portal
- Mentorship Program
- Polls & Surveys
- Alumni Map
- Payment Gateway
- Attendance System
- Event Ticketing

---

## Users

### Public Visitors

Anyone visiting the website.

### Alumni Members

Verified alumni using the mobile application.

### Administrators

- Manage members
- Verify registrations
- Publish announcements
- Upload events
- Moderate content

---

# 3. Tech Stack

| Area | Choice | Notes |
|------|--------|------|
| Website | Next.js | SEO-friendly, responsive, and fast |
| Mobile App | Flutter | Cross-platform Android & iOS |
| Backend | Supabase | Backend-as-a-Service |
| Database | PostgreSQL | Relational database |
| Hosting | Vercel + Supabase | Reliable cloud hosting |
| Admin / CMS | Supabase Dashboard + Custom Admin Panel | Easy content management |
| Authentication | Supabase Auth | Secure email authentication |
| Integrations | Supabase Storage, Realtime, Push Notifications | Media storage & real-time communication |

---

# 4. Architecture

```text
                Public Website
                     │
                     │
              Next.js Frontend
                     │
                     │
               Supabase Backend
        ┌────────────┼────────────┐
        │            │            │
     Database     Storage     Authentication
        │            │            │
        └────────────┼────────────┘
                     │
             Flutter Mobile App
```

Both the website and mobile application share the same backend and database, ensuring consistent data across all platforms.

---

# 5. Modules

| Module | Description | Priority |
|---------|-------------|----------|
| Authentication | Login, Registration, Admin Approval | High |
| Home Dashboard | Welcome section, announcements, quick actions | High |
| Member Directory | Browse and search alumni members | High |
| Member Profiles | Alumni information and contact details | High |
| Events | Upcoming and past events | High |
| News | Latest announcements and updates | High |
| Gallery | Event photos and albums | Medium |
| Chat | One-to-one and community messaging | Medium |
| Profile & Settings | Account management | Medium |

---

# 6. Design

## Design Direction

- Material Design 3
- Modern and minimal interface
- Green branding inspired by the MSAP logo
- Responsive layouts
- Accessibility-focused
- Consistent spacing and typography
- Easy-to-use interface for users of all age groups

---

### Website Wireframe

```text
┌──────────────────────────────────────────────────────────┐
│ Logo      Navigation      Navigation       Contact        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    Hero Banner                           │
│                                                          │
├────────────────────────────┬─────────────────────────────┤
│                            │                             │
│      Main Content          │     Upcoming Events         │
│                            │                             │
├────────────────────────────┴─────────────────────────────┤
│                    News / Gallery                        │
├──────────────────────────────────────────────────────────┤
│ Footer · Contact · Social Media                          │
└──────────────────────────────────────────────────────────┘
```

---

### Mobile App Wireframe

```text
┌─────────────────────┐
│ ☰    MSAP Alumni    🔔 │
├─────────────────────┤
│                     │
│   Banner / Carousel │
│                     │
├─────────────────────┤
│ Upcoming Events     │
├─────────────────────┤
│ Latest News         │
├─────────────────────┤
│ Home Members Chat   │
└─────────────────────┘
```

---

# 7. Timeline

| Phase | Deliverables | Timeline | Status |
|--------|--------------|----------|--------|
| Phase 1 | Planning & UI Prototype | 2 Weeks | In Progress |
| Phase 2 | UI Refinement & Feedback | 1 Week | Pending |
| Phase 3 | Backend Integration | 3 Weeks | Pending |
| Phase 4 | Testing & Bug Fixes | 2 Weeks | Pending |
| Phase 5 | Deployment | 1 Week | Pending |

**Estimated MVP Completion:** **8–10 Weeks**

---

# 8. Assumptions, Risks & Dependencies

## Assumptions

- MSAP will provide alumni records.
- Event and news content will be maintained by administrators.
- Users will register with valid information.
- Administrators will verify member registrations.

---

## Risks

- Delays in collecting alumni data.
- Scope changes during development.
- Internet dependency for real-time features.
- User adoption and onboarding.

---

## Dependencies

- Flutter SDK
- Android Studio
- Supabase
- PostgreSQL
- Vercel
- GitHub
- Google Play Console (Android release)
- Apple Developer Account (future iOS release)

---

# 9. Team

| Role | Responsibility |
|------|----------------|
| Project Lead | Overall project coordination |
| Mobile Developer | Flutter application development |
| Web Developer | Next.js website development |
| UI/UX Designer | User interface and design system |
| Content Administrator | Website content and announcements |

After deployment, MSAP administrators will maintain website and application content.

---

# 10. Next Steps

## Requirements from MSAP

- Official logo and branding assets
- Alumni member database
- Executive committee details
- Events calendar
- News articles
- Gallery images
- Contact information
- Final feature approval

---

## Open Questions

- Should registrations require admin approval?
- Should group chats be supported?
- Should digital membership cards be included?
- Should push notifications be enabled?
- Is offline access required?
- Should events support RSVP functionality?
- What specific details should members be permitted to share in their profile?

---

# Project Status

> **Current Stage:** UI Prototype Development

The Flutter mobile application prototype has been completed with navigation and dummy data. Backend integration using Supabase, authentication, and real-time functionality will be implemented in the next development phase.
