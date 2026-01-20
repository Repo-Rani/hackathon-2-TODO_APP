# Quickstart Guide: UI/UX Transformation

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A modern browser for development and testing

## Setup Instructions

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the frontend directory with any required environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
# Add other environment variables as needed
```

### 4. Install Additional UI Dependencies
```bash
# Shadcn/ui setup (follow the prompts)
npx shadcn@latest init

# Add required components
npx shadcn@latest add button card input label dropdown-menu tabs avatar badge dialog checkbox select

# Install additional libraries
npm install lucide-react framer-motion recharts clsx tailwind-merge
npm install sonner nprogress react-loading-skeleton
npm install canvas-confetti react-confetti
npm install @dnd-kit/core @dnd-kit/sortable
npm install react-hotkeys-hook react-joyride
```

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application with the new UI/UX.

## Key Features

### Theme Switching
- Toggle between light/dark mode using the theme toggle button
- Theme preference persists across sessions
- Orange accent color applied consistently throughout the UI

### Landing Page
- 5-section layout with animations:
  1. Hero Section (full viewport with animated badge)
  2. Features Section (3 clickable cards with hover effects)
  3. How It Works Section (timeline with scroll animations)
  4. Testimonials Section (animated cards)
  5. CTA Section (call-to-action with gradient background)

### Authentication Pages
- Unified login/signup with tabbed interface
- Preserved existing validation logic
- Modern form styling with loading states

### Todo Application
- Enhanced task cards with animations
- Improved filtering and sorting UI
- Responsive design for all device sizes

## Development Workflow

### Adding New Components
1. Create component in `components/` directory
2. Use Shadcn/ui primitives where possible
3. Apply consistent styling using Tailwind CSS and design tokens
4. Add proper TypeScript typing
5. Include animation states where appropriate

### Theming
- Use CSS variables defined in `:root` and `.dark` selectors
- Apply theme colors using Tailwind's color system
- Ensure proper contrast in both light and dark modes

### Responsive Design
- Follow mobile-first approach
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- Test designs on multiple screen sizes

### Animations
- Use Framer Motion for complex animations
- Use CSS transitions for simple state changes
- Respect user's reduced motion preferences
- Maintain 60fps performance

## Testing

### Component Testing
```bash
npm run test
# or for watch mode
npm run test:watch
```

### End-to-End Testing
```bash
npm run test:e2e
```

### Performance Testing
- Verify theme switching completes in <300ms
- Ensure animations maintain 60fps
- Check page load times are <2s on standard connection
- Validate responsive behavior on different screen sizes

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Troubleshooting

### Theme Not Persisting
- Check that `localStorage` is enabled in the browser
- Verify `ThemeProvider` is properly wrapped around the app

### Animations Not Working
- Ensure Framer Motion is properly installed
- Check that animation properties are correctly applied

### Responsive Issues
- Verify Tailwind CSS is properly configured
- Check that viewport meta tag is present in the document head

## Next Steps
1. Review the task list in `specs/005-ui-ux-transformation/tasks.md` for detailed implementation steps
2. Implement components according to the design specifications
3. Test across different browsers and devices
4. Optimize performance and accessibility