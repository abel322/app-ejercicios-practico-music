import { prisma } from '../lib/prisma';
import { AuthService } from './auth.service';
import { Instrument } from '@prisma/client';

export class UserService {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        instruments: true,
        currentLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      instruments?: Instrument[];
    }
  ) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.instruments && { instruments: data.instruments }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        instruments: true,
        currentLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Update user password
   */
  static async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verify current password
    const isValidPassword = await AuthService.verifyPassword(currentPassword, user.password);

    if (!isValidPassword) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Hash new password
    const hashedPassword = await AuthService.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Contraseña actualizada exitosamente' };
  }

  /**
   * Get user statistics
   */
  static async getStats(userId: string) {
    // Get total minutes practiced
    const sessions = await prisma.session.findMany({
      where: { userId },
      select: { durationMinutes: true },
    });

    const totalMinutes = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);

    // Get session count
    const sessionCount = sessions.length;

    // Get current level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });

    // Calculate streak (consecutive days with practice)
    const streak = await this.calculateStreak(userId);

    return {
      totalMinutes,
      sessionCount,
      currentLevel: user?.currentLevel || 'BASIC',
      streak,
    };
  }

  /**
   * Calculate consecutive days with practice (streak)
   */
  private static async calculateStreak(userId: string): Promise<number> {
    const sessions = await prisma.session.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' },
    });

    if (sessions.length === 0) {
      return 0;
    }

    // Get unique dates (in case multiple sessions per day)
    const uniqueDates = Array.from(
      new Set(sessions.map((s) => s.date.toISOString().split('T')[0]))
    ).sort((a, b) => b.localeCompare(a)); // Sort descending

    if (uniqueDates.length === 0) {
      return 0;
    }

    // Check if today or yesterday has practice
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      return 0; // Streak broken
    }

    // Count consecutive days
    let streak = 1;
    let currentDate = new Date(uniqueDates[0]);

    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      const prevDateStr = prevDate.toISOString().split('T')[0];

      if (uniqueDates[i] === prevDateStr) {
        streak++;
        currentDate = new Date(uniqueDates[i]);
      } else {
        break;
      }
    }

    return streak;
  }
}
