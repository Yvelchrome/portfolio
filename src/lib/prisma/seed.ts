import bcrypt from "bcryptjs";

import { prisma } from "./prisma";

interface SeedCredentials {
  email: string;
  password: string;
}

function getSeedCredentials(): SeedCredentials {
  const rawSeedAdminEmail = process.env["SEED_ADMIN_EMAIL"];
  const rawSeedAdminPassword = process.env["SEED_ADMIN_PASSWORD"];

  if (!rawSeedAdminEmail) {
    throw new Error(
      "SEED_ADMIN_EMAIL environment variable is required but not set",
    );
  }

  if (!rawSeedAdminPassword) {
    throw new Error(
      "SEED_ADMIN_PASSWORD environment variable is required but not set",
    );
  }

  // Type-safe secrets after validation
  const EMAIL: string = rawSeedAdminEmail;
  const PASSWORD: string = rawSeedAdminPassword;

  return { email: EMAIL, password: PASSWORD };
}

async function main() {
  const { email, password } = getSeedCredentials();
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
