
import { createGuestUser } from "./lib/db/queries";
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  try {
    const user = await createGuestUser();
    console.log("Successfully created guest user:", user);
  } catch (error) {
    console.error("Failed to create guest user:", error);
    process.exit(1);
  }
}

main();
