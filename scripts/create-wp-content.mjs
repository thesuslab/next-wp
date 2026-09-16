import fs from 'fs';
import path from 'path';

// 1. Parse .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
}

// 2. Parse command-line args as fallbacks
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined;
}

const wpUrl = (getArg('--url') || env.WORDPRESS_URL || 'https://shop.sustainabilitylab.xyz').replace(/\/+$/, '');
const username = getArg('--user') || env.WORDPRESS_AUTH_USER;
const appPassword = getArg('--password') || env.WORDPRESS_APP_PASSWORD;

if (!username || !appPassword) {
  console.error('\x1b[31m[ERROR] WordPress authentication credentials missing!\x1b[0m\n');
  console.log('To create posts and pages via the WordPress REST API, an Application Password is required.');
  console.log('Please add the following to your .env.local:');
  console.log('----------------------------------------------------');
  console.log('WORDPRESS_AUTH_USER="your-wp-username"');
  console.log('WORDPRESS_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"');
  console.log('----------------------------------------------------');
  console.log('Or pass them as flags: node scripts/create-wp-content.mjs --user <user> --password <app-pass>\n');
  console.log('How to get an Application Password:');
  console.log('1. Log in to ' + wpUrl + '/wp-admin');
  console.log('2. Navigate to Users -> Profile');
  console.log('3. Scroll to "Application Passwords"');
  console.log('4. Enter "NextJS App" and click "Add New Application Password"');
  process.exit(1);
}

const authHeader = 'Basic ' + Buffer.from(`${username}:${appPassword}`).toString('base64');

async function createContent() {
  console.log(`\nConnecting to WordPress at: \x1b[36m${wpUrl}\x1b[0m with user \x1b[32m${username}\x1b[0m...\n`);

  // --- 1. Create a Post ---
  const postData = {
    title: 'Advancing Springshed Revival & Water Security in the Himalayas',
    slug: 'advancing-springshed-revival-himalayas',
    status: 'publish',
    excerpt: 'Field insights and strategic framework for restoring mountain water systems across Nepal and the Hindu Kush Himalaya.',
    content: `
      <h2>Executive Overview</h2>
      <p>Across the Hindu Kush Himalaya, mountain springs serve as the primary lifeline for rural and peri-urban communities, sustaining domestic water supplies, traditional terraced agriculture, and local biodiversity. Recent hydrogeological monitoring reveals significant changes in seasonal discharge rates, emphasizing the urgent need for integrated springshed management.</p>
      
      <h2>Core Intervention Pillars</h2>
      <ul>
        <li><strong>Citizen-Science Hydrogeology:</strong> Equipping local governance units with digital telemetry and participatory discharge tracking tools.</li>
        <li><strong>Recharge Area Protection:</strong> Identifying subsurface aquifer boundaries and establishing conservation trenches, vegetative vegetative buffers, and recharge ponds.</li>
        <li><strong>Gender & Social Inclusion (GESI):</strong> Embedding community-led water user associations into sub-national municipal budgets and long-term planning.</li>
      </ul>

      <h2>Next Steps</h2>
      <p>The Sustainability Lab continues to deploy monitoring nodes and publish open datasets to support municipal authorities and regional researchers in evidence-based adaptation planning.</p>
    `,
  };

  console.log('Creating WordPress Post: "' + postData.title + '"...');
  const postRes = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'User-Agent': 'Next.js WordPress Client'
    },
    body: JSON.stringify(postData),
  });

  const postJson = await postRes.json();
  if (!postRes.ok) {
    console.error('\x1b[31m[FAILED] Failed to create post:\x1b[0m', postJson.message || postJson);
  } else {
    console.log('\x1b[32m[SUCCESS] Post Created!\x1b[0m');
    console.log(`   - ID: ${postJson.id}`);
    console.log(`   - Title: ${postJson.title.rendered}`);
    console.log(`   - Slug: ${postJson.slug}`);
    console.log(`   - WordPress URL: ${postJson.link}`);
    console.log(`   - Next.js URL: /posts/${postJson.slug}`);
  }

  // --- 2. Create a Page ---
  const pageData = {
    title: 'About The Sustainability Lab',
    slug: 'about-the-sustainability-lab',
    status: 'publish',
    excerpt: 'Accelerating climate resilience, circular systems, and evidence-based ecological innovation in the Himalayan region.',
    content: `
      <h2>Our Mission</h2>
      <p>The Sustainability Lab is an applied research, engineering, and policy advisory initiative dedicated to building regenerative systems across the Hindu Kush Himalaya and South Asia.</p>

      <h2>Key Focus Areas</h2>
      <ol>
        <li><strong>Ecological Telemetry & AI:</strong> Real-time environmental monitoring, air quality modeling, and catchment intelligence.</li>
        <li><strong>Circular Materials & Craft:</strong> Material innovation, regenerative packaging, and localized supply-chain sustainability through Karva.</li>
        <li><strong>Knowledge & Policy Advisory:</strong> Synthesizing high-fidelity science into actionable roadmaps for municipalities and international stakeholders.</li>
      </ol>

      <h2>Collaborate With Us</h2>
      <p>We work closely with community leaders, research institutions, and impact partners to design and scale sustainable solutions.</p>
    `,
  };

  console.log('\nCreating WordPress Page: "' + pageData.title + '"...');
  const pageRes = await fetch(`${wpUrl}/wp-json/wp/v2/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'User-Agent': 'Next.js WordPress Client'
    },
    body: JSON.stringify(pageData),
  });

  const pageJson = await pageRes.json();
  if (!pageRes.ok) {
    console.error('\x1b[31m[FAILED] Failed to create page:\x1b[0m', pageJson.message || pageJson);
  } else {
    console.log('\x1b[32m[SUCCESS] Page Created!\x1b[0m');
    console.log(`   - ID: ${pageJson.id}`);
    console.log(`   - Title: ${pageJson.title.rendered}`);
    console.log(`   - Slug: ${pageJson.slug}`);
    console.log(`   - WordPress URL: ${pageJson.link}`);
    console.log(`   - Next.js URL: /pages/${pageJson.slug}`);
  }

  // --- 3. Optional: Trigger Next.js Revalidation ---
  if (env.NEXT_PUBLIC_SITE_URL && env.WORDPRESS_WEBHOOK_SECRET) {
    try {
      console.log('\nTriggering Next.js cache revalidation...');
      const revalRes = await fetch(`${env.NEXT_PUBLIC_SITE_URL}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': env.WORDPRESS_WEBHOOK_SECRET,
        },
        body: JSON.stringify({ contentType: 'post' }),
      });
      if (revalRes.ok) {
        console.log('\x1b[32m[SUCCESS] Next.js cache revalidated successfully.\x1b[0m');
      }
    } catch {
      // Local dev server might not be running, safe to ignore
    }
  }

  console.log('\nAll operations completed!\n');
}

createContent().catch(err => {
  console.error('\x1b[31mUnexpected error:\x1b[0m', err);
  process.exit(1);
});
