# VYBE

VYBE is a responsive event discovery website for finding thoughtful gatherings, live music, workshops, sport and more. The experience pairs an editorial visual style with a practical event search and reservation flow.

## Features

- Responsive navigation with active section indication and a mobile menu.
- Featured event selection and a complete event directory rendered from structured event data.
- Combined event search and category filtering, with reset controls and an empty state.
- Event detail dialog with date, time, venue, description and registration shortcut.
- Event publishing form with required-field, email and Indian 10-digit phone validation; published events appear in Explore and the host profile.
- Event-specific reservation form in each event detail view, with validation and duplicate reservation checks.
- User profile page with email-based lookup, booking and hosting history, and printable ticket cards with unique booking codes.
- Subtle scroll reveals and reduced-motion support.

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser Local Storage

## Project structure

```text
vybe/
├── index.html
├── profile.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── events.js
│   ├── profile.js
│   └── registration.js
└── README.md
```

## Run locally

Open `index.html` in a modern browser. For a local development server, run a static server from the project directory, for example:

```bash
npx serve .
```

The page uses Google Fonts and Unsplash-hosted event photos, so those assets need an internet connection. The site itself has no build step or framework dependency.

## Local Storage

Attendee reservations are saved in the browser under `vybeRegistrations`; events published from the host form are saved under `vybeHostedEvents`. Reservation entries contain participant details, selected event, unique ticket code and submission timestamp. A repeated reservation for the same event and email is detected. The profile page uses the remembered `vybeActiveProfileEmail` to restore the active profile on later visits. Clearing browser storage removes these entries and the remembered profile.

This is a frontend project. Profile, booking and hosted event information is stored locally in the visitor's browser and is not sent to a server. Published events are visible in Explore only in that browser. Tickets are visual confirmations for this demo; they are not validated at a real event venue.

## Deployment

The site is static and can be deployed to GitHub Pages, Vercel, Netlify or any static hosting provider. Upload/push the project files and set the site root to the folder containing `index.html`; no build command is required.
