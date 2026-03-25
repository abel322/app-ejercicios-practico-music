import { prisma } from '../lib/prisma';
import { Instrument } from '@prisma/client';

export class DashboardService {
  /**
   * Get general statistics for dashboard
   * Updated: Fixed property names to match frontend expectations
   */
  static async getStats(
    userId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      instrument?: string;
    }
  ) {
    try {
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

      // Get sessions in the date range
      const sessions = await prisma.session.findMany({
        where,
        select: {
          durationMinutes: true,
          date: true,
          exercises: {
            select: {
              durationMinutes: true,
              exercise: {
                select: {
                  book: {
                    select: {
                      instrument: true
                    }
                  }
                }
              }
            }
          }
        },
      });

      // Filter sessions and calculate minutes based on instrument
      let filteredSessions = sessions;
      let totalMinutes = 0;

      if (filters?.instrument) {
        // Filter sessions that have exercises from the specified instrument
        filteredSessions = sessions.filter(session => 
          session.exercises.some(exercise => 
            exercise.exercise.book.instrument === filters.instrument
          )
        );

        // Calculate minutes only for the specific instrument
        filteredSessions.forEach(session => {
          session.exercises.forEach(exercise => {
            if (exercise.exercise.book.instrument === filters.instrument) {
              totalMinutes += exercise.durationMinutes;
            }
          });
        });
      } else {
        // Calculate total minutes from session duration
        totalMinutes = sessions.reduce((sum: number, s: any) => sum + s.durationMinutes, 0);
      }

      // Calculate session count
      const sessionCount = filteredSessions.length;

      // Calculate average daily
      const uniqueDates = new Set(
        filteredSessions.map((s: any) => s.date.toISOString().split('T')[0])
      );
      const daysWithPractice = uniqueDates.size;
      const averageDaily = daysWithPractice > 0 ? totalMinutes / daysWithPractice : 0;

      // Calculate average weekly
      const averageWeekly = daysWithPractice > 0 ? (totalMinutes / daysWithPractice) * 7 : 0;

      // Calculate streak (instrument-specific if filter applied)
      const streak = await this.calculateStreak(userId, filters?.instrument);

      return {
        totalMinutes,
        averageDaily: Math.round(averageDaily),
        averageWeekly: Math.round(averageWeekly),
        currentStreak: streak,
        totalSessions: sessionCount,
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw new Error('Error al cargar las estadísticas');
    }
  }

  /**
   * Get practice chart data for last N days
   */
  static async getPracticeChart(
    userId: string, 
    days: number = 30,
    filters?: {
      startDate?: string;
      endDate?: string;
      instrument?: string;
    }
  ) {
    try {
      const where: any = {
        userId,
      };

      // Apply date filters
      if (filters?.startDate || filters?.endDate) {
        where.date = {};
        if (filters.startDate) {
          where.date.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.date.lte = new Date(filters.endDate);
        }
      } else {
        // Default to last N days if no date filters
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        where.date = { gte: startDate };
      }

      const sessions = await prisma.session.findMany({
        where,
        select: {
          date: true,
          durationMinutes: true,
          exercises: {
            select: {
              durationMinutes: true,
              exercise: {
                select: {
                  book: {
                    select: {
                      instrument: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          date: 'asc',
        },
      });

      // Group by date
      const dataMap = new Map<string, number>();

      // Initialize all dates with 0
      const daysToShow = filters?.startDate && filters?.endDate 
        ? Math.ceil((new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
        : days;
      
      for (let i = 0; i < daysToShow; i++) {
        const date = new Date();
        if (filters?.startDate) {
          date.setTime(new Date(filters.startDate).getTime() + (i * 24 * 60 * 60 * 1000));
        } else {
          date.setDate(date.getDate() - (daysToShow - 1 - i));
        }
        const dateStr = date.toISOString().split('T')[0];
        dataMap.set(dateStr, 0);
      }

      // Add session durations
      sessions.forEach((session: any) => {
        const dateStr = session.date.toISOString().split('T')[0];
        
        if (filters?.instrument) {
          // Sum only minutes for the specific instrument
          let instrumentMinutes = 0;
          session.exercises.forEach((exercise: any) => {
            if (exercise.exercise.book.instrument === filters.instrument) {
              instrumentMinutes += exercise.durationMinutes;
            }
          });
          const current = dataMap.get(dateStr) || 0;
          dataMap.set(dateStr, current + instrumentMinutes);
        } else {
          // Use total session duration
          const current = dataMap.get(dateStr) || 0;
          dataMap.set(dateStr, current + session.durationMinutes);
        }
      });

      // Convert to array
      const data = Array.from(dataMap.entries()).map(([date, minutes]) => ({
        date,
        minutes,
      }));

      return { data };
    } catch (error) {
      console.error('Error in getPracticeChart:', error);
      throw new Error('Error al cargar los datos del gráfico');
    }
  }

  /**
   * Get instrument distribution
   */
  static async getInstrumentDistribution(
    userId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
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

    // Get sessions with exercises and books
    const sessions = await prisma.session.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                book: {
                  select: {
                    instrument: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Calculate minutes per instrument
    const instrumentMap = new Map<Instrument, number>();

    sessions.forEach((session: any) => {
      session.exercises.forEach((sessionExercise: any) => {
        const instrument = sessionExercise.exercise.book.instrument;
        const current = instrumentMap.get(instrument) || 0;
        instrumentMap.set(instrument, current + sessionExercise.durationMinutes);
      });
    });

    // Calculate total for percentages
    const totalMinutes = Array.from(instrumentMap.values()).reduce((sum, m) => sum + m, 0);

    // Convert to array with percentages
    const data = Array.from(instrumentMap.entries()).map(([instrument, minutes]) => ({
      instrument,
      minutes,
      percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0,
    }));

    return { data };
  }

  /**
   * Get top exercises by practice time
   */
  static async getTopExercises(
    userId: string, 
    limit: number = 5,
    filters?: {
      startDate?: string;
      endDate?: string;
      instrument?: string;
    }
  ) {
    try {
      const where: any = {
        session: {
          userId,
        },
      };

      // Date filters
      if (filters?.startDate || filters?.endDate) {
        where.session.date = {};
        if (filters.startDate) {
          where.session.date.gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          where.session.date.lte = new Date(filters.endDate);
        }
      }

      // Instrument filter
      if (filters?.instrument) {
        where.exercise = {
          book: {
            instrument: filters.instrument
          }
        };
      }

      // Get all session exercises with exercise details
      const sessionExercises = await prisma.sessionExercise.findMany({
        where,
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
      });

      // Group by exercise and sum durations
      const exerciseMap = new Map<
        string,
        {
          exercise: any;
          totalMinutes: number;
          sessionCount: number;
        }
      >();

      sessionExercises.forEach((se: any) => {
        const exerciseId = se.exerciseId;
        const existing = exerciseMap.get(exerciseId);

        if (existing) {
          existing.totalMinutes += se.durationMinutes;
          existing.sessionCount += 1;
        } else {
          exerciseMap.set(exerciseId, {
            exercise: se.exercise,
            totalMinutes: se.durationMinutes,
            sessionCount: 1,
          });
        }
      });

      // Convert to array and sort by total minutes
      const exercises = Array.from(exerciseMap.values())
        .sort((a, b) => b.totalMinutes - a.totalMinutes)
        .slice(0, limit);

      return { exercises };
    } catch (error) {
      console.error('Error in getTopExercises:', error);
      throw new Error('Error al cargar los ejercicios más practicados');
    }
  }

  /**
   * Calculate consecutive days with practice (streak)
   * Considers user timezone and instrument filter
   */
  private static async calculateStreak(userId: string, instrument?: string): Promise<number> {
    try {
      const where: any = { userId };

      const sessions = await prisma.session.findMany({
        where,
        select: { 
          date: true,
          exercises: {
            select: {
              exercise: {
                select: {
                  book: {
                    select: {
                      instrument: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { date: 'desc' },
      });

      if (sessions.length === 0) {
        return 0;
      }

      // Filter sessions to only include those with the specified instrument
      const filteredSessions = instrument 
        ? sessions.filter(session => 
            session.exercises.some((e: any) => e.exercise.book.instrument === instrument)
          )
        : sessions;

      // Get unique dates (in case multiple sessions per day)
      const uniqueDates = (Array.from(
        new Set(filteredSessions.map((s: any) => s.date.toISOString().split('T')[0]))
      ) as string[]).sort((a: string, b: string) => b.localeCompare(a)); // Sort descending

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
      let currentDate = new Date(uniqueDates[0] as string);

      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const prevDateStr = prevDate.toISOString().split('T')[0];

        if (uniqueDates[i] === prevDateStr) {
          streak++;
          currentDate = new Date(uniqueDates[i] as string);
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error in calculateStreak:', error);
      return 0;
    }
  }
}
