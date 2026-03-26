# 📱 Responsive Design & Device Detection Guide

## ✅ Fitur Baru

### 1. Device Detection
- Auto-detect PC, Tablet, atau Mobile
- Smart redirect berdasarkan device type
- Optimized UI untuk setiap device

### 2. Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-optimized untuk mobile
- Keyboard-optimized untuk desktop

## 🎯 Device Detection

### Detection Methods

```typescript
deviceDetection.isMobile()    // true/false
deviceDetection.isTablet()    // true/false
deviceDetection.isDesktop()   // true/false
deviceDetection.getDeviceType() // 'mobile' | 'tablet' | 'desktop'
```

### Detection Criteria

**Mobile:**
- User Agent contains: android, iphone, ipad, etc.
- Screen width < 768px
- Touch support enabled

**Tablet:**
- User Agent contains: ipad, android (non-mobile)
- Screen width: 768px - 1024px

**Desktop:**
- Not mobile and not tablet
- Screen width > 1024px

## 📐 Responsive Breakpoints

### Tailwind CSS Classes

```css
/* Mobile First (default) */
.class-name

/* Tablet (≥768px) */
md:class-name

/* Desktop (≥1024px) */
lg:class-name

/* Large Desktop (≥1280px) */
xl:class-name
```

### Examples

```tsx
// Padding: 4 on mobile, 6 on desktop
className="p-4 md:p-6"

// Text: xl on mobile, 3xl on desktop
className="text-xl md:text-3xl"

// Grid: 1 column on mobile, 3 on desktop
className="grid-cols-1 md:grid-cols-3"

// Hidden on mobile, visible on desktop
className="hidden md:block"
```

## 🎨 Responsive Components

### PairingPage

**Mobile View:**
- Warning message: "Please open on PC"
- Instructions for proper usage
- Device info display
- No QR Code generation

**Desktop View:**
- Large QR Code (400x400)
- Step-by-step instructions
- Feature badges
- Session info

**Responsive Elements:**
```tsx
// Header icon size
w-16 h-16 md:w-20 md:h-20

// Title size
text-3xl md:text-5xl

// Padding
p-8 md:p-12

// Grid columns
grid-cols-2 md:grid-cols-4
```

### ViewerPage

**Mobile View:**
- Compact header
- Smaller video container
- Stacked info cards
- Full-width buttons

**Desktop View:**
- Spacious layout
- Large video container
- Grid info cards
- Side-by-side buttons

**Responsive Elements:**
```tsx
// Container padding
px-3 md:px-4

// Icon size
w-12 h-12 md:w-14 md:h-14

// Text size
text-xl md:text-2xl

// Button layout
flex-col md:flex-row
```

### MobileCameraPage

**Always Optimized for Mobile:**
- Large touch targets (min 44px)
- Full-screen status card
- Big stop button
- Clear visual feedback

## 🔍 Device-Specific Features

### Mobile Detection in PairingPage

```typescript
useEffect(() => {
  const type = deviceDetection.getDeviceType();
  setDeviceType(type);

  if (type === 'mobile' || type === 'tablet') {
    // Show warning instead of QR
    setStatus('Please open this page on a PC');
    return;
  }

  // Generate QR Code for desktop
  initializePairing();
}, []);
```

### Conditional Rendering

```tsx
{(deviceType === 'mobile' || deviceType === 'tablet') ? (
  <MobileWarning />
) : (
  <QRCodeDisplay />
)}
```

## 📱 Touch Optimization

### Touch Targets
- Minimum size: 44x44px
- Spacing between targets: 8px
- Large buttons on mobile

### Touch Gestures
- Tap: Primary action
- Long press: Secondary action (future)
- Swipe: Navigation (future)

### Examples

```tsx
// Mobile button
className="py-3 px-4 md:py-4 md:px-6"

// Touch-friendly spacing
className="space-y-3 md:space-y-4"
```

## 🖥️ Desktop Optimization

### Hover Effects
```tsx
// Only on desktop (has hover)
className="hover:scale-105 transition-transform"

// Hover background
className="hover:bg-white/20"
```

### Keyboard Navigation
- Tab order logical
- Focus visible
- Enter/Space for actions

### Mouse Interactions
- Hover states
- Cursor pointer
- Smooth transitions

## 📊 Responsive Patterns

### Container Width

```tsx
// Mobile: Full width with padding
// Desktop: Max width centered
className="container mx-auto px-4"
```

### Grid Layouts

```tsx
// 1 column mobile, 3 columns desktop
className="grid grid-cols-1 md:grid-cols-3 gap-4"
```

### Flex Direction

```tsx
// Stack on mobile, row on desktop
className="flex flex-col md:flex-row"
```

### Text Sizing

```tsx
// Smaller on mobile, larger on desktop
className="text-sm md:text-base"
className="text-xl md:text-3xl"
```

### Spacing

```tsx
// Less padding on mobile
className="p-4 md:p-6 lg:p-8"

// Smaller gaps on mobile
className="gap-3 md:gap-4 lg:gap-6"
```

## 🎯 Best Practices

### Mobile First
1. Design for mobile first
2. Add desktop enhancements
3. Test on real devices

### Performance
1. Optimize images for mobile
2. Lazy load off-screen content
3. Minimize JavaScript

### Accessibility
1. Touch targets ≥ 44px
2. Readable text size (≥ 16px)
3. Sufficient color contrast

### Testing
1. Test on multiple devices
2. Test different orientations
3. Test different screen sizes

## 🔧 Device Info API

### Get Device Info

```typescript
const info = deviceDetection.getDeviceInfo();

console.log(info);
// {
//   type: 'mobile',
//   screenSize: 'small',
//   userAgent: '...',
//   platform: 'iPhone',
//   width: 375,
//   height: 812
// }
```

### Check Camera Support

```typescript
const hasCamera = await deviceDetection.hasCamera();
if (hasCamera) {
  // Request camera permission
}
```

## 📐 Breakpoint Reference

| Device | Width | Tailwind | Usage |
|--------|-------|----------|-------|
| Mobile | < 768px | (default) | Phone portrait/landscape |
| Tablet | 768px - 1024px | md: | iPad, tablets |
| Desktop | > 1024px | lg: | Laptop, desktop |
| Large | > 1280px | xl: | Large monitors |

## 🎨 Responsive Typography

```tsx
// Headings
h1: text-3xl md:text-5xl
h2: text-2xl md:text-4xl
h3: text-xl md:text-3xl

// Body
p: text-sm md:text-base
small: text-xs md:text-sm

// Code
code: text-xs
```

## 📦 Responsive Components

### Card

```tsx
<div className="
  bg-white/10 
  backdrop-blur-xl 
  rounded-2xl md:rounded-3xl 
  p-4 md:p-6 
  border border-white/20
">
  {/* Content */}
</div>
```

### Button

```tsx
<button className="
  py-3 md:py-4 
  px-4 md:px-6 
  rounded-xl md:rounded-2xl 
  text-sm md:text-base
  font-bold
">
  {/* Label */}
</button>
```

### Video Container

```tsx
<div className="
  rounded-2xl md:rounded-3xl 
  overflow-hidden
">
  <div style={{ paddingBottom: '56.25%' }}>
    <video className="absolute inset-0 w-full h-full" />
  </div>
</div>
```

## ✅ Testing Checklist

### Mobile (< 768px)
- [ ] QR page shows warning
- [ ] Text readable
- [ ] Buttons touchable
- [ ] No horizontal scroll
- [ ] Images fit screen

### Tablet (768px - 1024px)
- [ ] Layout adapts
- [ ] Touch targets adequate
- [ ] Content readable
- [ ] Navigation works

### Desktop (> 1024px)
- [ ] QR Code displays
- [ ] Hover effects work
- [ ] Layout spacious
- [ ] All features accessible

## 🚀 Future Enhancements

### Planned
- [ ] Orientation detection
- [ ] Network speed detection
- [ ] Battery level detection
- [ ] Dark/Light mode per device

### Experimental
- [ ] Adaptive quality based on device
- [ ] Device-specific features
- [ ] Progressive enhancement

---

**Version:** 2.1
**Last Updated:** 2026-03-26
**Status:** ✅ Responsive & Device-Aware
