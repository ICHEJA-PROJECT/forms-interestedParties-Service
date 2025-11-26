import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../auth/entities/user.entity';

async function seedAdminUser() {
  // Configurar conexión a la base de datos
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'your_password',
    database: process.env.DB_NAME || 'formsdb',
    entities: [UserEntity],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    const userRepository = dataSource.getRepository(UserEntity);

    // Verificar si ya existe un usuario admin
    const existingUser = await userRepository.findOne({
      where: { username: 'admin' },
    });

    if (existingUser) {
      console.log('⚠️  El usuario admin ya existe en la base de datos');
      await dataSource.destroy();
      return;
    }

    // Crear el usuario admin
    const hashedPassword = await bcrypt.hash('Admin123!', 12);

    const adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@formsservice.com',
      password: hashedPassword,
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
    });

    await userRepository.save(adminUser);

    console.log('✅ Usuario admin creado exitosamente');
    console.log('📧 Username: admin');
    console.log('🔑 Password: Admin123!');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error al crear el usuario admin:', error);
    process.exit(1);
  }
}

seedAdminUser();