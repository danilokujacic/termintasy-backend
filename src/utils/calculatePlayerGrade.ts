import { PrismaClient, Player, GameStat } from '@prisma/client';

const prisma = new PrismaClient();

export default async function calculatePlayerGrades(): Promise<void> {
  // Fetch all players with their game stats
  const players: (Player & { gameStats: GameStat[] })[] =
    await prisma.player.findMany({
      include: {
        gameStats: true, // Include all game stats for the player
      },
    });

  // Define a function to determine the overall grade based on the number of games
  function determineOverallGrade(grades: string[], numGames: number): string {
    // Count occurrences of each grade
    const gradeCounts: Record<string, number> = grades.reduce(
      (counts, grade) => {
        counts[grade] = (counts[grade] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>,
    );

    // Logic to determine overall grade based on the number of games played
    // If a player has less than 3 games, we'll limit their grade to "A" or below
    if (numGames < 3) {
      if (gradeCounts['S'] && gradeCounts['S'] > 0) {
        return 'A'; // A player with 1 or 2 games cannot have an "S" grade
      }
      return gradeCounts['A'] ? 'A' : 'F'; // If no S grade, default to A or F
    }

    // Sort grades by frequency and priority (S > A > F)
    const sortedGrades = Object.entries(gradeCounts).sort(
      (a, b) =>
        b[1] - a[1] ||
        ['S', 'A', 'F'].indexOf(a[0]) - ['S', 'A', 'F'].indexOf(b[0]),
    );

    return sortedGrades[0][0]; // Return the grade with the highest frequency
  }

  // Calculate and update each player's grade
  for (const player of players) {
    const grades: string[] = player.gameStats
      .map((stat) => stat.grade)
      .filter((grade) => grade); // Get all grades

    const numGames = player.gameStats.filter((stat) => stat.played).length; // Count the number of games played

    if (grades.length > 0) {
      const overallGrade: string = determineOverallGrade(grades, numGames);

      await prisma.player.update({
        where: { id: player.id },
        data: { grade: overallGrade },
      });
    }
  }

  console.log('Player grades updated successfully!');
}

// Call the function to calculate grades
calculatePlayerGrades();
