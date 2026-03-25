import { prisma } from '../lib/prisma';
import { GoalType } from '@prisma/client';

export class GoalService {
  /**
   * Get all goals for a user
   */
  static async getGoals(userId: string, activeOnly?: boolean, instrument?: string) {
    const where: any = { userId };

    if (activeOnly !== undefined) {
      where.active = activeOnly;
    }

    if (instrument) {
      where.instrument = instrument;
    }

    const goals = await prisma.goal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return goals;
  }

  /**
   * Get a single goal by ID with current progress
   */
  static async getGoal(goalId: string, userId: string) {
    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId,
      },
    });

    if (!goal) {
      throw new Error('Meta no encontrada');
    }

    // Calculate current progress
    const progress = await this.calculateGoalProgress(goal);

    return { goal, progress };
  }

  /**
   * Create a new goal
   */
  static async createGoal(
    userId: string,
    data: {
      type: GoalType;
      targetMinutes: number;
      startDate: string;
    }
  ) {
    const goal = await prisma.goal.create({
      data: {
        userId,
        type: data.type,
        targetMinutes: data.targetMinutes,
        startDate: new Date(data.startDate),
        active: true,
      },
    });

    return goal;
  }

  /**
   * Update a goal
   */
  static async updateGoal(
    goalId: string,
    userId: string,
    data: {
      targetMinutes?: number;
      active?: boolean;
    }
  ) {
    // Check if goal exists and belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!existingGoal) {
      throw new Error('Meta no encontrada');
    }

    // Update goal
    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        ...(data.targetMinutes !== undefined && { targetMinutes: data.targetMinutes }),
        ...(data.active !== undefined && { active: data.active }),
      },
    });

    return goal;
  }

  /**
   * Delete a goal
   */
  static async deleteGoal(goalId: string, userId: string) {
    // Check if goal exists and belongs to user
    const goal = await prisma.goal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) {
      throw new Error('Meta no encontrada');
    }

    // Delete goal
    await prisma.goal.delete({
      where: { id: goalId },
    });

    return { message: 'Meta eliminada exitosamente' };
  }

  /**
   * Calculate progress for a goal
   * Returns current minutes practiced and percentage of completion
   */
  static async calculateGoalProgress(goal: {
    userId: string;
    type: GoalType;
    targetMinutes: number;
    startDate: Date;
  }): Promise<{ currentMinutes: number; percentage: number; completed: boolean }> {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (goal.type === 'DAILY') {
      // For daily goals: compare time today vs target
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else {
      // For weekly goals: compare time this week vs target
      // Get start of week (Monday)
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday (0) to be end of week
      startDate = new Date(now);
      startDate.setDate(now.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);

      // Get end of week (Sunday)
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    }

    // Get total minutes practiced in the period
    const sessions = await prisma.session.findMany({
      where: {
        userId: goal.userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        durationMinutes: true,
      },
    });

    const currentMinutes = sessions.reduce((sum: number, session: any) => sum + session.durationMinutes, 0);
    const percentage = Math.min(Math.round((currentMinutes / goal.targetMinutes) * 100), 100);
    const completed = currentMinutes >= goal.targetMinutes;

    return { currentMinutes, percentage, completed };
  }

  /**
   * Check if any active goals were completed after a session
   * Returns array of completed goals
   */
  static async checkCompletedGoals(userId: string): Promise<any[]> {
    // Get all active goals
    const activeGoals = await prisma.goal.findMany({
      where: {
        userId,
        active: true,
      },
    });

    const completedGoals = [];

    // Check each goal
    for (const goal of activeGoals) {
      const progress = await this.calculateGoalProgress(goal);
      if (progress.completed) {
        completedGoals.push({
          id: goal.id,
          type: goal.type,
          targetMinutes: goal.targetMinutes,
          currentMinutes: progress.currentMinutes,
        });
      }
    }

    return completedGoals;
  }
}
