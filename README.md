🎆 New Year 2026 Interaction
A simple, interactive web greeting featuring a theme-switching UI, a 3x3 sliding puzzle, and a hidden gift game.

✨ Key Features
Interactive Games: Includes a logic-based image puzzle and a "pick-a-box" gift reveal.

Dynamic UI: Transitions between light and dark "glossy red" themes using CSS variables.

Animations: Canvas-based star field and CSS-powered year-change effects.

EmailJS integration: Sends a notification via when the user completes the final survey.emailjs.send

🛠️ Quick Setup
Images: Place your images in the folder./image

EmailJS: To enable the notification system, add your keys to the script:

Initialize with your Public Key: emailjs.init('YOUR_PUBLIC_KEY')

Set constants: and .SERVICE_IDTEMPLATE_ID

Deployment: Static hosting ready (GitHub Pages, Vercel, or Netlify).

📧 Email System
The site uses EmailJS to track if the recipient enjoyed the wish. It triggers a ("Successful" or "Try Next Time") directly to your configured email service.statusMessage
