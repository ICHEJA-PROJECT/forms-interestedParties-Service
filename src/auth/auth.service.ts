import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dtos/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  private readonly LOCK_DURATION_MINUTES = 15;
  private readonly MAX_FAILED_ATTEMPTS = 5;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      this.logger.warn(`Intento de login con usuario inexistente: ${username}`);
      return null;
    }

    // Verificar si la cuenta está bloqueada
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      this.logger.warn(`Intento de login con cuenta bloqueada: ${username}`);
      throw new UnauthorizedException('Cuenta bloqueada temporalmente. Intenta más tarde.');
    }

    // Si el bloqueo expiró, resetear
    if (user.lockedUntil && new Date() >= user.lockedUntil) {
      user.lockedUntil = null;
      user.failedLoginAttempts = 0;
      await this.userRepository.save(user);
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Incrementar intentos fallidos
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= this.MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + this.LOCK_DURATION_MINUTES * 60 * 1000);
        this.logger.warn(`Cuenta bloqueada por múltiples intentos fallidos: ${username}`);
      }

      await this.userRepository.save(user);
      this.logger.warn(
        `Intento de login fallido para usuario: ${username} (${user.failedLoginAttempts}/${this.MAX_FAILED_ATTEMPTS})`,
      );
      return null;
    }

    // Login exitoso - resetear intentos fallidos
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = null;
      await this.userRepository.save(user);
    }

    this.logger.log(`Login exitoso para usuario: ${username}`);

    return {
      id: user.id,
      username: user.username,
      roles: ['admin'],
    } as UserDto;
  }

  login(username: string, userId: string): { user: UserDto; access_token: string } {
    const payload = { username, sub: userId };
    const access_token = this.jwtService.sign(payload);

    return {
      user: { id: userId, username, roles: ['admin'] } as UserDto,
      access_token,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }
}
