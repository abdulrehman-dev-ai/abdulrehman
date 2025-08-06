# Google Analytics Setup Guide

## Overview
This project includes Google Analytics 4 (GA4) integration for tracking website traffic, user behavior, and performance metrics.

## Configuration

### Environment Variables
The Google Analytics tracking is configured using environment variables:

```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-8VSJ4M4TNJ
```

### Components

#### GoogleAnalytics Component
Location: `src/components/GoogleAnalytics.tsx`

This component handles:
- Loading the Google Analytics script
- Initializing tracking
- Automatic page view tracking on route changes
- Providing utility functions for custom event tracking

#### Integration
The component is integrated in `src/app/layout.tsx` to ensure tracking across all pages.

## Tracking Features

### Automatic Tracking
- **Page Views**: Automatically tracked on route changes
- **Session Data**: User sessions and engagement metrics
- **Device Information**: Browser, OS, device type
- **Geographic Data**: Country, region, city (anonymized)

### Custom Event Tracking
Utility functions are available for custom event tracking:

```typescript
import { trackEvent, trackOutboundLink, trackDownload, trackContact } from '@/components/GoogleAnalytics';

// Track custom events
trackEvent('button_click', 'engagement', 'hero_cta');

// Track outbound links
trackOutboundLink('https://github.com/username', 'GitHub Profile');

// Track file downloads
trackDownload('resume.pdf');

// Track contact interactions
trackContact('email');
```

## Analytics Dashboard

Access your analytics data at: [Google Analytics Dashboard](https://analytics.google.com/)

### Key Metrics to Monitor
1. **Traffic Sources**: Where visitors come from
2. **Page Performance**: Most visited pages
3. **User Behavior**: Time on site, bounce rate
4. **Conversions**: Goal completions and events
5. **Demographics**: Age, gender, interests
6. **Technology**: Devices, browsers, screen resolutions

## Privacy Considerations

### Data Collection
- Only anonymous, aggregated data is collected
- No personally identifiable information (PII) is tracked
- IP addresses are anonymized
- Compliant with GDPR and privacy regulations

### Cookie Usage
Google Analytics uses cookies to:
- Distinguish unique users
- Remember user preferences
- Track user sessions

## Setup Instructions

### For New Projects
1. Create a Google Analytics 4 property
2. Get your Measurement ID (format: G-XXXXXXXXXX)
3. Add the ID to your `.env.local` file
4. The tracking will automatically start working

### For This Project
The tracking is already configured with ID: `G-8VSJ4M4TNJ`

## Troubleshooting

### Common Issues
1. **No data appearing**: Check if the Measurement ID is correct
2. **Development vs Production**: Analytics may not show real-time data in development
3. **Ad blockers**: Some users may have analytics blocked

### Verification
1. Check browser developer tools for GA requests
2. Use Google Analytics Real-Time reports
3. Install Google Analytics Debugger extension

## Best Practices

1. **Event Naming**: Use consistent, descriptive event names
2. **Goal Setting**: Define clear conversion goals
3. **Regular Monitoring**: Check analytics weekly
4. **Privacy Compliance**: Ensure compliance with local privacy laws
5. **Performance**: Analytics should not impact site performance

## Additional Resources

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics Guide](https://nextjs.org/docs/basic-features/built-in-css-support)
- [GDPR Compliance Guide](https://support.google.com/analytics/answer/9019185)