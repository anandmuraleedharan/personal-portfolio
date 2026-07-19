const fs = require('fs');

async function main() {
  const projectsJson = process.env.SUPABASE_PROJECTS_JSON;
  if (!projectsJson) {
    console.error("Error: SUPABASE_PROJECTS_JSON environment variable is not set.");
    process.exit(1);
  }

  let projects = [];
  try {
    projects = JSON.parse(projectsJson);
  } catch (err) {
    console.error("Error: Failed to parse SUPABASE_PROJECTS_JSON. Make sure it is valid JSON.");
    console.error(err.message);
    process.exit(1);
  }

  console.log(`Starting keep-alive pings for ${projects.length} Supabase projects...`);

  for (const project of projects) {
    const { url, anonKey, name } = project;
    const projectName = name || url;

    if (!url || !anonKey) {
      console.warn(`[${projectName}] Skipped: Missing URL or Anon Key.`);
      continue;
    }

    console.log(`\n--- Pinging [${projectName}] ---`);

    // Action 1: Query REST API (Database query)
    try {
      const restUrl = `${url.replace(/\/$/, '')}/rest/v1/visitor_logs?limit=1`;
      console.log(`[${projectName}] Querying DB table visitor_logs...`);
      const res = await fetch(restUrl, {
        headers: {
          "apikey": anonKey,
          "Authorization": `Bearer ${anonKey}`
        }
      });
      console.log(`[${projectName}] DB Query Status: ${res.status} ${res.statusText}`);
      
      if (res.status === 404) {
        // Table visitor_logs might not exist on some projects. Let's do a root API check.
        const rootUrl = `${url.replace(/\/$/, '')}/rest/v1/`;
        console.log(`[${projectName}] Table visitor_logs not found. Trying root REST schema query...`);
        const rootRes = await fetch(rootUrl, {
          headers: {
            "apikey": anonKey,
            "Authorization": `Bearer ${anonKey}`
          }
        });
        console.log(`[${projectName}] Root REST Status: ${rootRes.status} ${rootRes.statusText}`);
      }
    } catch (err) {
      console.error(`[${projectName}] Database ping failed:`, err.message);
    }

    // Action 2: Mimic user login (Auth API)
    try {
      const authUrl = `${url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`;
      console.log(`[${projectName}] Mimicking auth token login request...`);
      const authRes = await fetch(authUrl, {
        method: "POST",
        headers: {
          "apikey": anonKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: `dummy_tester_${Math.floor(Math.random() * 100)}@example.com`,
          password: "temporary_test_password_123!"
        })
      });
      // A failed login (e.g. 400 Bad Request due to invalid credentials) still registers as API activity in Supabase!
      console.log(`[${projectName}] Auth Request Status: ${authRes.status} ${authRes.statusText}`);
    } catch (err) {
      console.error(`[${projectName}] Auth ping failed:`, err.message);
    }
  }

  console.log("\nKeep-alive run completed.");
}

main().catch(err => {
  console.error("Unhandled error in main execution:", err);
  process.exit(1);
});
