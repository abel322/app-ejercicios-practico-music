import { prisma } from '../lib/prisma';

export class ExportService {
  /**
   * Export all user data as JSON
   */
  static async exportDataJSON(userId: string) {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Get all books with exercises
    const books = await prisma.book.findMany({
      where: { userId },
      include: {
        exercises: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get all sessions with exercises
    const sessions = await prisma.session.findMany({
      where: { userId },
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
    });

    // Build export data
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        userId: user.id,
      },
      user: {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      books,
      sessions,
    };

    return exportData;
  }

  /**
   * Export session statistics as CSV
   */
  static async exportStatsCSV(userId: string) {
    // Get all sessions with exercises
    const sessions = await prisma.session.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                book: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    // Build CSV header
    const csvRows: string[] = [
      'Fecha,Duración (min),Ejercicios,Notas',
    ];

    // Build CSV rows
    for (const session of sessions) {
      const date = session.date.toISOString().split('T')[0];
      const duration = session.durationMinutes;
      const exercises = session.exercises
        .map((se) => `${se.exercise.book.name} - ${se.exercise.name}`)
        .join('; ');
      const notes = session.notes.replace(/"/g, '""'); // Escape quotes

      csvRows.push(`"${date}","${duration}","${exercises}","${notes}"`);
    }

    return csvRows.join('\n');
  }

  /**
   * Generate filename for JSON export
   */
  static getJSONFilename(): string {
    const date = new Date().toISOString().split('T')[0];
    return `data-export-${date}.json`;
  }

  /**
   * Generate filename for CSV export
   */
  static getCSVFilename(): string {
    const date = new Date().toISOString().split('T')[0];
    return `practice-stats-${date}.csv`;
  }
}
