import 'dotenv/config';
import { eq } from 'drizzle-orm';

import { db } from '~/configs/db';
import { RoleType } from '~/constants/enums';
import { stations, users } from '~/db/schema';
import { AlgoCrypto } from '~/utils/crypto';

const ADMIN_ACCOUNT = {
  mssv: 'SE200947',
  password: 'admin123',
  role: RoleType.ADMIN,
};

const STATIONS = [
  {
    name: 'Trạm FE – CSS Battle',
    description:
      'Thực hành CSS cơ bản (div, scale, left/right, rotation) qua bài tập xoay/căn chỉnh hình theo mẫu. Chính thức: 3 câu thực hành có tính giờ. Trải nghiệm: 20 câu quiz CSS thẻ cơ bản.',
    order: 1,
    isReward: false,
  },
  {
    name: 'Trạm BE – SQL Race',
    description:
      'Thực hành truy vấn SQL (SELECT, JOIN, AVG,...) dạng đua tốc độ. Chính thức: 5 câu cố định + random 15 câu, có chế độ tìm hiểu. Trải nghiệm: 20 câu quiz lệnh SQL & vai trò CSDL.',
    order: 2,
    isReward: false,
  },
  {
    name: 'Trạm AI – Object Detection Challenge',
    description:
      'Nhận diện ~15 vật thể qua ảnh chụp thực tế bằng mô hình AI có sẵn, hiểu Pipeline cơ bản của ứng dụng AI. Chính thức: 2 câu thực hành nhận diện. Trải nghiệm: 10 câu quiz AI.',
    order: 3,
    isReward: false,
  },
  {
    name: 'Trạm Game – Tank Battle',
    description:
      'Game bắn xe tăng đội đối kháng, rèn kỹ năng phối hợp nhóm. Chính thức: chơi game trực tiếp. Trải nghiệm: 10 câu quiz về game nổi tiếng & yếu tố cấu thành game.',
    order: 4,
    isReward: false,
  },
];

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

  for (const station of STATIONS) {
    const [existingStation] = await db.select().from(stations).where(eq(stations.name, station.name));
    if (existingStation) {
      console.log(`✓ Station "${station.name}" already exists, skipping`);
    } else {
      await db.insert(stations).values({ id: crypto.randomUUID(), ...station });
      console.log(`✓ Station "${station.name}" created`);
    }
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error('✗ Seed failed:', err);
  process.exit(1);
});
