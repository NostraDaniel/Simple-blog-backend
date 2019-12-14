import { createConnection, Repository } from 'typeorm';
import { User } from '../entities/user';
import { Role } from '../entities/role';
import { UserRole } from '../../common/enums/user-role.enum';

// SENSITIVE DATA ALERT! - normally the admin credentials should not be present in the public repository, but for now we will roll with it - you can think about how to do it better
// run: `npm run seed` to seed the database

const seedRoles = async connection => {
  const rolesRepo: Repository<Role> = connection.manager.getRepository(Role);

  const roles: Role[] = await rolesRepo.find();
  if (roles.length) {
    console.log('The DB already has roles!');
    return;
  }

  const rolesSeeding: Promise<Role>[] = Object.keys(UserRole).map(
    async (roleName: string) => {
      const role: Role = rolesRepo.create({ name: roleName });
      return await rolesRepo.save(role);
    },
  );
  await Promise.all(rolesSeeding);

  console.log('Seeded roles successfully!');
};

const seedAdmin = async connection => {
  const userRepo: Repository<User> = connection.manager.getRepository(User);
  const rolesRepo: Repository<Role> = connection.manager.getRepository(Role);

  const admin = await userRepo.findOne({
    where: {
      name: 'admin',
    },
  });

  if (admin) {
    console.log('The DB already has an admin!');
    return;
  }

  const adminRole: Role = await rolesRepo.findOne({ name: UserRole.Admin });
  if (!adminRole) {
    console.log('The DB does not have an admin role!');
    return;
  }

  const newAdmin: User = userRepo.create({
    name: 'admin',
    email: 'admin@admin.com',
    password: 'Aaaa!0',
    roles: [adminRole],
  });

  await userRepo.save(newAdmin);
  console.log('Seeded admin successfully!');
};

const seed = async () => {
  console.log('Seed started!');
  const connection = await createConnection();

  await seedRoles(connection);
  await seedAdmin(connection);

  await connection.close();
  console.log('Seed completed!');
};

seed().catch(console.error);
