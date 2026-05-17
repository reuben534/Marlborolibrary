# Deploy Marlboro Library to Azure Portal

This guide deploys the **full app** (React UI + Node API) to a single **Azure App Service** (Linux, Node 20). MongoDB stays on **MongoDB Atlas** (recommended).

---

## Architecture on Azure

```
Browser  →  https://<your-app>.azurewebsites.net
              ├── /          → React (built to dist/)
              ├── /api/*     → Express API
              └── /images/*  → Uploaded profile photos
MongoDB Atlas  ←  connection string (MONGODB_URI)
```

---

## Prerequisites

1. [Azure account](https://azure.microsoft.com/free/) (free tier works for testing)
2. Code pushed to **GitHub** (or Azure DevOps)
3. **MongoDB Atlas** cluster with connection string
4. Node.js 20+ installed locally (for testing builds)

---

## Part 1 — Prepare MongoDB Atlas

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Open your cluster → **Network Access** → **Add IP Address**.
3. For Azure App Service, add **`0.0.0.0/0`** (allow from anywhere) for coursework/demo, or add your App Service outbound IPs later for production.
4. **Database Access** → ensure a database user exists.
5. **Connect** → copy the connection string, e.g.  
   `mongodb+srv://user:pass@cluster.mongodb.net/marlboro_library`

---

## Part 2 — Create Azure resources (Portal)

### Step 1: Resource group

1. [Azure Portal](https://portal.azure.com) → **Create a resource**.
2. Search **Resource group** → Create.
3. Name: `rg-marlboro-library` → Region: closest to you → **Review + create**.

### Step 2: App Service plan

1. **Create a resource** → **Web App**.
2. Or create **App Service plan** first (Linux, Basic B1 or Free F1 if available in your region).

**Web App wizard:**

| Field | Value |
|--------|--------|
| Subscription | Your subscription |
| Resource group | `rg-marlboro-library` |
| Name | `marlboro-library` (must be globally unique → becomes URL) |
| Publish | **Code** |
| Runtime stack | **Node 20 LTS** |
| Operating System | **Linux** |
| Region | Same as resource group |
| Pricing plan | **Basic B1** (or Free F1 for light use) |

3. **Review + create** → **Create**.

---

## Part 3 — Configure App Service

Open your Web App → **Settings** → **Environment variables** (or **Configuration** → **Application settings**).

Add these **Application settings**:

| Name | Value |
|------|--------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Long random string (32+ characters) |
| `NODE_ENV` | `production` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `WEBSITE_NODE_DEFAULT_VERSION` | `~20` |

Click **Apply** / **Save**.

### General settings

**Settings** → **Configuration** → **General settings**:

- **Stack**: Node 20 LTS  
- **Startup Command**: `npm start`

Save.

---

## Part 4 — Deploy from GitHub

1. Web App → **Deployment Center**.
2. **Source**: GitHub → authorize → select repo and branch (`main`).
3. **Build Provider**: **App Service Build Service** (Oryx).
4. Save.

Azure will on each deploy:

1. `npm install` (root) → runs `postinstall` for `server/`
2. `npm run build` → builds React to `dist/`
3. Start with `npm start` → runs `node server/index.js`

### First deploy checklist

After deployment finishes (~5–10 min):

1. Visit `https://<your-app-name>.azurewebsites.net/api/health`  
   Expected: `{"ok":true,"environment":"production"}`
2. Visit `https://<your-app-name>.azurewebsites.net`  
   Expected: login page
3. Seed database (one time, from your PC):

```bash
cd server
# Create server/.env with MONGODB_URI pointing to Atlas
npm run seed
```

4. Log in: `admin` / `password`

---

## Part 5 — Deploy without GitHub (ZIP)

1. Locally build:

```bash
npm install
npm run build
cd server && npm install --omit=dev && cd ..
```

2. Zip the project **including** `dist/`, `server/`, `package.json`, `images/` (default avatars), but **excluding** `node_modules`.

3. Portal → Web App → **Advanced Tools** → **Go** (Kudu) → **Zip Push Deploy**,  
   or **Deployment Center** → **ZIP Deploy**.

4. Set startup command: `npm start`.

---

## Part 6 — Optional: separate frontend + API

If you prefer **Static Web Apps** for the UI and **App Service** for API only:

1. Deploy API to App Service as above (skip serving `dist/` — set `NODE_ENV` and do not rely on combined hosting).
2. Create **Static Web App** → connect GitHub → build:
   - App location: `/`
   - Output: `dist`
3. Add build env var: `VITE_API_URL=https://<api-app>.azurewebsites.net`
4. On API App Service, set:  
   `FRONTEND_URL=https://<static-app>.azurestaticapps.net`

---

## Troubleshooting

### App shows “Application Error”

- **Log stream**: Web App → **Monitoring** → **Log stream**.
- Check `MONGODB_URI` and Atlas IP whitelist.
- Check **Startup Command** is `npm start`.

### Build fails on Azure

- Ensure `package.json` has `"build": "vite build"` and `"start": "node server/index.js"`.
- Add `react` and `react-dom` to `dependencies` if build says they are missing.

### API works but blank page

- Confirm `npm run build` ran (folder `dist/` exists on server).
- Confirm `NODE_ENV=production`.

### CORS errors (split deployment)

- Set `FRONTEND_URL` on the API to your Static Web App URL.

### Uploaded photos disappear after redeploy

- App Service local disk is **ephemeral**. For production, use **Azure Blob Storage** for uploads (future enhancement). Default role images in `images/` are kept in git.

---

## Security before production

- [ ] Replace demo passwords after seeding
- [ ] Use a strong `JWT_SECRET`
- [ ] Restrict Atlas IP access (not `0.0.0.0/0`) when possible
- [ ] Enable **HTTPS only** (Web App → TLS/SSL)
- [ ] Turn on App Service authentication if required by your course

---

## Quick reference

| Item | Value |
|------|--------|
| Health check | `https://<app>.azurewebsites.net/api/health` |
| App URL | `https://<app>.azurewebsites.net` |
| Startup | `npm start` |
| Build | `npm run build` (automatic with Oryx) |

---

**Last updated:** May 2026
