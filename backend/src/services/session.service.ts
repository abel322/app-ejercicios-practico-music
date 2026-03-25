import { prisma } from '../lib/prisma';
import { LevelCalculationService } from './level-calculation.service';
import { GoalService } from './goal.service';

export class SessionService {
  /**
   * Get all sessions for a user
   */
  static async getSessions(
    userId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const where: any = { userId };

    // Date filters
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    // Get total count
    const total = await prisma.session.count({ where });

    // Get sessions with pagination
    const sessions = await prisma.session.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                book: {
                  select: {
                    name: true,
                    instrument: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
    });

    return { sessions, total };
  }

  /**
   * Get a single session by ID
   */
  static async getSession(sessionId: string, userId: string) {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                book: {
                  select: {
                    name: true,
                    instrument: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    return session;
  }

  /**
   * Create a new session
   */
  static async createSession(
    userId: string,
    data: {
      date: string;
      durationMinutes: number;
      exercises: { exerciseId: string; durationMinutes: number }[];
      notes?: string;
    }
  ) {
    // Validate date is not in the future
    const sessionDate = new Date(data.date);
    const now = new Date();
    if (sessionDate > now) {
      throw new Error('La fecha no puede ser futura');
    }

    // Verify all exercises belong to user's books
    if (data.exercises.length > 0) {
      const exerciseIds = data.exercises.map((e) => e.exerciseId);
      const exercises = await prisma.exercise.findMany({
        where: {
          id: { in: exerciseIds },
          book: { userId },
        },
      });

      if (exercises.length !== exerciseIds.length) {
        throw new Error('Uno o más ejercicios no son válidos');
      }
    }

    // Create session with exercises
    const session = await prisma.session.create({
      data: {
        userId,
        date: sessionDate,
        durationMinutes: data.durationMinutes,
        notes: data.notes || '',
        exercises: {
          create: data.exercises.map((e) => ({
            exerciseId: e.exerciseId,
            durationMinutes: e.durationMinutes,
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                book: {
                  select: {
                    name: true,
                    instrument: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Check if level changed
    const levelResult = await LevelCalculationService.checkAndUpdateLevel(userId);

    // Check if any goals were completed
    const completedGoals = await GoalService.checkCompletedGoals(userId);

    return {
      session,
      levelChanged: levelResult.levelChanged,
      newLevel: levelResult.newLevel,
      goalsCompleted: completedGoals,
    };
  }

  /**
   * Update a session
   */
  static async updateSession(
    sessionId: string,
    userId: string,
    data: {
      durationMinutes?: number;
      exercises?: { exerciseId: string; durationMinutes: number }[];
      notes?: string;
    }
  ) {
    // Check if session exists and belongs to user
    const existingSession = await prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!existingSession) {
      throw new Error('Sesión no encontrada');
    }

    // Check if session is within 24 hours
    const now = new Date();
    const sessionDate = new Date(existingSession.createdAt);
    const hoursDiff = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      throw new Error('Solo puedes editar sesiones dentro de las 24 horas posteriores a su creación');
    }

    // Verify exercises if provided
    if (data.exercises && data.exercises.length > 0) {
      const exerciseIds = data.exercises.map((e) => e.exerciseId);
      const exercises = await prisma.exercise.findMany({
        where: {
          id: { in: exerciseIds },
          book: { userId },
        },
      });

      if (exercises.length !== exerciseIds.length) {
        throw new Error('Uno o más ejercicios no son válidos');
      }
    }

    // Update session
    const session = await prisma.session.update({
      where: { id: sessionId },
      data: {
        ...(data.durationMinutes && { durationMinutes: data.durationMinutes }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.exercises && {
          exercises: {
            deleteMany: {}, // Remove all existing exercises
            create: data.exercises.map((e) => ({
              exerciseId: e.exerciseId,
              durationMinutes: e.durationMinutes,
            })),
          },
        }),
      },
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                book: {
                  select: {
                    name: true,
                    instrument: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return session;
  }

  /**
   * Delete a session
   */
  static async deleteSession(sessionId: string, userId: string) {
    // Check if session exists and belongs to user
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    // Delete session (exercises will be cascade deleted)
    await prisma.session.delete({
      where: { id: sessionId },
    });

    return { message: 'Sesión eliminada exitosamente' };
  }
}
