# Zaixi Personal Blog — template design

This site directly adopts [joyehuang/blog](https://github.com/joyehuang/blog)
at commit `17e0eda5d7befe82682072ba5e3b18991e80bc45`.
It uses the template's Astro Theme Pure layout and visual system.

## Layout

- Sticky top navigation and a centered, circular profile photo.
- Home sections use a narrow heading column and a wider content column;
  on phones, the columns stack.
- Blog listings use native Pure post cards. Articles use its prose styling,
  heading links, reading metadata, table of contents and back-to-top control.
- Project, about and contact pages reuse the template's common reading layout.

## Visual system

The original semantic colors remain in `src/assets/styles/app.css`,
with light and dark themes selected by the `dark` class on the document.
UnoCSS utilities and typography are configured in `uno.config.ts`.
Satoshi is self-hosted from the font files supplied with the template;
Chinese text uses the operating system's available sans-serif font.

## Interactions

The original particle introduction now spells ZAIXI. The original terminal
and dev mode navigate this site's static content and do not execute shell commands.
Search covers the author's articles and public projects. Theme choice persists
in the browser. Contact uses the template's QR card and a plain, copyable email.
Reduced-motion preferences disable transitions and skip the automatic introduction.

## Adaptation scope

Personal information, photos, seven projects and four articles belong to Zaixi.
The source articles were preserved. The author's original updated dates supply
the dates displayed by the template; publication dates are not separately recorded.
The reference author's articles, contacts, external analytics and private
character package are not included. Public ASCII mascot code comes from the template.
Local adaptations cover static hosting, current dependencies, old URLs,
keyboard accessibility and narrow-screen behavior.

Template attribution and license details are in `NOTICE.md` and `LICENSE`.
