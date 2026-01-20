---
id: 005
title: UI/UX Transformation
stage: spec
date_iso: 2026-01-19
surface: agent
model: sonnet
feature: ui-ux-transformation
branch: 005-ui-ux-transformation
user: user
command: /sp.specify
labels: ["ui", "ux", "design", "transformation"]
links:
  spec: ../specs/005-ui-ux-transformation/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-ui-ux-transformation/spec.md
  - specs/005-ui-ux-transformation/checklists/requirements.md
tests: []
---

# UI/UX Transformation

## User Input

```
📋 Project Context
This specification is for Phase II: Full-Stack Web Application - Complete UI/UX transformation with expert-level styling, animations, and professional design patterns.
CRITICAL CONSTRAINT:

✅ PRESERVE ALL EXISTING LOGIC - Authentication, API calls, database operations, state management
✅ ONLY MODIFY - Styling, layout, animations, visual components, theme system
✅ DO NOT TOUCH - Route handlers, form validation logic, API endpoints, authentication flow


🎯 Objectives

Create a world-class, production-ready interface that rivals professional SaaS applications
Implement seamless dark/light theme switching with orange as primary accent
Build 5 engaging homepage sections with sophisticated animations
Design a unified auth experience (single page for login/signup with tabs)
Create an animated, professional todo application interface
Ensure responsive design across all devices (mobile, tablet, desktop)


🎨 Design System
Color Palette
css/* ===== LIGHT THEME ===== */
--light-bg-primary: #FFFFFF;
--light-bg-secondary: #F8F9FA;
--light-bg-tertiary: #F1F3F5;
--light-text-primary: #1A1A1A;
--light-text-secondary: #6B7280;
--light-border: #E5E7EB;

/* ===== DARK THEME ===== */
--dark-bg-primary: #0A0A0A;
--dark-bg-secondary: #1A1A1A;
--dark-bg-tertiary: #2D2D2D;
--dark-text-primary: #FFFFFF;
--dark-text-secondary: #A0A0A0;
--dark-border: #333333;

/* ===== ORANGE ACCENT (BRAND) ===== */
--primary-orange: #FF6B35;
--primary-orange-hover: #FF8C61;
--primary-orange-dark: #E85A2A;
--primary-orange-light: #FFA587;

/* ===== SEMANTIC COLORS ===== */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
Typography Scale
css/* Headings */
--text-6xl: 3.75rem;  /* Hero */
--text-5xl: 3rem;     /* Section Headers */
--text-4xl: 2.25rem;  /* Sub Headers */
--text-3xl: 1.875rem; /* Card Titles */
--text-2xl: 1.5rem;   /* Large Text */
--text-xl: 1.25rem;   /* Body Large */
--text-lg: 1.125rem;  /* Body */
--text-base: 1rem;    /* Base */
--text-sm: 0.875rem;  /* Small */

/* Font Families */
--font-heading: 'Inter', sans-serif;
--font-body: 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
Spacing System
css--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-24: 6rem;     /* 96px */
Border Radius
css--radius-sm: 0.375rem;   /* 6px - buttons, inputs */
--radius-md: 0.5rem;     /* 8px - cards */
--radius-lg: 0.75rem;    /* 12px - modals */
--radius-xl: 1rem;       /* 16px - hero sections */
--radius-full: 9999px;   /* Full round - avatars */
Shadows
css/* Light Theme */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

/* Dark Theme */
--shadow-sm-dark: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md-dark: 0 4px 6px rgba(0, 0, 0, 0.4);
--shado Color: Light theme → gray-700, Dark theme → gray-300
- Hover effect: Orange underline animation (bottom border slide-in)
- Active state: Orange text color
- Spacing: 2rem between links

#### **3. Theme Toggle Button**
- Icon: `Sun` for light mode, `Moon` for dark mode (from Lucide React)
- Position: Right side, before auth buttons
- Style: Icon button with circular background
- Size: 40px × 40px
- Background: Subtle (light: gray-100, dark: gray-800)
- Hover: Scale + background color change
- Animation: **Rotate 180deg** when switching themes
- Transition: All 300ms ease-in-out

#### **4. Auth Buttons (Unauthenticated State)**
- **Login Button**:
  - Style: Ghost button (transparent with border)
  - Border: 2px solid orange
  - Text: Orange
  - Hover: Orange background, white text
  - Padding: 0.5rem 1.5rem

- **Sign Up Button**:
  - Style: Solid orange button
  - Background: Orange
  - Text: White
  - Hover: Darker orange
  - Padding: 0.5rem 1.5rem
  - Spacing: 1rem gap between login and signup

#### **5. User Profile (Authenticated State)**
Replace auth buttons with:
```
[Theme Toggle] [Avatar Dropdown ▼]
```

**Avatar Component:**
- Circular avatar (40px diameter)
- Display user's initials if no profile image
- Background: Orange gradient
- Border: 2px solid (light: white, dark: gray-700)
- Cursor: Pointer
- Hover: Ring effect (orange glow)

**Dropdown Menu (on click):**
```
┌──────────────────────┐
│ 👤 John Doe          │
│ john@example.com     │
├──────────────────────┤
│ 📊 Dashboard         │
│ ⚙️ Settings          │
│ 🚪 Logout            │
└──────────────────────┘

Position: Absolute, right-aligned below avatar
Width: 240px
Background: (light: white, dark: gray-900)
Border: 1px solid border color
Shadow: xl shadow
Border radius: lg
Animation: Fade-in + slide-down (200ms)

Dropdown Items:

Padding: 0.75rem 1rem
Hover: Background change (light: gray-50, dark: gray-800)
Icon size: 1.25rem
Icon color: Orange
Text: Medium weight
Logout: Text color red on hover

Navbar Behavior

Sticky positioning: Stays at top while scrolling
Backdrop blur: Glass morphism effect when scrolled

css  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8); /* Light */
  background: rgba(10, 10, 10, 0.8);    /* Dark */
```
- **Shadow on scroll**: Add subtle shadow when page scrolls > 20px
- **Mobile responsive**:
  - Breakpoint: < 768px
  - Hamburger menu icon (right side)
  - Full-screen slide-in menu from right
  - Animation: Slide-in 300ms cubic-bezier

---

## 🏠 **Home Page (Unauthenticated Users)**

### **Page Structure (5 Sections)**
```
1. Hero Section (Full viewport height)
2. Features Section (Grid of 3 clickable feature cards)
3. How It Works Section (Step-by-step timeline)
4. Testimonials Section (Animated cards)
5. CTA Section (Final call-to-action)
```

---

### **SECTION 1: Hero Section**

#### **Layout**
- Height: 100vh (full viewport)
- Display: Flex, center-aligned
- Background: Gradient (light: white → orange/5, dark: black → orange/10)
- Padding: 4rem horizontal

#### **Content Structure**
```
┌─────────────────────────────────────────────┐
│                                             │
│          [Animated Badge]                   │
│                                             │
│     Your Tasks, Organized.                  │
│        Effortlessly.                        │
│                                             │
│   Supercharge your productivity with AI-    │
│   powered task management. Simple,          │
│   beautiful, and blazingly fast.            │
│                                             │
│   [Get Started Free →] [Watch Demo]         │
│                                             │
│      [Animated Dashboard Preview]           │
│                                             │
└─────────────────────────────────────────────┘
```

#### **Elements**

**1. Animated Badge (Top)**
- Text: "✨ Now with AI Assistant"
- Style: Pill-shaped badge
- Background: Orange/10, border: orange/30
- Size: Inline-flex, padding: 0.5rem 1rem
- Animation: **Fade-in from top** + **Pulse glow effect**
- Font: 0.875rem, medium weight

**2. Main Heading**
- Text: "Your Tasks, Organized. Effortlessly."
- Typography: 3.75rem (6xl), bold (700)
- Color: Primary text
- Line height: 1.1
- Animation: **Fade-in + Slide-up** (stagger: 100ms per word)
- Gradient text effect on "Organized" (orange gradient)

**3. Subheading**
- Text: "Supercharge your productivity with AI-powered task management. Simple, beautiful, and blazingly fast."
- Typography: 1.25rem (xl), normal weight
- Color: Secondary text
- Max width: 600px
- Line height: 1.6
- Animation: **Fade-in + Slide-up** (delay: 300ms)

**4. CTA Buttons (Flex row, gap: 1rem)**

**Primary Button: "Get Started Free"**
- Background: Orange
- Text: White
- Padding: 0.875rem 2rem
- Border radius: md
- Font: 1rem, medium weight
- Icon: Arrow right (→) with slide animation on hover
- Hover: Scale 1.05 + darker orange
- Animation: **Fade-in + Slide-up** (delay: 500ms)

**Secondary Button: "Watch Demo"**
- Background: Transparent
- Border: 2px solid current color
- Text: Primary text color
- Padding: 0.875rem 2rem
- Icon: Play icon
- Hover: Background fill (light: gray-50, dark: gray-900)
- Animation: **Fade-in + Slide-up** (delay: 600ms)

**5. Dashboard Preview (Mockup)**
- Image/Component: 3D floating task cards OR screenshot with glass morphism
- Width: 100%, max-width: 900px
- Margin top: 4rem
- Animation: **Float animation** (continuous subtle up-down motion)
- Shadow: 2xl shadow
- Border radius: xl
- Border: Subtle gradient border

**Implement using Shadcn:**
- Use `Card` component for floating effect
- Use `Badge` for animated badge
- Use Framer Motion or CSS animations for all transitions

---

### **SECTION 2: Features Section**

#### **Layout**
- Background: (light: gray-50, dark: gray-950)
- Padding: 6rem vertical, 2rem horizontal
- Max width: 1200px, centered

#### **Section Header**
```
        Features that make you productive
    Everything you need to stay organized and focused
```

- Heading: 3rem (5xl), bold, center-aligned
- Subheading: 1.125rem (lg), secondary color, center-aligned
- Margin bottom: 4rem

#### **Feature Cards (3 Clickable Cards)**

**Grid Layout:**
- Display: Grid
- Columns: 3 (desktop), 1 (mobile)
- Gap: 2rem
- Each card: Clickable, links to feature page or scrolls to section

**Card Structure:**
```
┌─────────────────────────┐
│    [Icon - Animated]     │
│                         │
│   Feature Title         │
│                         │
│   Brief description     │
│   of the feature here   │
│                         │
│   [Learn More →]        │
└─────────────────────────┘
```

**Card 1: AI-Powered Organization**
- Icon: `Brain` or `Sparkles` (Lucide)
- Title: "AI-Powered Organization"
- Description: "Let AI help you prioritize, categorize, and manage your tasks intelligently."
- Link: Navigate to `/features/ai` or scroll to AI section

**Card 2: Smart Reminders**
- Icon: `Bell` or `Clock` (Lucide)
- Title: "Smart Reminders"
- Description: "Never miss a deadline with intelligent notifications and recurring task automation."
- Link: Navigate to `/features/reminders`

**Card 3: Cross-Platform Sync**
- Icon: `RefreshCw` or `Cloud` (Lucide)
- Title: "Real-Time Sync"
- Description: "Access your tasks anywhere, anytime. Seamless sync across all your devices."
- Link: Navigate to `/features/sync`

**Card Styling:**
- Background: (light: white, dark: gray-900)
- Border: 1px solid border color
- Border radius: lg
- Padding: 2.5rem
- Shadow: md shadow
- Cursor: pointer
- Transition: All 300ms

**Icon Styling:**
- Size: 3rem (48px)
- Color: Orange
- Background: Orange/10 circle (64px diameter)
- Margin bottom: 1.5rem
- Animation: **Icon bounce** on card hover

**Hover Effect:**
- Transform: translateY(-8px)
- Shadow: xl shadow
- Border color: Orange
- Icon: Rotate or scale animation

**Click Animation:**
- Brief scale down (0.98) then navigate

**Use Shadcn:**
- `Card`, `CardHeader`, `CardContent` components
- Lucide React icons
- Framer Motion for hover animations

---

### **SECTION 3: How It Works Section**

#### **Layout**
- Background: (light: white, dark: black)
- Padding: 6rem vertical
- Max width: 1000px, centered

#### **Section Header**
```
           How It Works
    Get started in three simple steps
```

#### **Timeline Layout (Vertical on mobile, Horizontal on desktop)**

**Step 1: Sign Up**
```
  ①
  │
[Icon]
Sign Up
Create your free account in seconds
```

**Step 2: Add Tasks**
```
  ②
  │
[Icon]
Add Tasks
Organize your work with smart lists
```

**Step 3: Stay Productive**
```
  ③
  │
[Icon]
Stay Productive
Let AI help you focus on what matters
```

**Styling:**
- Numbers: Large (2xl), orange, bold, in circle
- Icons: 2.5rem, orange
- Title: 1.5rem (2xl), bold
- Description: 1rem, secondary color
- Connecting line: Dotted orange line between steps
- Animation: **Fade-in sequence** as user scrolls (Intersection Observer)

**Use Shadcn:**
- Custom timeline component
- Scroll-triggered animations

---

### **SECTION 4: Testimonials Section**

#### **Layout**
- Background: Gradient (light: white → orange/5, dark: black → orange/10)
- Padding: 6rem vertical
- Max width: 1200px, centered

#### **Section Header**
```
      Loved by thousands of users
```

#### **Testimonial Cards (3 cards, horizontal scroll on mobile)**

**Card Structure:**
```
┌─────────────────────────┐
│ ⭐⭐⭐⭐⭐               │
│                         │
│ "Amazing app! It has    │
│  completely transformed │
│  how I manage my day."  │
│                         │
│ [Avatar] Sarah Johnson  │
│          Product Manager│
└─────────────────────────┘
```

**Styling:**
- Background: (light: white, dark: gray-900)
- Padding: 2rem
- Border radius: lg
- Shadow: md
- Stars: Orange color
- Quote: 1.125rem, italic
- Avatar: 48px circle
- Name: Bold
- Role: Secondary color, smaller
- Animation: **Subtle float** + **Fade-in on scroll**

**Use Shadcn:**
- `Card` component
- `Avatar` component
- Carousel for mobile

---

### **SECTION 5: CTA (Call-to-Action) Section**

#### **Layout**
- Background: Orange gradient
- Padding: 6rem vertical
- Full width
- Text: White
- Center-aligned

#### **Content**
```
        Ready to get organized?
    Join thousands of users today

    [Start Free Trial →]
```

- Heading: 3rem (5xl), bold, white
- Subheading: 1.25rem (xl), white/90
- Button: Large, white background, orange text, hover: scale + shadow

**Animation:**
- Background: Animated gr            │
└─────────────────────────────────────────┘
```

### **Background**
- Full viewport height
- Gradient background (orange/5 to orange/10)
- Optional: Animated particles or blurred shapes

### **Auth Card**

**Card Styling:**
- Width: 480px (max)
- Background: (light: white, dark: gray-900)
- Border radius: xl
- Shadow: 2xl
- Padding: 3rem
- Center-aligned (both axes)

**Tabs Component (Shadcn Tabs):**
- Two tabs: "Login" and "Sign Up"
- Active tab: Orange underline, orange text
- Inactive tab: Gray text
- Tab switch animation: Smooth content fade-in/out

### **Login Tab Content**

**Form Fields:**
1. Email Input
   - Label: "Email"
   - Placeholder: "you@example.com"
   - Type: email
   - Required validation
   - Icon: Mail icon (left side)

2. Password Input
   - Label: "Password"
   - Placeholder: "Enter your password"
   - Type: password
   - Required validation
   - Icon: Lock icon (left side)
   - Show/Hide toggle (Eye icon, right side)

3. Remember Me Checkbox + Forgot Password Link
   - Flex row, space-between
   - Checkbox: Orange when checked
   - Link: Orange, underline on hover

**Submit Button:**
- Text: "Sign In"
- Width: Full
- Background: Orange
- Padding: 0.875rem
- Hover: Darker orange + subtle scale
- Loading state: Spinner inside button

**Divider:**
- Text: "or continue with"
- Horizontal lines on both sides

**Google Sign-In Button:**
- Background: White (light), Gray-800 (dark)
- Border: 1px solid gray
- Icon: Google logo
- Text: "Continue with Google"
- Hover: Background change

### **Sign Up Tab Content**

**Form Fields:**
1. Name Input
   - Label: "Full Name"
   - Icon: User icon

2. Email Input
   - (Same as login)

3. Password Input
   - (Same as login)

4. Confirm Password Input
   - Label: "Confirm Password"
   - Validation: Must match password
   - Icon: Lock icon

**Submit Button:**
- Text: "Create Account"
- (Same styling as login)

**Terms & Privacy:**
- Small text below button
- Checkboxes or link: "By signing up, you agree to our Terms and Privacy Policy"
- Links: Orange, underline on hover

### **CRITICAL: Preserve Existing Logic**

**DO NOT MODIFY:**
- Form validation functions
- API call functions (login, signup, OAuth)
- Authentication state management
- Route navigation after success
- Error handling logic
- Token storage/management

**ONLY MODIFY:**
- JSX structure for tabs
- CSS classes and styling
- Animation/transition effects
- Input component styling
- Button styling

**Implementation Notes:**
- Use Shadcn `Tabs`, `Input`, `Button`, `Label` components
- Use existing form submission handlers
- Keep all `onSubmit`, `onChange` handlers intact
- Only wrap existing inputs with styled components
- Add animations without changing form behavior

---

## 🏠 **Home Page (Authenticated Users)**

### **Route**
- Path: `/` or `/home` (after login redirect)
- **This is different from the public landing page**

### **Page Structure (5 Sections)**
```
1. Welcome Hero (Personalized greeteview team feedback              │
│ ⬜ Update documentation              │
│ [View All →]                        │
└─────────────────────────────────────┘
```

**Styling:**
- Card background
- Each task: Flex row, checkbox + text
- Checkbox: Orange when checked
- Hover: Background highlight
- Completed tasks: Line-through, gray text
- Animation: Stagger fade-in (50ms delay each)

---

### **SECTION 4: Productivity Insights**

**Chart/Visual:**
- Bar chart or line chart showing task completion over last 7 days
- Use Recharts library
- Orange theme
- Tooltip on hover
- Responsive

**Alternative: Progress rings**
```
    ⭕ 67%        ⭕ 80%
   Tasks Done   On Time
```

---

### **SECTION 5: Quick Actions**

**Button grid:**
```
┌──────────────┐ ┌──────────────┐
│ + New Task   │ │ 📊 Reports   │
└──────────────┘ └──────────────┘
┌──────────────┐ ┌──────────────┐
│ 🔔 Reminders │ │ ⚙️ Settings  │
└──────────────┘ └──────────────┘
```

**Styling:**
- Large icon buttons
- Background: Subtle (orange/5)
- Border: 1px solid orange/20
- Hover: Orange background, white text
- Border radius: lg
- Padding: 1.5rem
- Icon + text layout

---

## ✅ **Todo Application Page**

### **Route**
- Path: `/todos` or `/tasks` (accessible from navbar)

### **CRITICAL CONSTRAINT**
**🚨 DO NOT MODIFY ANY EXISTING LOGIC:**
- Task CRUD operations (Create, Read, Update, Delete)
- API calls to backend
- State management (useState, useEffect, etc.)
- Form validation
- Data fetching
- Filter/sort logic
- Authentication checks

**✅ ONLY ADD STYLING TO:**
- Layout components
- CSS classes
- Animations
- Visual effects
- Component wrappers

---

### **Page Layout**
```
┌─  - Medium Priority
     - Low Priority
   - Active filter: Orange badge on button

3. **Sort Dropdown**
   - Button: "Sort" + dropdown icon
   - Options:
     - Date Created (Newest)
     - Date Created (Oldest)
     - Due Date
     - Priority
     - Alphabetical
   - Active sort: Icon indicator

**Right Side:**
**"+ New Task" Button**
- Background: Orange
- Text: White
- Icon: Plus icon
- Padding: 0.75rem 1.5rem
- Hover: Darker orange + scale 1.05
- Responsive: Icon only on mobile

### **Task List Container**

**Layout:**
- Max width: 900px
- Centered
- Margin top: 2rem
- Background: Transparent
- Padding: 1rem

### **Individual Task Card**

**Card Structure:**
```
┌─────────────────────────────────────────────────────┐
│ [✓] Task title here                   [⋮ Menu]     │
│     Task description/notes (if any)                 │
│     🏷️ Work  📅 Due: Tomorrow  ⚠️ High             │
└─────────────────────────────────────────────────────┘
Styling:

Background: (light: white, dark: gray-900)
Border: 1px solid border color
Border radius: md
Padding: 1.5rem
Margin bottom: 1rem
Shadow: sm
Hover: Shadow md + border color orange/30
Transition: All 200ms

Checkbox:

Size: 24px
Border: 2px solid gray
Border radius: sm
Checked: Orange background, white checkmark
Animation: Scale + checkmark draw animation
PRESERVE: Existing onChange handler

Task Title:

Font: 1.125rem (lg), medium weight
Color: Primary text
Completed state: Line-through + gray color
Editable: Double-click to edit (if logic exists)

Task Description:

Font: 0.875rem (sm)
Color: Secondary text
Margin top: 0.5rem
Max lines: 2 (truncate with ellipsis)

Metadata Row (Tags, Due Date, Priority):

Display: Flex row, gap: 1rem
Font: 0.75rem (xs)
Icon + text pairs
Colors:

Tag: Blue background, blue text
Due date: Gray background, gray text


Continue1:25 AM(red if overdue)

Priority: Orange/Yellow/Green based on level

Action Menu (Three dots):

Position: Top right
Icon: MoreVertical (Lucide)
Dropdown menu:

✏️ Edit
🗑️ Delete
🔔 Set Reminder
🔄 Duplicate


Menu style: Shadcn DropdownMenu
PRESERVE: All existing click handlers

Animations

Task Entry Animation:

New tasks: Slide-in from right + fade-in
Duration: 300ms
Easing: cubic-bezier


Task Completion Animation:

Checkbox check: Scale + rotate
Task card: Fade opacity to 60% + slight scale down
Move to bottom: Smooth reorder (if logic exists)


Task Deletion Animation:

Slide-out to left + fade-out
Duration: 200ms
Then remove from DOM


Hover Animation:

Shadow increase
Subtle scale (1.01)
Border color change


Empty State Animation:
If no tasks:

       📝
   No tasks yet!
   Create your first task to get started.

Icon: Bounce animation
Text: Fade-in
Illustration: Optional (use Lucide icons)

Responsive Behavior
Desktop (> 768px):

Task cards: Full width
Action bar: Horizontal layout
3-column metadata

Tablet (768px - 1024px):

Task cards: Full width
Action bar: Horizontal with wrapping
2-column metadata

Mobile (< 768px):

Search: Full width
Filters/Sort: Icon buttons only
Task cards: Full width, stacked
Metadata: Vertical stack
Action menu: Always visible (not hidden)


tfoot>
Structure
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Todo App               Quick Links        Connect          │
│  Your productivity      Home               GitHub           │
│  companion              Features           Twitter          │
│                         Pricing            LinkedIn         │
│                         Contact                             │
│                                                             │
├ween icons

Bottom Bar

Border top: 1px solid gray-800
Padding top: 2rem
Display: Flex, space-between
Copyright: "© 2025 Todo App. All rights reserved."
Links: Privacy | Terms (separated by |)
Link hover: Orange underline


商圈 Theme Implementation
Global CSS (globals.css)
css/* Theme CSS Variables */
:root {
  /* Light Theme */
  --background: 0 0% 100%;
  --foreground: 0 0% 10%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 10%;
  --primary: 16 100% 60%; /* Orange */
  --primary-foreground: 0 0% 100%;
  --border: 0 0% 90%;
  /* ... (all variables from design system) */
}

.dark {
  /* Dark Theme */
  --background: 0 0% 4%;
  --foreground: 0 0% 100%;
  --card: 0 0% 10%;
  --card-foreground: 0 0% 100%;
  --primary: 16 100% 60%; /* Orange */
  --primary-foreground: 0 0% 100%;
  --border: 0 0% 20%;
  /* ... (all dark variables) */
}
Theme Context (ThemeProvider)
File: context/ThemeContext.tsx
typescript'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Get saved theme from localStorage
    const saved = localStorage.getItem('theme') as Theme
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
Theme Toggle Component
typescript'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-10 w-10 rounded-full"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
Usage in Layout
Wrap entire app with ThemeProvider in root layout:
typescriptimport { ThemeProvider } from '@/context/ThemeContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

📦 Required Libraries & Tools
Shadcn/ui Components to Install
bashnpx shadcn@latest init
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add checkbox
npx shadcn@latest add select
Additional Libraries
bashnpm install lucide-react         # Icons
npm install framer-motion        # Animations
npm install recharts             # Charts
npm install clsx                 # Conditional classes
npm install tailwind-merge       # Merge Tailwind classes
Optional (for advanced animations)
bashnpm install @react-spring/web    # Spring animations
npm install aos                  # Scroll animations

✅ Implementation Checklist
Phase 1: Setup & Theme

 Install all required libraries
 Set up Shadcn/ui with Tailwind config
 Create ThemeProvider context
 Implement ThemeToggle component
 Add global CSS variables
 Test theme switching

Phase 2: Navigation

 Create Navbar component
 Implement unauthenticated state (Home, About, Features, Login/Signup)
 Implement authenticated state (Avatar dropdown, Logout)
 Add sticky scroll behavior
 Add mobile hamburger menu
 Add animations (hover, active states)

Phase 3: Public Home Page

 Hero section with animations
 Features section (3 clickable cards)
 How It Works section (timeline)
 Testimonials section
 CTA section
 Test all animations and interactions

Phase 4: Auth Page

 Create unified auth card
 Implement tab switching (Login/Signup)
 Style form inputs (preserve existing handlers)
 Add validation UI (errors, success states)
 Add loading states
 Test form submission (ensure logic works)

Phase 5: Authenticated Home Page

 Welcome hero section
 Quick stats dashboard
 Recent tasks preview
 Productivity insights (chart)
 Quick actions grid

Phase 6: Todo Application Page

 Style action bar (search, filter, sort, new task)
 Style task cards (preserve all logic)
 Add task animations (entry, completion, deletion)
 Add hover effects
 Add empty state
 Test CRUD operations (ensure no logic breaks)

Phase 7: Footer

 Create footer component
 Add branding, links, social icons
 Add copyright section
 Make responsive

Phase 8: Polish & Testing

 Test all pages in light/dark mode
 Test responsive design (mobile, tablet, desktop)
 Test all animations
 Test navigation flow
 Ensure no existing logic is broken
 Performance optimization (lazy loading, code splitting)


🚨 CRITICAL REMINDERS
DO NOT MODIFY:

❌ Authentication logic
❌ API calls
❌ Form validation functions
❌ State management
❌ Route handlers
❌ Database operations
❌ CRUD operations

ONLY MODIFY:

✅ JSX structure
✅ CSS classes
✅ Tailwind utilities
✅ Component wrappers
✅ Animations
✅ Visual effects
✅ Layout components

Testing Protocol:

After every change, test the affected functionality
Ensure forms still submit correctly
Ensure API calls still work
Ensure authentication flow is intact
Test theme switching on all pages
Test responsive design


📝 Prompt for Claude Code
markdownYou are implementing the UI/UX specification for a Todo Web Application.

**CRITICAL CONSTRAINTS:**
1. PRESERVE ALL EXISTING LOGIC - Do not modify any authentication, API calls, state management, or CRUD operations
2. ONLY ADD STYLING - Use Tailwind CSS, Shadcn/ui, and animations
3. FOLLOW THE SPEC EXACTLY - Color scheme (Orange + Black/White), typography, spacing
4. USE SHADCN COMPONENTS - Button, Card, Input, Tabs, Avatar, etc.
5. IMPLEMENT THEME SWITCHING - Light/Dark mode with orange accent

**Implementation Order:**
1. Set up ThemeProvider and global CSS
2. Create Navbar with theme toggle
3. Build public home page (5 sections with animations)
4. Style unified auth page (tabs for login/signup)
5. Build authenticated home page (5 sections)
6. Style todo application page (preserve all existing logic)
7. Create footer component

**Key Requirements:**
- Orange (#FF6B35) as primary color
- Dark mode: Black backgrounds, Dark theme: Black backgrounds
- Light mode: White backgrounds
- Smooth animations using Framer Motion
- Responsive design (mobile-first)
- Professional, expert-level UI/UX
- Glassmorphism effects where appropriate

**Testing:**
After each component, verify:
- Theme switching works
- Existing functionality is intact
- Responsive design works
- Animations are smooth
- No console errors

Refer to the complete specification document for detailed styling requirements.

🎉 Expected Outcome
After implementing this spec, your Todo application will have:

✨ Professional UI - Expert-level design that rivals SaaS products
🎨 Cohesive Theme - Seamless dark/light mode switching with orange branding
🎬 Smooth Animations - Engaging user experience with sophisticated transitions
📱 Responsive Design - Perfect on all devices
🔒 Preserved Logic - All existing functionality works flawlessly
🚀 Production-Ready - Polish and attention to detail throughout


Kya aap chahti hain ke main:

Is spec ko ek .md file mein convert kar doon (download ke liye)?
Koi specific section ko aur detail mei      │
└─────────────────────────────────────────┘
Implementation:

Animated Logo (Center)

Icon: CheckSquare or custom todo icon
Size: 4rem (64px)
Color: Orange
Animation:



     - Fade in (0-300ms)
     - Pulse/breathe effect (continuous)
     - Rotate 360° on loop
     - Scale: 1 → 1.1 → 1 (2s loop)

Progress Bar

Width: 300px
Height: 8px
Background: Gray-200 (light), Gray-800 (dark)
Fill: Orange gradient (left to right)
Border radius: Full (pill shape)
Animation:



     - Width fills from 0% → 100% (2-3 seconds)
     - Shimmer effect on fill (moving gradient)
     - Smooth easing: cubic-bezier(0.4, 0, 0.2, 1)

Percentage text: Above bar, orange, animated counting


Loading Text

Font: 1rem, medium weight
Color: Secondary text
Position: Below progress bar
Animation:



     - Text changes every 800ms:
       "Loading your workspace..."
       "Fetching your tasks..."
       "Preparing your dashboard..."
       "Almost there..."
     - Fade transition between texts
     - Optional: Typing effect (characters appear one by one)

Background Effects

Gradient background (orange/5 → orange/10)
Optional: Floating particles (orange dots)
Optional: Animated gradient shift


Success Transition

When loading complete:



     ✓ Ready!
     - Checkmark appears with pop animation
     - Green color
     - Scale: 0 → 1.2 → 1
     - Then fade out entire loading screen
     - Dashboard fades in from behind
Code Structure:
typescript<LoadingScreen>
  <AnimatedLogo />
  <ProgressBar progress={loadingProgress} />
  <LoadingText messages={loadingMessages} />
  <ParticleEffect />
</LoadingScreen>
```

---

#### **Page Transition Loading (Between Routes)**

**Scenario:** User navigates from Home → Todo App, or any page change.

**Design: Top Progress Bar (YouTube/GitHub style)**
```
[▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░]
```

**Implementation:**
- Position: Fixed, top: 0, full width
-──┐
│ ⬜ Task being dragged                │  ← Lifted shadow
│ (slightly rotated, elevated)        │
└─────────────────────────────────────┘

┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐
│  Drop zone placeholder (dashed)    │  ← Drop indicator
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘
```

**Animations:**
1. **Grab Cursor** when hovering drag handle
2. **Lift Effect**: Scale 1.05 + shadow xl
3. **Rotation**: Slight 3deg tilt
4. **Drop Zone**: Animated dashed border
5. **Reorder Animation**: Smooth position transition
6. **Drop Animation**: Scale back to 1, rotate to 0

**Icon:** Six dots (⋮⋮) on left side of task card

---

### **FEATURE 5: Task Completion Celebration**

**When user completes a task:**

**Animation Sequence:**
1. **Confetti Burst** 🎉
   - Colored particles explode from checkbox
   - Orange, yellow, white colors
   - Particles fall with gravity
   - Duration: 1.5 seconds
   - Library: `canvas-confetti`

2. **Success Toast**
```
   ┌────────────────────────┐
   │ ✅ Task completed!     │
   │ Great job! 🎉         │
   └────────────────────────┘
```
   - Position: Top-right corner
   - Green background
   - White text
   - Auto-dismiss after 3 seconds
   - Slide-in from right animation

3. **Task Card Animation**
   - Green glow around card (brief)
   - Scale down slightly
   - Fade opacity
   - Move to "Completed" section (if exists)

**Milestone Celebrations:**
- **5 tasks completed**: "You're on fire! 🔥"
- **10 tasks**: "Productivity champion! 🏆"
- **All tasks done**: "All done! Time to relax! 🌟"

---

### **FEATURE 6: Smart Due Date Indicators**

**Visual Due Date System:**
```
📅 Overdue (Red)
   ❗ 2 days overdue

📅 Due Today (Orange)
   ⏰ Due in 3 hours

📅 Due Soon (Yellow)
   📆 Du   │
│ T      Toggle theme                 │
└─────────────────────────────────────┘
```

**Visual Indicators:**
- Keyboard key styling (like GitHub)
- Monospace font
- Gray background boxes
- Smooth modal fade-in

---

### **FEATURE 9: Task Analytics Dashboard**

**New Page/Section: `/analytics`**

**Visualizations:**

1. **Completion Rate Chart**
```
   ┌─────────────────┐
   │   📊 85%        │  ← Circular progress
   │ Completion Rate │
   └─────────────────┘
```
   - Animated circular progress bar
   - Orange fill
   - Percentage in center

2. **Weekly Activity Heatmap**
```
   Mon  ▓▓▓ 12 tasks
   Tue  ▓▓░  8 tasks
   Wed  ▓▓▓ 15 tasks
   Thu  ▓░░  5 tasks
   Fri  ▓▓▓ 14 tasks
   Sat  ▓░░  3 tasks
   Sun  ░░░  0 tasks
```
   - GitHub-style contribution graph
   - Orange gradient (light → dark)
   - Tooltip on hover showing exact count

3. **Category Distribution (Pie Chart)**
   - Work: 40%
   - Personal: 30%
   - Health: 20%
   - Other: 10%
   - Interactive (click to filter)

4. **Productivity Streak**
```
   🔥 7-day streak!
   Keep it going!
```
   - Fire emoji with counter
   - Animated flame
   - Encouragement message

---

### **FEATURE 10: Collaborative Features (Future)**

**Task Sharing Preview:**
```
┌─────────────────────────────────────┐
│ 👥 Shared with 3 people             │
│ ⬜ Team project deadline             │
│ 👤👤👤 + Assign                     │
└─────────────────────────────────────┘
Avatar Stack:

Overlapping circles
Max 3 visible, then "+2"
Hover: Show all names


FEATURE 11: Dark Mode Transitions
Enhanced Theme Switching Animation:
When toggling dark mode:

Circular Reveal Animation

Starts from theme toggle button
Expands in circle
Reveals dark/light theme
Duration: 600ms
Smooth easing


Element Transitions

All colors: 300ms transition
Shadows: Fade in/out
Background: Gradient shift



Implementation:
typescript// Use View Transitions API (modern browsers)
document.startViewTransition(() => {
  toggleTheme()
})
```

---

### **FEATURE 12: Onboarding Tour (First-time Users)**

**After first login:**

**Spotlight Tour:**
```
Step 1/5
     ↓
┌─────────────────────┐
│ This is your navbar │  ← Tooltip
│ Navigate here       │
└─────────────────────┘
     ↓
[Highlighted navbar]
```

**Steps:**
1. Welcome + navbar
2. Create first task
3. Set priority & tags
4. Mark as complete
5. Theme toggle

**Visual:**
- Dark overlay (dimmed background)
- Spotlight on focused element
- Animated arrows/pointers
- Skip/Next/Back buttons
- Progress dots at bottom

**Library:** `react-joyride` or custom implementatio○ ○ ○  ← Progress dots│
│                                         │
└─────────────────────────────────────────┘
HTML/JSX Structure:
typescript<div className="loading-screen">
  {/* Animated Logo */}
  <div className="logo-container">
    <CheckSquare className="logo-icon" />
    <div className="logo-pulse" />
  </div>

  {/* Progress Bar */}
  <div className="progress-container">
    <div className="progress-bar">
      <div className="progress-fill" style={{width: `${progress}%`}} />
      <div className="progress-shimmer" />
    </div>
    <span className="progress-text">{progress}%</span>
  </div>

  {/* Loading Message */}
  <p className="loading-message">
    <span className="emoji">🚀</span>
    <span className="text">{currentMessage}</span>
  </p>

  {/* Progress Dots */}
  <div className="progress-dots">
    {[1,2,3,4,5].map(i => (
      <div className={`dot ${i <= step ? 'active' : ''}`} />
    ))}
  </div>
</div>
CSS/Tailwind Classes:
typescriptconst loadingScreenClasses = {
  container: `
    fixed inset-0 z-50
    flex flex-col items-center justify-center
    bg-gradient-to-br from-orange-50 via-white to-orange-100
    dark:from-gray-950 dark:via-black dark:to-gray-900
  `,
  logoContainer: `
    relative mb-12
    animate-pulse-slow
  `,
  logoIcon: `
    w-16 h-16 text-orange-500
    animate-spin-slow
  `,
  logoPulse: `
    absolute inset-0 -z-10
    rounded-full bg-orange-500/20
    animate-ping
  `,
  progressContainer: `
    w-80 mb-8
  `,
  progressBar: `
    relative h-2 w-full
    bg-gray-200 dark:bg-gray-800
    rounded-full overflow-hidden
  `,
  progressFill: `
    h-full bg-gradient-to-r from-orange-400 to-orange-600
    transition-all duration-300 ease-out
    rounded-full
  `,
  progressShimmer: `
    absolute inset-0
    bg-gradient-to-r from-transparent via-white/30 to-transparent
    animate-shimmer
  `,
  progressText: `
    block text-center mt-2
    text-sm font-medium text-orange-600 dark:text-orange-400
    tabular-nums
  `,
  loadingMessage: `
    flex items-center gap-2
    text-base text-gray-600 dark:text-gray-400
    font-medium
  `,
  emoji: `
    text-2xl
    animate-bounce
  `,
  text: `
    animate-fade-in
  `,
  progressDots: `
    flex gap-2 mt-8
  `,
  dot: `
    w-2 h-2 rounded-full
    bg-gray-300 dark:bg-gray-700
    transition-all duration-300
  `,
  dotActive: `
    bg-orange-500 scale-125
  `
}
Custom Animations (tailwind.config.js):
javascriptmodule.exports = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
Loading Messages Array:
typescriptconst loadingMessages = [
  '🚀 Loading your workspace...',
  '📋 Fetching your tasks...',
  '🎨 Preparing your dashboard...',
  '✨ Setting things up...',
  '🎯 Almost there...',
  '✅ Ready!',
]
Component Logic:
typescriptconst [progress, setProgress] = useState(0)
const [messageIndex, setMessageIndex] = useState(0)
const [step, setStep] = useState(1)

useEffect(() => {
  // Progress simulation
  const progressInterval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 100) {
        clearInterval(progressInterval)
        return 100
      }
      return prev + Math.random() * 15
    })
  }, 300)

  // Message rotation
  const messageInterval = setInterval(() => {
    setMessageIndex(prev => (prev + 1) % loadingMessages.length)
    setStep(prev => Math.min(prev + 1, 5))
  }, 800)

  return () => {
    clearInterval(progressInterval)
    clearInterval(messageInterval)
  }
}, [])

2. Page Transition Loading (Top Bar)
Component: <PageLoadingBar />
typescriptimport { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 500,
})

// Custom CSS override
const customNProgressCSS = `
  #nprogress {
    pointer-events: none;
  }
  #nprogress .bar {
    background: linear-gradient(
      90deg,
      #FF6B35 0%,
      #FF8C61 50%,
      #FFA587 100%
    );
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    box-shadow: 0 0 10px #FF6B35, 0 0 5px #FF6B35;
  }
  #nprogress .peg {
    box-shadow: 0 0 15px #FF6B35, 0 0 8px #FF6B35;
  }
`

// Usage in layout
useEffect(() => {
  router.events?.on('routeChangeStart', () => NProgress.start())
  router.events?.on('routeChangeComplete', () => NProgress.done())
  router.events?.on('routeChangeError', () => NProgress.done())
}, [])

3. Component Loading (Skeletons)
Task List Skeleton:
typescriptexport function TaskSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-lg p-4
          animate-pulse
        ">
          {/* Checkbox skeleton */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />

              {/* Tags skeleton */}
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </div>

            {/* Action menu skeleton */}
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
Stats Card Skeleton:
typescriptexport function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-800
          rounded-lg p-6
          animate-pulse
        ">
          {/* Icon skeleton */}
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />

          {/* Number skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />

          {/* Label skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
      ))}
    </div>
  )
}
Shimmer Effect Enhancement:
css@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

.dark .skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #1a1a1a 0%,
    #2d2d2d 50%,
    #1a1a1a 100%
  );
}

4. Button Loading States
Submit Button with Spinner:
typescript<Button
  type="submit"
  disabled={isLoading}
  className="relative"
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    <>
      <Plus className="mr-2 h-4 w-4" />
      Create Task
    </>
  )}
</Button>
Success State Animation:
typescript<Button
  className={cn(
    "transition-all duration-300",
    success && "bg-green-500 hover:bg-green-600"
  )}
>
  {success ? (
    <>
      <Check className="mr-2 h-4 w-4 animate-in zoom-in" />
      Success!
    </>
  ) : loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    <>
      <Save className="mr-2 h-4 w-4" />
      Save Task
    </>
  )}
</Button>

5. Empty State with Animation
No Tasks Found:
typescriptexport function EmptyTasksState() {
  return (
    <div className="
      flex flex-col items-center justify-center
      py-16 px-4
      text-center
    ">
      {/* Animated icon */}
      <div className="relative mb-6">
        <ListTodo className="
          w-24 h-24 text-gray-300 dark:text-gray-700
          animate-bounce
        " />
        <Sparkles className="
          absolute -top-2 -right-2
          w-8 h-8 text-orange-500
          animate-pulse
        " />
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        No tasks yet!
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        Create your first task to get started on your productivity journey.
      </p>

      {/* CTA */}
      <Button
        onClick={onThis response paused because Claude reached its max length for a message. Hit continue to nudge Claude along.ContinueClaude is AI and can make mistakes. Please double-check responses.
CreateTask}
className="animate-in fade-in slide-in-from-bottom-4"
>
<Plus className="mr-2 h-4 w-4" />
Create Your First Task
</Button>
</div>
)
}

---

### **6. Toast Notifications with Animations**

**Success Toast:**
```typescript
import { toast } from 'sonner'

toast.success('Task completed! 🎉', {
  description: 'Great job! Keep up the momentum.',
  duration: 3000,
  className: '
    bg-green-50 dark:bg-green-950
    border-green-200 dark:border-green-800
  ',
  icon: <Check className="text-green-500" />,
})
```

**Custom Toast Component:**
```typescript
<Toaster
  position="top-right"
  toastOptions={{
    className: '
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
      shadow-lg
    ',
    style: {
      padding: '16px',
    },
  }}
  icons={{
    success: <Check className="text-green-500" />,
    error: <X className="text-red-500" />,
    warning: <AlertTriangle className="text-yellow-500" />,
    info: <Info className="text-blue-500" />,
  }}
/>
```

---

## 📦 **Additional Libraries Needed**
```bash
# Loading animations
npm install nprogress
npm install react-loading-skeleton

# Toast notifications
npm install sonner

# Confetti
npm install canvas-confetti
npm install react-confetti

# Charts
npm install recharts

# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable

# Keyboard shortcuts
npm install react-hotkeys-hook

# Onboarding
npm install react-joyride

# Icons (if not already installed)
npm install lucide-react
```

---

## ✅ **FINAL IMPLEMENTATION CHECKLIST**

### **Loading States**
- [ ] Full-screen app loading with animated logo
- [ ] Progress bar with shimmer effect
- [ ] Rotating loading messages
- [ ] Success checkmark transition
- [ ] Top loading b
```

## Response Text

This feature specification outlines a comprehensive UI/UX transformation for a Todo Web Application. The main objectives include creating a world-class, production-ready interface with expert-level styling and animations, implementing seamless dark/light theme switching with orange as the primary accent, building 5 engaging homepage sections with sophisticated animations, designing a unified auth experience with tabs for login/signup, and creating an animated, professional todo application interface with responsive design.

The specification emphasizes preserving all existing logic (authentication, API calls, database operations, state management) while only modifying styling, layout, animations, visual components, and theme systems. The design system includes a detailed color palette, typography scale, spacing system, border radius, and shadows for both light and dark themes.

Key deliverables include:
- 5-section landing page with animations for unauthenticated users
- Unified auth page with tabbed login/signup
- Enhanced todo application interface
- Professional navigation with theme toggle
- Responsive design across all devices
- Accessibility compliance
- Performance optimization

The success criteria focus on maintaining all existing functionality while delivering a professional SaaS-quality interface with smooth animations and intuitive user experience.