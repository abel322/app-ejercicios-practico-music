import { prisma } from '../lib/prisma';
import { ExerciseStatus } from '@prisma/client';

export class ExerciseProgressService {
  /**
   * Get progress for a specific exercise
   */
  static async getProgress(userId: string, exerciseId: string) {
    const progress = await prisma.exerciseProgress.findUnique({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
      include: {
        exercise: {
          include: {
            book: true,
          },
        },
      },
    });

    return progress;
  }

  /**
   * Get all exercise progress for a user
   */
  static async getAllProgress(userId: string, status?: ExerciseStatus) {
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    const progressList = await prisma.exerciseProgress.findMany({
      where,
      include: {
        exercise: {
          include: {
            book: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { lastPracticedAt: 'desc' },
      ],
    });

    return progressList;
  }

  /**
   * Update exercise progress after a practice session
   */
  static async updateProgress(
    userId: string,
    exerciseId: string,
    data: {
      tempo: number;
      durationSeconds: number;
    }
  ) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      throw new Error('Ejercicio no encontrado');
    }

    // Get or create progress
    let progress = await prisma.exerciseProgress.findUnique({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
    });

    const now = new Date();
    const isAtTargetTempo = exercise.targetTempo ? data.tempo >= exercise.targetTempo : false;

    if (!progress) {
      // Create new progress
      progress = await prisma.exerciseProgress.create({
        data: {
          userId,
          exerciseId,
          status: ExerciseStatus.IN_PROGRESS,
          currentTempo: data.tempo,
          totalPracticeTime: data.durationSeconds,
          masteryTime: isAtTargetTempo ? data.durationSeconds : 0,
          lastPracticedAt: now,
        },
      });
    } else {
      // Update existing progress
      const newTotalTime = progress.totalPracticeTime + data.durationSeconds;
      const newMasteryTime = progress.masteryTime + (isAtTargetTempo ? data.durationSeconds : 0);
      const newCurrentTempo = Math.max(progress.currentTempo || 0, data.tempo);

      // Check if exercise is mastered
      const isMastered =
        exercise.targetTempo &&
        newCurrentTempo >= exercise.targetTempo &&
        newMasteryTime >= exercise.minMasteryTime;

      progress = await prisma.exerciseProgress.update({
        where: {
          userId_exerciseId: {
            userId,
            exerciseId,
          },
        },
        data: {
          currentTempo: newCurrentTempo,
          totalPracticeTime: newTotalTime,
          masteryTime: newMasteryTime,
          lastPracticedAt: now,
          status: isMastered ? ExerciseStatus.MASTERED : ExerciseStatus.IN_PROGRESS,
          masteredAt: isMastered && !progress.masteredAt ? now : progress.masteredAt,
        },
      });
    }

    return progress;
  }

  /**
   * Get progress statistics
   */
  static async getStatistics(userId: string) {
    const allProgress = await prisma.exerciseProgress.findMany({
      where: { userId },
    });

    const stats = {
      total: allProgress.length,
      notStarted: allProgress.filter((p) => p.status === ExerciseStatus.NOT_STARTED).length,
      inProgress: allProgress.filter((p) => p.status === ExerciseStatus.IN_PROGRESS).length,
      mastered: allProgress.filter((p) => p.status === ExerciseStatus.MASTERED).length,
      totalPracticeHours: allProgress.reduce((sum, p) => sum + p.totalPracticeTime, 0) / 3600,
    };

    return stats;
  }

  /**
   * Reset exercise progress
   */
  static async resetProgress(userId: string, exerciseId: string) {
    await prisma.exerciseProgress.delete({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
    });

    return { message: 'Progreso reiniciado exitosamente' };
  }
}
