const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
(async () => {
  const teams = await prisma.userTeam.findMany({
    include: {
      players: true,
    },
  });

  if (!teams || !teams.length) {
    throw Error('No teams');
  }

  console.log('setting captains');
  for (let team of teams) {
    await prisma.userTeam.update({
      where: {
        id: team.id,
      },
      data: {
        captain: {
          connect: {
            id: team.players[0].id,
          },
        },
      },
    });
  }

  console.log('captains settled');
})();
