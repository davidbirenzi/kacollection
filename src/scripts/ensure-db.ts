import { db, initSchema } from "../lib/db";

initSchema();

const row = db.prepare("SELECT COUNT(*) AS count FROM users").get() as {
  count: number;
};

if (row.count === 0) {
  console.log("Database empty — running seed…");
  await import("./seed");
} else {
  console.log(`Database ready (${row.count} users).`);
}
