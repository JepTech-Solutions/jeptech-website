# JepTech Solutions — Website

Placeholder landing page for [jeptech.co.uk](https://jeptech.co.uk).

## Deployment

Hosted on **Cloudflare Pages**. Pushes to `main` auto-deploy.

- **Pages URL:** `jeptech-website.pages.dev` (before custom domain)
- **Custom domain:** `jeptech.co.uk`

## Structure

```
index.html          # Homepage — hero, service summary, about, contact form
services.html       # Dedicated services page with detailed descriptions
assets/
  logo.svg          # JepTech logo (SVG)
  logo.webp         # JepTech logo (WebP fallback)
```

## Contact Form

Uses [FormSubmit.co](https://formsubmit.co/) — a free service that forwards form submissions to `john@jeptech.co.uk` via email. No backend needed.

**First submission** from the live site will trigger a confirmation email from FormSubmit to verify the address. Click the link in that email to activate.

## Next Steps

- [ ] Create GitHub repo (`JepTech-Solutions/jeptech-website`)
- [ ] Connect to Cloudflare Pages
- [ ] Add custom domain `jeptech.co.uk`
- [ ] Confirm FormSubmit email verification
- [ ] Replace with full site (Lovable or custom build)
