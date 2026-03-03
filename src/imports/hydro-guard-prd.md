PRODUCT REQUIREMENTS DOCUMENT (PRD)
Product Name

Hydro Guard 180

Product Type

Flood Monitoring and Community Emergency Web Application with IoT Water Level Device Integration

Deployment Type

Web Application (Admin + Public Portal)

1. Product Overview

Hydro Guard 180 is a web-based flood monitoring and emergency response system designed for Barangay 180, Caloocan City. The system integrates with a water-level monitoring device to collect real-time environmental data and classify flood risk levels.

The platform consists of:

Public-facing barangay website

Admin dashboard

Water monitoring module

Alert level protocol system

Resident contact management system

Primary Goal: Improve flood preparedness, response time, and data-driven decision-making for barangay officials.

2. Background Information
Barangay Profile

Location: Barangay 180, Caloocan City, NCR
Coordinates: 14.7633° N, 121.0792° E
Elevation: 88 meters above sea level
Population (2020): 18,802
Median Age: 24 years
Young Dependents (0–14): 32.39%
Dependency Ratio: 55 dependents per 100 working-age individuals

Population Growth:
1990 – 1,655
1995 – 4,909
2000 – 8,799
2007 – 9,231
2010 – 14,120
2015 – 16,500
2020 – 18,802

The barangay shows steady growth with a youthful demographic, increasing the need for structured emergency systems.

3. Objectives
Primary Objectives

Monitor and store real-time water-level data.

Automatically classify alert levels (1–4).

Provide structured safety protocols.

Manage resident and emergency contact records.

Deliver statistical insights without graphical charts.

Provide public awareness and training resources.

Success Metrics

Accurate device data ingestion

Proper alert classification

Fast dashboard load time (<2 seconds)

High system uptime (>90%)

Proper audit logging of administrative actions

4. User Roles
Anonymous Users

View homepage

Access barangay information

View safety protocols

Read training materials

Contact barangay

Authenticated Users

Admin

Staff

Super Admin

5. Public Website Requirements
5.1 Homepage

Purpose: Public introduction to Hydro Guard 180 and Barangay 180.

Sections:

Hero section (Flood Awareness + CTA)

Barangay Overview

Current Alert Level (read-only)

Call-to-action buttons (Training / Contact / Login)

Optional Enhancements:

Scroll animations

Subtle parallax effect

Smooth transitions

5.2 About Page

Content:

Barangay profile

Population statistics

Growth history

Demographics

Geographic data

5.3 FAQ Page

Format:

Accordion-style

Searchable

Topics:

Flood monitoring explanation

Alert level meaning

Emergency procedures

Device explanation

5.4 Training Page

Purpose: Emergency preparedness education.

Sections:

Evacuation steps

First aid basics

Emergency go-bag checklist

Safety reminders

5.5 Contact Page

Content:

Barangay contact details

Emergency hotlines

Contact form

Map embed

5.6 Login Page

Fields:

Email or Username

Password

Features:

Show/Hide password toggle

Password requirements:

Minimum 8 characters

At least 1 number

At least 1 special character

6. Dashboard Requirements

Design Philosophy:

Continuous layout flow

Minimal visual gaps

Subtle dividers instead of strong card separation

Unified background container

Clean and structured

7. Dashboard Modules
7.1 User Management

Features:

Create user

Edit user

Assign role

Archive user

Permanent delete (admin only)

Reset password

Roles:

Super Admin

Admin

Staff

Requirements:

Audit logs required

Soft delete before permanent removal

7.2 Contact Directory (Resident Directory)

Purpose: Store resident emergency contacts.

Fields:

Resident Name

Address

Contact Number

Emergency Contact

Household Count

Notes

Features:

Create

Edit

Archive

Permanent delete

Search

Export (CSV, Excel, PDF)

Soft delete required before permanent removal.

7.3 Water Monitoring

Purpose: Display data from IoT water-level device.

Data Fields:

Timestamp

Water Level (cm or meters)

Alert Level

Rainfall Indicator (if available)

Device Status

Features:

Filter by date range

Filter by alert level

Search

Pagination

Export (CSV, Excel, PDF)

No graphical charts required.

7.4 Alert Levels & Safety Protocols

System must automatically classify alert levels based on water thresholds.

Level 1 – Normal

Risk: Minimal
Water Level: Low to Normal
No flooding expected

Level 2 – Advisory

Risk: Low to Moderate
Water rising
Residents advised to stay alert

Level 3 – Warning

Risk: High
Near critical threshold
Minor flooding possible

Level 4 – Critical

Risk: Severe
Water exceeds safe limit
Immediate evacuation required

Requirements:

Automatic classification

Manual override (Admin only)

Log override actions

7.5 Analytics (No Graphs)

Display statistical summaries only.

Metrics:

Total records

Average water level (selected range)

Highest recorded level

Most frequent alert level

Rainfall correlation (if available)

Recommended action summary

Filters:

Date range

Alert level

8. Device Integration Requirements

Device sends data every configurable interval (1–5 minutes)

WebSocket (Socket.io) for real-time updates

REST API fallback

Store raw sensor data

Server-side threshold classification

Device heartbeat monitoring

9. Non-Functional Requirements
Performance

Dashboard load time under 2 seconds

Optimized database indexing on timestamp

Efficient pagination

Security

JWT authentication

Role-based access control

Password hashing (bcrypt)

Rate limiting

HTTPS required

Data Integrity

Soft delete before permanent deletion

Audit logs for:

User actions

Alert overrides

Record deletion

Device status changes

10. Recommended Technology Stack

Frontend:

React (Vite)

Tailwind CSS

Framer Motion

React Query

Backend:

Node.js (Express)

MySQL

Socket.io

Export:

ExcelJS

PDFKit

11. UI/UX Requirements

Primary Palette:

#FF6A00 (Primary Accent)

#26343A (Dark Neutral)

#2563EB (Action Blue)

#F3F4F6 (Background)

#1F2937 (Text)

Recommended Alert Colors:

Green: #22C55E

Yellow: #FACC15

Orange: #FB923C

Red: #EF4444

Design Rules:

Avoid heavy shadows

Avoid overly separated card layouts

Use subtle dividers

Maintain visual continuity

Keep navigation simple and intuitive