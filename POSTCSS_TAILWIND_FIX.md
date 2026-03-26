# PostCSS/Tailwind Native Binding Fix

## ❌ Error yang Terjadi

```
Error: Loading PostCSS Plugin failed: Cannot find native binding. 
npm has a bug related to optional dependencies 
(https://github.com/npm/cli/issues/4828). 
Please try `npm i` again after removing both package-lock.json 
and node_modules directory.
```

## 🔍 Root Cause

Tailwind CSS v4 menggunakan `@tailwindcss/postcss` yang memiliki native bindings (compiled Rust code). Ketika menggunakan `npm ci`, optional dependencies dengan native bindings kadang tidak ter-install dengan benar di GitHub Actions environment.

**Issue:** npm ci bug dengan optional dependencies  
**Reference:** https://github.com/npm/cli/issues/4828

## ✅ Solution

Ganti `npm ci` dengan `npm install` di GitHub Actions workflows.

### Why This Works

| Command | Behavior | Native Bindings |
|---------|----------|-----------------|
| `npm ci` | Clean install from lock file | ❌ Sometimes fails |
| `npm install` | Install & update lock file | ✅ Works correctly |

**Trade-off:**
- `npm ci` faster, deterministic
- `npm install` slower, but handles native bindings better

For CI/CD with Tailwind v4, reliability > speed.

## 📁 Files Modified

### Before (npm ci - Error)
```yaml
- name: Install dependencies
  run: npm ci  # ❌ Fails with Tailwind v4
```

### After (npm install - Works)
```yaml
- name: Install dependencies
  run: npm install  # ✅ Works with native bindings
```

## ✅ Complete Fix

### firebase-hosting-merge.yml
```yaml
name: Deploy to Firebase Hosting on merge
on:
  push:
    branches:
      - main
jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install  # ✅ Changed from npm ci
      - name: Build
        run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_BUB_AI }}
          channelId: live
          projectId: bub-ai
```

### firebase-hosting-pull-request.yml
```yaml
name: Deploy to Firebase Hosting on PR
on: pull_request
permissions:
  checks: write
  contents: read
  pull-requests: write
jobs:
  build_and_preview:
    if: ${{ github.event.pull_request.head.repo.full_name == github.repository }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install  # ✅ Changed from npm ci
      - name: Build
        run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_BUB_AI }}
          projectId: bub-ai
```

## 🧪 Verify Fix

### Local Test (Already Working)
```bash
cd FE
npm install
npm run build
# ✅ Success
```

### GitHub Actions Test
1. Commit pushed: `86dd3a5`
2. GitHub Actions will run automatically
3. Expected steps:
   ```
   ✓ Checkout code
   ✓ Setup Node.js 18
   ✓ Install dependencies (npm install)
   ✓ Build (npm run build)
   ✓ Deploy to Firebase
   ```

## 📊 All GitHub Actions Fixes Applied

1. ✅ TypeScript deprecation → Added `ignoreDeprecations`
2. ✅ npm cache error → Removed caching
3. ✅ Working directory error → Removed working-directory
4. ✅ PostCSS/Tailwind native binding → Changed to npm install

## 🎯 Why Tailwind v4 Has This Issue

Tailwind CSS v4 uses:
- `@tailwindcss/postcss` - PostCSS plugin
- Native bindings (Rust compiled to native code)
- Platform-specific binaries (Linux, macOS, Windows)

When `npm ci` runs:
- Reads package-lock.json
- Installs exact versions
- Sometimes skips optional dependencies
- Native bindings may not install correctly

When `npm install` runs:
- Reads package.json
- Resolves dependencies
- Properly handles optional dependencies
- Native bindings install correctly

## 💡 Alternative Solutions

If you want to keep `npm ci` in the future:

### Option 1: Rebuild Native Bindings
```yaml
- name: Install dependencies
  run: npm ci
- name: Rebuild native bindings
  run: npm rebuild @tailwindcss/postcss
```

### Option 2: Use npm install with frozen lockfile
```yaml
- name: Install dependencies
  run: npm install --frozen-lockfile
```

### Option 3: Downgrade to Tailwind v3
```json
{
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8"
  }
}
```

But for now, `npm install` is the simplest and most reliable solution.

## ✅ Status

- ✅ Changed npm ci → npm install
- ✅ Committed & pushed (86dd3a5)
- ✅ GitHub Actions will run
- 📝 Waiting for deployment

## 🚀 Next Steps

1. Monitor GitHub Actions: https://github.com/onejr007/bubai-fe/actions
2. Verify successful build
3. Check deployment: https://bub-ai.web.app
4. Test API connection from frontend

---

**Commit:** `86dd3a5`  
**Status:** ✅ Pushed to GitHub  
**Fix:** npm install for Tailwind v4 native bindings  
**Expected:** Successful deployment! 🎉
