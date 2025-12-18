import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({ path: ".env.local" });

const connectionString = process.env.POSTGRES_URL!;


const runMigrate = async () => {
  if (!connectionString) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const client = postgres(connectionString, { ssl: "require" });
  const db = drizzle(client);

  console.log("Running migrations...");
  try {
    await migrate(db, { migrationsFolder: "lib/db/migrations" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

runMigrate();
