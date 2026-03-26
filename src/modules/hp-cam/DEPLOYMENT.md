# Deployment Guide - HP Camera Module

## 🚀 Production Deployment

### Prerequisites
- HTTPS certificate (mandatory)
- Domain name
- Web server (Nginx/Apache)
- Node.js 18+ (for build)

## 📋 Pre-Deployment Checklist

### Security
- [ ] HTTPS enabled
- [ ] Session expiry implemented
- [ ] Authentication added
- [ ] Rate limiting configured
- [ ] CORS properly set
- [ ] CSP headers configured

### Performance
- [ ] Code minified
- [ ] Assets optimized
- [ ] Lazy loading enabled
- [ ] CDN configured (optional)
- [ ] Caching strategy set

### Testing
- [ ] All tests passed
- [ ] Browser compatibility verified
- [ ] Mobile devices tested
- [ ] Performance benchmarked
- [ ] Security audit done

## 🔧 Build Process

### 1. Environment Setup
```bash
# Create production .env
cp .env.example .env.production

# Edit .env.production
VITE_API_URL=https://your-domain.com
VITE_ENABLE_HTTPS=true
```

### 2. Build Application
```bash
cd FE
npm install --production
npm run build
```

Output akan ada di `FE/dist/`

### 3. Verify Build
```bash
# Test production build locally
npm run preview
```

## 🌐 Deployment Options

### Option 1: Nginx

#### Install Nginx
```bash
sudo apt update
sudo apt install nginx
```

#### Configure Nginx
```nginx
# /etc/nginx/sites-available/hp-cam

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # CSP for camera access
    add_header Content-Security-Policy "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;

    # Root directory
    root /var/www/hp-cam/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Disable cache for HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/hp-cam /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Option 2: Apache

#### Install Apache
```bash
sudo apt update
sudo apt install apache2
```

#### Configure Apache
```apache
# /etc/apache2/sites-available/hp-cam.conf

<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /var/www/hp-cam/dist

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
    SSLProtocol all -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite HIGH:!aNULL:!MD5

    # Security Headers
    Header always set Strict-Transport-Security "max-age=31536000"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Content-Security-Policy "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>

    # SPA routing
    <Directory /var/www/hp-cam/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Cache static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public, immutable"
    </FilesMatch>

    # Disable cache for HTML
    <FilesMatch "\.html$">
        Header set Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
    </FilesMatch>
</VirtualHost>
```

#### Enable Site
```bash
sudo a2enmod ssl rewrite headers deflate
sudo a2ensite hp-cam
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### Option 3: Vercel

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy
```bash
cd FE
vercel --prod
```

#### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

### Option 4: Netlify

#### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    Strict-Transport-Security = "max-age=31536000"
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Deploy
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🔒 Security Enhancements

### 1. Add Session Expiry

```typescript
// utils/sessionManager.ts
export const sessionManager = {
  // ... existing code

  isSessionValid(sessionId: string): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;
    
    // Expire after 24 hours
    const expiryTime = 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - session.createdAt > expiryTime;
    
    if (isExpired) {
      this.deleteSession(sessionId);
      return false;
    }
    
    return true;
  }
};
```

### 2. Add Authentication

```typescript
// utils/auth.ts
export const generateAuthToken = (): string => {
  return crypto.randomUUID();
};

export const validateAuthToken = (token: string): boolean => {
  // Implement your validation logic
  return true;
};
```

### 3. Add Rate Limiting

```typescript
// utils/rateLimit.ts
const requestCounts = new Map<string, number>();

export const checkRateLimit = (sessionId: string): boolean => {
  const count = requestCounts.get(sessionId) || 0;
  
  if (count > 100) { // Max 100 requests per minute
    return false;
  }
  
  requestCounts.set(sessionId, count + 1);
  
  // Reset after 1 minute
  setTimeout(() => {
    requestCounts.delete(sessionId);
  }, 60000);
  
  return true;
};
```

## 📊 Monitoring

### 1. Add Analytics

```typescript
// utils/analytics.ts
export const trackEvent = (event: string, data?: any) => {
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', event, data);
  }
  
  // Custom analytics
  console.log('Event:', event, data);
};

// Usage
trackEvent('pairing_started');
trackEvent('camera_approved');
trackEvent('streaming_stopped');
```

### 2. Error Tracking

```typescript
// utils/errorTracking.ts
export const trackError = (error: Error, context?: any) => {
  // Sentry
  if (window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  }
  
  // Custom error tracking
  console.error('Error:', error, context);
};
```

### 3. Performance Monitoring

```typescript
// utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start}ms`);
  
  // Send to analytics
  trackEvent('performance', {
    name,
    duration: end - start
  });
};
```

## 🔍 Health Checks

### Endpoint: /health
```typescript
// Add health check endpoint
export const healthCheck = () => {
  return {
    status: 'ok',
    timestamp: Date.now(),
    version: '1.0.0',
    features: {
      qrCode: true,
      camera: true,
      session: true
    }
  };
};
```

## 📈 Scaling

### Horizontal Scaling
- Use load balancer (Nginx/HAProxy)
- Multiple server instances
- Shared session storage (Redis)

### Vertical Scaling
- Increase server resources
- Optimize code
- Enable caching

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy HP Camera

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd FE
          npm ci
      
      - name: Run tests
        run: |
          cd FE
          npm test
      
      - name: Build
        run: |
          cd FE
          npm run build
      
      - name: Deploy to server
        run: |
          # Your deployment script
          scp -r FE/dist/* user@server:/var/www/hp-cam/
```

## 📝 Post-Deployment

### 1. Verify Deployment
```bash
# Check HTTPS
curl -I https://your-domain.com

# Check health
curl https://your-domain.com/health

# Check QR generation
curl https://your-domain.com/hp-cam
```

### 2. Monitor Logs
```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Apache logs
sudo tail -f /var/log/apache2/access.log
sudo tail -f /var/log/apache2/error.log
```

### 3. Setup Alerts
- Uptime monitoring (UptimeRobot, Pingdom)
- Error alerts (Sentry, Rollbar)
- Performance alerts (New Relic, DataDog)

## 🆘 Rollback Plan

### Quick Rollback
```bash
# Keep previous build
mv dist dist.backup
mv dist.old dist

# Reload server
sudo systemctl reload nginx
```

### Git Rollback
```bash
git revert HEAD
npm run build
# Deploy again
```

## 📚 Documentation

Update documentation:
- [ ] API endpoints
- [ ] Environment variables
- [ ] Deployment steps
- [ ] Troubleshooting guide
- [ ] Contact information

## ✅ Production Checklist

### Before Deploy
- [ ] All tests passed
- [ ] Security audit done
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Backup created

### During Deploy
- [ ] Build successful
- [ ] Files uploaded
- [ ] Server configured
- [ ] SSL enabled
- [ ] DNS configured

### After Deploy
- [ ] Site accessible
- [ ] HTTPS working
- [ ] Features working
- [ ] Monitoring active
- [ ] Team notified

---

**Deployment Complete!** 🎉

Monitor your application and be ready to respond to any issues.
