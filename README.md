# Kreativ Nomads Website

A modern, high-performance website for Kreativ Nomads - a creative agency in the Philippines. Built with Next.js 14, React 18, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Stack**: Next.js 14 with App Router, React 18, TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Animations**: Smooth animations with Framer Motion
- **Dynamic Portfolio**: Filter-based portfolio with modal galleries
- **Performance Optimized**: Lazy loading, optimized images/videos
- **SEO Ready**: Full metadata, Open Graph, structured data
- **Accessible**: WCAG compliant, semantic HTML, ARIA labels

## 📦 Project Structure

```
kreativ-nomads-website/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Hero.tsx            # Hero section
│   │   ├── About.tsx           # About section
│   │   ├── Services.tsx        # Services section
│   │   ├── Portfolio.tsx       # Portfolio with filters
│   │   ├── Contact.tsx         # Contact form
│   │   └── Footer.tsx          # Site footer
│   ├── data/                   # JSON data files
│   │   └── portfolio.json      # Portfolio data
│   ├── lib/                    # Utility functions
│   │   ├── utils.ts            # Helper functions
│   │   └── animations.tsx      # Animation components
│   └── types/                  # TypeScript types
│       └── index.ts            # Type definitions
├── public/                     # Static assets
│   └── portfolio/              # Portfolio media files
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository and navigate to the project:
   ```bash
   cd kreativ-nomads-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Managing Portfolio Content

Portfolio content is managed via the `src/data/portfolio.json` file. The schema:

```json
{
  "services": [
    {
      "id": "service-id",
      "label": "Display Label",
      "projects": [
        {
          "client": "Client Name",
          "category": "Project Category",
          "type": "video | image | mixed",
          "assets": [
            {
              "src": "/portfolio/path/to/asset.mp4",
              "type": "video | image",
              "title": "Optional Title"
            }
          ]
        }
      ]
    }
  ]
}
```

### Adding New Projects

1. Add media files to `public/portfolio/[service]/[client]/`
2. Update `src/data/portfolio.json` with project details
3. The website automatically updates with new content

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to modify the color palette:

```typescript
colors: {
  primary: { /* Orange tones */ },
  secondary: { /* Blue tones */ },
  dark: { /* Dark grays */ },
}
```

### Typography

Fonts are configured in `src/app/layout.tsx`:
- **Inter**: Body text
- **Poppins**: Headings and display text

### Animations

Animation components are in `src/lib/animations.tsx`. Modify variants for custom effects.

## 🏗️ Building for Production

```bash
npm run build
npm run start
```

## 📱 Responsive Breakpoints

- **sm**: 640px (Small devices)
- **md**: 768px (Tablets)
- **lg**: 1024px (Laptops)
- **xl**: 1280px (Desktops)
- **2xl**: 1536px (Large screens)

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Color contrast compliance
- Screen reader friendly

## 🔍 SEO Features

- Meta tags and Open Graph
- Structured data ready
- Sitemap generation (with next-sitemap)
- Optimized images with alt text
- Semantic heading hierarchy

## 📄 License

Copyright © 2024 Kreativ Nomads. All rights reserved.
