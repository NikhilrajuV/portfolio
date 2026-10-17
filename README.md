# Nikhil Portfolio 2.0

Maintains the purple-neon portfolio look and adds interactive project case studies, skills galaxy, continuous tech marquee, recruiter quick view, FAQ assistant, and a Firebase-backed content editor.

## Run locally

```bash
npm install
npm run dev
```

Put the existing image assets in the Vite `public/` folder using the same names already referenced by the portfolio:
- `nikhil-passport-photo.png`
- `nikhil-resume-v3.pdf`
- `Neon Pink-Purple Nikhil Raju Signature.png`
- `project-face-reference.png`
- `project-wivision-reference.png`
- `project-visitor-reference.png`

Missing optional images do not stop the app from rendering; replace them with your own assets as needed.

## Secure Firebase admin setup

1. Create a Firebase project and register a Web app.
2. Enable **Authentication → Email/Password**.
3. Create the admin user in Authentication and verify that email.
4. Copy `.env.example` to `.env.local` and fill the Firebase Web App config values.
5. In `firestore.rules`, replace `REPLACE_WITH_YOUR_ADMIN_EMAIL` with the exact verified admin email. Publish the rules in Firebase Console or deploy using Firebase CLI.
6. Create Firestore database. The first successful admin publish creates `portfolio/public`.
7. Restart Vite after changing `.env.local`.
8. Click **Admin Edit** → sign in with the Firebase admin credentials. Edit any tab and choose **Publish changes**.

Do not put service-account keys, private API keys, or AI provider secrets in Vite environment variables. Variables prefixed with `VITE_` are shipped to the browser. The Firestore rules are the actual write-access control; hiding the admin button is not security.

## Contact form email delivery (EmailJS)

The contact form sends the project request directly to your inbox using EmailJS (no mail app needs to open). One-time setup is required:

1. Create an account at https://www.emailjs.com/ and connect the email service/inbox where you want to receive enquiries.
2. Create an EmailJS email template. Set the **To email** to your own inbox (for example, `nikhilrajuvadali48@gmail.com`).
3. Add these template variables to the template body: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{work_with}}`, `{{project_type}}`, and `{{project_details}}`. Set **Reply-To** to `{{reply_to}}` so you can reply to the sender.
4. Copy `.env.example` to `.env.local` and fill in `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, and `VITE_EMAILJS_PUBLIC_KEY` from your EmailJS dashboard.
5. Run `npm install`, then restart the dev server with `npm run dev`. For deployment, add the same three variables to your hosting provider's environment settings and rebuild.

EmailJS's browser public key is intended for client-side use; restrict allowed domains in EmailJS where available and configure its anti-abuse/rate limits. Never place private email-service credentials in frontend code.

## AI assistant

Without `chatEndpoint`, the assistant uses a local FAQ response set built from current portfolio content; it is not an LLM. To enable generated answers, configure `chatEndpoint` in Admin → Profile to a **server-side** endpoint you own. That endpoint must authenticate/rate-limit requests and keep provider API keys server-side. Expected request JSON: `{ "message": "...", "profile": { ...portfolio content... } }`; return `{ "answer": "..." }` or `{ "reply": "..." }`.

## Publishing

Build with `npm run build`, then deploy the `dist/` folder to your static host. Add the same Firebase config to the host's environment settings. Firebase Authentication's authorized domains must include your production domain.
