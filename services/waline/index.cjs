// Neon integrations may expose DATABASE_URL or POSTGRES_URL instead of PG_*.
const connection = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (connection) {
  let database;
  try {
    database = new URL(connection);
  } catch {
    throw new Error('Invalid Neon PostgreSQL connection URL');
  }
  if (!['postgres:', 'postgresql:'].includes(database.protocol)) {
    throw new Error('Neon requires a PostgreSQL connection URL');
  }
  process.env.PG_HOST ||= database.hostname;
  process.env.PG_PORT ||= database.port || '5432';
  process.env.PG_DB ||= decodeURIComponent(database.pathname.slice(1));
  process.env.PG_USER ||= decodeURIComponent(database.username);
  process.env.PG_PASSWORD ||= decodeURIComponent(database.password);
}
process.env.PG_SSL ||= 'true';
process.env.PG_PORT ||= '5432';

const Waline = require('@waline/vercel');
module.exports = Waline({
  secureDomains: ['lizaixi01.github.io', process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]
    .filter(Boolean)
});
