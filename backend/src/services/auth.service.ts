import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { Instrument } from '@prisma/client';
import { JWTPayload } from '../types';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token
   */
  static generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  /**
   * Verify and decode a JWT token
   */
  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  }

  /**
   * Register a new user
   */
  static async register(data: {
    name: string;
    email: string;
    password: string;
    instruments: Instrument[];
  }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        instruments: data.instruments,
      },
      select: {
        id: true,
        name: true,
        email: true,
        instruments: true,
        currentLevel: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  /**
   * Login a user
   */
  static async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(password, user.password);

    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * Must have at least 8 characters, one uppercase, one lowercase, and one number
   */
  static isValidPassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
