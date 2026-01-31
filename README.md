# Indonesia Tobacco - Email Collection Landing Page

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/indonesia-tobacco.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo
4. Click "Deploy"

### Step 3: Add Vercel KV (Database)

1. In your Vercel dashboard, go to your project
2. Click "Storage" tab
3. Click "Create Database"
4. Select "KV" (Redis-compatible)
5. Name it: `indonesia-tobacco-emails`
6. Click "Create"
7. Vercel automatically adds the environment variables

### Step 4: Redeploy

After adding KV, redeploy:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## View Collected Emails

Go to: `https://your-domain.vercel.app/admin`

---

## Custom Domain (indonesiaTobacco.com)

1. Go to your project on Vercel
2. Click "Settings" → "Domains"
3. Add `indonesiaTobacco.com`
4. Update your domain DNS:
   - Add CNAME record: `@` → `cname.vercel-dns.com`
   - Or A record: `@` → `76.76.21.21`

---

## Local Development

```bash
npm install
npm run dev
```

Note: KV won't work locally without setting up environment variables.
You can test locally by commenting out the KV code temporarily.

---

## Files

```
indonesia-tobacco/
├── app/
│   ├── page.js          # Main landing page
│   ├── layout.js        # Root layout
│   ├── admin/
│   │   └── page.js      # View subscribers
│   └── api/
│       └── subscribe/
│           └── route.js # API to save/get emails
└── package.json
```

---

## Security Note

The `/admin` page is public. For production, add authentication:
- Vercel Password Protection (Pro plan)
- Or add a simple password check in the admin page
