import { prisma } from '../lib/prisma';

interface Recommendation {
  type: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

export class RecommendationService {
  /**
   * Generate personalized recommendations for a user
   * Analyzes last 30 days of practice data
   */
  static async generateRecommendations(userId: string): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // Get date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Get sessions from last 30 days
    const sessions = await prisma.session.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    // Calculate metrics
    const totalSessions = sessions.length;
    const daysWithPractice = new Set(
      sessions.map((s) => s.date.toISOString().split('T')[0])
    ).size;
    const consistency = totalSessions > 0 ? (daysWithPractice / 30) * 100 : 0;

    // Get unique exercises practiced
    const uniqueExercises = new Set<string>();
    sessions.forEach((session) => {
      session.exercises.forEach((se) => {
        uniqueExercises.add(se.exerciseId);
      });
    });

    // Calculate average session duration
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const averageDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;

    // Check days since last practice
    const daysSinceLastPractice = sessions.length > 0
      ? Math.floor((endDate.getTime() - sessions[0].date.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Rule 1: Consistency < 50% - suggest more achievable goal
    if (consistency < 50 && totalSessions > 0) {
      recommendations.push({
        type: 'consistency',
        message: `Tu consistencia es del ${consistency.toFixed(0)}%. Considera establecer una meta diaria más alcanzable para mantener el hábito.`,
        priority: 'high',
      });
    }

    // Rule 2: Unique exercises < 3 - suggest increasing variety
    if (uniqueExercises.size < 3 && totalSessions > 0) {
      recommendations.push({
        type: 'variety',
        message: `Has practicado solo ${uniqueExercises.size} ejercicio${uniqueExercises.size === 1 ? '' : 's'} diferente${uniqueExercises.size === 1 ? '' : 's'}. Aumentar la variedad mejorará tu desarrollo musical.`,
        priority: 'medium',
      });
    }

    // Rule 3: No practice in 3+ days - send reminder
    if (daysSinceLastPractice >= 3) {
      recommendations.push({
        type: 'reminder',
        message: `Han pasado ${daysSinceLastPractice} días desde tu última práctica. ¡Es momento de retomar tu instrumento!`,
        priority: 'high',
      });
    }

    // Rule 4: Average < 30 min - suggest increasing duration
    if (averageDuration < 30 && totalSessions > 0) {
      recommendations.push({
        type: 'duration',
        message: `Tu promedio de práctica es ${averageDuration.toFixed(0)} minutos. Intenta incrementar gradualmente a 30-45 minutos por sesión.`,
        priority: 'medium',
      });
    }

    // Rule 5: Suggest exercises not practiced recently
    const allExercises = await prisma.exercise.findMany({
      where: {
        book: { userId },
      },
      include: {
        book: {
          select: {
            name: true,
          },
        },
      },
    });

    // Get exercises practiced in last 7 days
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    const recentSessions = sessions.filter((s) => s.date >= recentDate);
    const recentExerciseIds = new Set<string>();
    recentSessions.forEach((session) => {
      session.exercises.forEach((se) => {
        recentExerciseIds.add(se.exerciseId);
      });
    });

    // Find exercises not practiced recently
    const unpracticedExercises = allExercises.filter(
      (ex) => !recentExerciseIds.has(ex.id)
    );

    if (unpracticedExercises.length > 0 && totalSessions > 0) {
      const randomExercise = unpracticedExercises[
        Math.floor(Math.random() * unpracticedExercises.length)
      ];
      recommendations.push({
        type: 'exercise_suggestion',
        message: `Prueba practicar "${randomExercise.name}" del libro "${randomExercise.book.name}". No lo has trabajado recientemente.`,
        priority: 'low',
      });
    }

    // If no sessions at all, provide motivational message
    if (totalSessions === 0) {
      recommendations.push({
        type: 'getting_started',
        message: '¡Comienza tu viaje musical! Registra tu primera sesión de práctica hoy.',
        priority: 'high',
      });
    }

    // Sort by priority and limit to 5
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recommendations.slice(0, 5);
  }
}
