import { prisma } from '../lib/prisma';
import { LevelCalculationService } from './level-calculation.service';

export class LevelService {
  /**
   * Get current level and progress
   */
  static async getCurrentLevel(userId: string, instrument?: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLevel: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const progress = await LevelCalculationService.getProgressToNextLevel(userId, instrument);

    return {
      level: user.currentLevel,
      progress,
    };
  }

  /**
   * Get level history
   */
  static async getLevelHistory(userId: string, instrument?: string) {
    // For now, level history is global (not instrument-specific)
    // In the future, we could add instrument field to levelHistory table
    const history = await prisma.levelHistory.findMany({
      where: { userId },
      orderBy: { achievedAt: 'desc' },
    });

    return history;
  }
}
