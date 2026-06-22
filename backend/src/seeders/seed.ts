import 'dotenv/config';
import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { RoleType } from '~/constants/enums';
import { users } from '~/db/schema';
import { AlgoCrypto } from '~/utils/crypto';

const ADMIN_ACCOUNT = {
  mssv: 'SE200947',
  password: 'admin123',
  role: RoleType.ADMIN,
};

async function seed() {
  const [existing] = await db.select().from(users).where(eq(users.mssv, ADMIN_ACCOUNT.mssv));

  if (existing) {
    console.log('✓ Admin account already exists, skipping');
  } else {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      mssv: ADMIN_ACCOUNT.mssv,
      password: AlgoCrypto.hashPassword(ADMIN_ACCOUNT.password),
      role: ADMIN_ACCOUNT.role,
    });
    console.log(`✓ Admin account created (mssv: ${ADMIN_ACCOUNT.mssv}, password: ${ADMIN_ACCOUNT.password})`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error('✗ Seed failed:', err);
  process.exit(1);
});
