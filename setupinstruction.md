# The Sustainability Lab — Setup, AI Configuration & Deployment Guide

Welcome to **The Sustainability Lab** web application. This document provides step-by-step instructions to configure, run locally, connect to LLM providers (OpenRouter, ChatGPT, Gemini, NVIDIA NIM, or Ollama for the **Lab Lens**), and deploy to production.

---

## 1. Project Overview & Institutional Headquarters

- **Institutional Identity**: The Sustainability Lab
- **Station Coordinates**: `27.7408° N, 85.3365° E`
- **Station Address**: Maharajgunj, Kathmandu Valley, Nepal
- **Google Maps Location**: [Open in Google Maps](https://www.google.com/maps/search/?api=1&query=27.74082380807615,85.33648295827483)
- **Tech Stack**:
  - **Framework**: Next.js 16 (App Router with Turbopack)
  - **Styling**: Tailwind CSS with custom Bamboo Green (`#5D7924`) tokens
  - **Type Safety**: TypeScript 5
  - **CMS Integration**: Headless WordPress (WPGraphQL) with fallback static mockups
  - **Intelligence Engine**: Pluggable AI / LLM adapter supporting OpenRouter, OpenAI (ChatGPT), Google Gemini, NVIDIA NIM, and local Ollama

---

## 2. Prerequisites & Quickstart

### Prerequisites
- **Node.js**: `v18.18.0` or higher (`v20.x` or `v22.x` recommended)
- **Package Manager**: `pnpm` (`v9.x`), `npm`, or `yarn`

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thesuslab/next-wp.git
   cd next-wp
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Create local environment file**:
   ```bash
   cp .env.example .env.local
   ```

4. **Launch the development server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Configuring the AI / LLM Engine (for Lab Lens & AI Advisor)

The **Lab Lens** (accessed via the floating `◉ LAB LENS` button on any page) and the **Ask the Lab** interface (`/intelligence/ai`) are powered by a unified API (`/api/ai`) that dynamically routes prompts to your chosen LLM provider.

Edit `.env.local` to select and configure your preferred provider.

### Supported Providers Summary

| Provider | Ideal For | Key Required | Default Model |
|---|---|---|---|
| **Groq** | Ultra-Fast Cloud Inference (<1s), Llama 3.3 70B, GPT-OSS | `GROQ_API_KEY` (or `gsk_...` in `OPENAI_API_KEY`) | `openai/gpt-oss-120b` |
| **Ollama** | 100% Free, Private, Local Offline Execution | None | `llama3.2` |
| **OpenRouter** | Access to Claude 3.5, Llama 3.3 70B, DeepSeek R1 | `OPENROUTER_API_KEY` | `meta-llama/llama-3.3-70b-instruct` |
| **OpenAI (ChatGPT)** | Reliable GPT-4o / GPT-4o-mini | `OPENAI_API_KEY` | `gpt-4o-mini` |
| **Google Gemini** | High-speed multimodal & generous rate limits | `GEMINI_API_KEY` | `gemini-1.5-flash` |
| **NVIDIA NIM** | Enterprise-grade accelerated open models | `NVIDIA_API_KEY` | `meta/llama-3.1-70b-instruct` |
| **Simulation Mode** | Zero setup; autonomous realistic mockups | None | `lab-synthesis-v4.2` |

---

### Option A: Local Ollama (100% Free, Private, Local LLM)

No API key or credit card needed! Run models entirely on your local machine:

1. **Download & Install Ollama**:
   - Download from: [https://ollama.com](https://ollama.com)
   - Or install on Linux/macOS:
     ```bash
     curl -fsSL https://ollama.com/install.sh | sh
     ```

2. **Pull and run a model** in your terminal:
   ```bash
   # Lightweight & fast (recommended for general laptops):
   ollama run llama3.2

   # Or higher capacity:
   ollama run mistral
   # Or reasoning model:
   ollama run deepseek-r1:8b
   ```

3. **Configure `.env.local`**:
   ```env
   LLM_PROVIDER="ollama"
   OLLAMA_BASE_URL="http://localhost:11434"
   OLLAMA_MODEL="llama3.2"
   ```

---

### Option B: OpenRouter (Multi-Model Access)

Access Claude 3.5 Sonnet, Llama 3.3 70B, Qwen, or DeepSeek through a single unified API:

1. Sign up and create a key at [https://openrouter.ai/keys](https://openrouter.ai/keys).
2. Configure `.env.local`:
   ```env
   LLM_PROVIDER="openrouter"
   OPENROUTER_API_KEY="sk-or-v1-..."
   OPENROUTER_MODEL="meta-llama/llama-3.3-70b-instruct"
   # or: OPENROUTER_MODEL="anthropic/claude-3.5-sonnet"
   ```

---

### Option C: OpenAI (ChatGPT)

1. Sign up and generate an API key at [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Configure `.env.local`:
   ```env
   LLM_PROVIDER="openai"
   OPENAI_API_KEY="sk-proj-..."
   OPENAI_MODEL="gpt-4o-mini"
   # or: OPENAI_MODEL="gpt-4o"
   ```

---

### Option D: Google Gemini

1. Generate a free Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Configure `.env.local`:
   ```env
   LLM_PROVIDER="gemini"
   GEMINI_API_KEY="AIzaSy..."
   GEMINI_MODEL="gemini-1.5-flash"
   # or: GEMINI_MODEL="gemini-2.0-flash"
   ```

---

### Option E: NVIDIA NIM

1. Create a free account and generate API credits at [build.nvidia.com](https://build.nvidia.com).
2. Configure `.env.local`:
   ```env
   LLM_PROVIDER="nvidia"
   NVIDIA_API_KEY="nvapi-..."
   NVIDIA_MODEL="meta/llama-3.1-70b-instruct"
   # or: NVIDIA_MODEL="nvidia/llama-3.1-nemotron-70b-instruct"
   ```

---

### Testing Your AI Connection

1. **Check Provider Status**:
   Visit [http://localhost:3000/api/ai](http://localhost:3000/api/ai) in your browser or run:
   ```bash
   curl http://localhost:3000/api/ai
   ```
   Output will confirm the active provider:
   ```json
   {
     "provider": "ollama",
     "model": "llama3.2",
     "isConfigured": true,
     "statusMessage": "Connected to Local Ollama at http://localhost:11434"
   }
   ```

2. **Test via Lab Lens**:
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Click the bottom-right **`◉ LAB LENS`** button
   - Click **`⚡ Live AI Diagnosis`** or enter a question in the text box
   - Notice the provider badge: e.g. `LLM: OLLAMA (llama3.2)` or `LLM: OPENROUTER`

---

## 4. Headless WordPress Setup (Optional)

The application functions completely standalone without WordPress, using mock datasets. To connect a live WordPress instance:

1. Install the **WPGraphQL** plugin on your WordPress site.
2. In `.env.local`, set:
   ```env
   WORDPRESS_URL="https://your-wordpress-domain.com"
   WORDPRESS_HOSTNAME="your-wordpress-domain.com"
   WORDPRESS_WEBHOOK_SECRET="your-secret-generated-string"
   ```
3. Set up the on-demand revalidation webhook:
   - Endpoint: `https://your-site-domain.com/api/revalidate`
   - Header: `x-webhook-secret: your-secret-generated-string`

---

## 5. Production Build & Quality Assurance

Run the production build to compile static routes and verify TypeScript types:

```bash
pnpm build
```

Expected output:
```
✓ Compiled successfully
✓ Running TypeScript check ...
✓ Generating static pages (41/41)
✓ Finalizing page optimization ...
```

To run the production bundle locally:
```bash
pnpm start
```

---

## 6. Deployment Guides

### Option 1: Vercel (Fastest & Recommended)

1. Push your code to GitHub / GitLab.
2. Go to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Next.js is automatically detected.
4. Add your **Environment Variables** in the Vercel project settings:
   - `LLM_PROVIDER` (e.g. `openrouter`, `openai`, `gemini`, or `nvidia`)
   - `OPENROUTER_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY` / `NVIDIA_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-production-domain.com`
   - `WORDPRESS_URL` (optional)
5. Click **Deploy**. Vercel will automatically build and distribute the app across its global edge network.

---

### Option 2: Docker Container Deployment

Create a containerized instance ready for AWS ECS, Google Cloud Run, or any VPS:

1. **Build Docker Image**:
   ```bash
   docker build -t sustainability-lab:latest .
   ```

2. **Run Docker Container with Environment Variables**:
   ```bash
   docker run -d -p 3000:3000 \
     -e LLM_PROVIDER="openrouter" \
     -e OPENROUTER_API_KEY="your-key" \
     -e NEXT_PUBLIC_SITE_URL="https://sustainabilitylab.xyz" \
     --name suslab \
     sustainability-lab:latest
   ```

3. **Connecting Docker to Local Ollama**:
   If running Ollama on the host machine and Next.js in Docker:
   ```bash
   docker run -d -p 3000:3000 \
     -e LLM_PROVIDER="ollama" \
     -e OLLAMA_BASE_URL="http://host.docker.internal:11434" \
     --name suslab \
     sustainability-lab:latest
   ```

---

### Option 3: Ubuntu / Debian Linux VPS with PM2 & Nginx

1. **Install Node.js 20 & PM2**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs nginx git
   sudo npm install -g pnpm pm2
   ```

2. **Clone & Build**:
   ```bash
   git clone https://github.com/thesuslab/next-wp.git /var/www/sustainability-lab
   cd /var/www/sustainability-lab
   pnpm install
   cp .env.example .env.local
   # Edit .env.local with your keys
   nano .env.local
   pnpm build
   ```

3. **Start with PM2**:
   ```bash
   pm2 start pnpm --name "suslab" -- start
   pm2 startup
   pm2 save
   ```

4. **Nginx Reverse Proxy Configuration**:
   Create `/etc/nginx/sites-available/sustainabilitylab`:
   ```nginx
   server {
       server_name sustainabilitylab.xyz www.sustainabilitylab.xyz;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   Enable site and install SSL certificate:
   ```bash
   sudo ln -s /etc/nginx/sites-available/sustainabilitylab /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d sustainabilitylab.xyz -d www.sustainabilitylab.xyz
   ```

---

## 7. SEO, AEO & AI Engine Citations

The site automatically ships with search and answer engine optimization:
- **`public/llms.txt`**: Machine-readable context file indexing institutional capabilities for ChatGPT, Perplexity, Claude, and Apple Intelligence.
- **`app/robots.ts`**: Expressly allows crawling by `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Applebot`, `Googlebot`, and `Bingbot`.
- **`app/sitemap.ts`**: Dynamically generates valid XML sitemaps for all 41 routes.
- **`components/seo/JsonLd.tsx`**: Emits microdata schemas for `Organization` (geo-coordinates in Maharajgunj: `27.740824, 85.336483`), `WebSite`, `FAQPage`, `BreadcrumbList`, and `Article`.

---

---

## 8. Automated Daily 6:00 AM Editorial Ingestion & Synthesis Pipeline

The platform includes an automated pipeline that scrapes reputable and verified institutional publishers, synthesizes evidence-based reports with quantitative telemetry and canonical citations, and publishes them into the Knowledge Base and Editorial Dispatches:

- **Verified Whitelist**:
  - **ICIMOD** (`https://www.icimod.org/feed/`) — Himalayan cryosphere and mountain hydrology
  - **UNFCCC** (`https://unfccc.int/rss.xml`) — Global climate policy, NDCs, carbon mechanisms
  - **UNEP** (`https://www.unep.org/rss.xml`) — Circular economy, planetary boundaries, ecosystems
  - **Mongabay South Asia / Himalaya** (`https://news.mongabay.com/feed/`) — Field environmental journalism
- **Categorization Taxonomy**: Automatically categorizes into `Climate`, `Policy`, `Infrastructure`, `Environment`, `Enterprise`, or `Case Studies`.
- **Evidence-Based Rewriter**: Extracts numerical indicators (°C anomalies, precipitation mm, ha, USD finance) and constructs structured sections (Empirical Findings, Ecosystem Impact, Policy & Practical Implications) with zero vendor branding and no raw `<br>` tags.
- **Trigger Endpoint**: `GET /api/cron/editorial` or `POST /api/cron/editorial`
  - Protected by `CRON_SECRET` header or `?secret=...`
  - Supports query parameters `?force=true`, `?limit=3`, `?source=icimod`
- **Cron Configuration**:
  - **Railway Cron**: Add a Cron Job with schedule `0 6 * * *` (Daily at 6:00 AM) targeting `curl -s -X POST "https://your-domain.railway.app/api/cron/editorial?secret=$CRON_SECRET"`
  - **Crontab**:
    ```bash
    0 6 * * * curl -s -X POST "https://sustainabilitylab.xyz/api/cron/editorial?secret=YOUR_CRON_SECRET" > /dev/null 2>&1
    ```

---

## 9. Support & Directorate Contact

- **Headquarters**: Maharajgunj Research Station, Kathmandu Valley, Nepal
- **Email**: hello@sustainabilitylab.xyz
- **Website**: [https://sustainabilitylab.xyz](https://sustainabilitylab.xyz)

