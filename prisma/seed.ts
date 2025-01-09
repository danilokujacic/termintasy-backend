const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
(async () => {
  // {
  //   name: 'Pavle Mrakovic',
  //   position: 'DEF',
  // },
  // {
  //   name: 'Petar Lekovic',
  //   position: 'DEF',
  // },
  // {
  //   name: 'Danilo Kujacic',
  //   position: 'DEF',
  // },
  // {
  //   name: 'Aleksandar Stevanovic',
  //   position: 'DEF',
  // },
  const players = [
    {
      name: 'Aleksandar Radosevic',
      position: 'GK',
    },
    {
      name: 'Vojo',
      position: 'GK',
    },
    {
      name: 'Aleksandar Buskovic',
      position: 'GK',
    },
    {
      name: 'Jovan Savovic',
      position: 'GK',
    },
    {
      name: 'Nikola Burzanovic',
      position: 'ATK',
    },
    {
      name: 'Vidak Buskovic',
      position: 'ATK',
    },
    {
      name: 'Andrija Vujovic',
      position: 'DEF',
    },
    {
      name: 'Petar Lekovic',
      position: 'DEF',
    },
    {
      name: 'Danilo Kujacic',
      position: 'DEF',
    },
    {
      name: 'Aleksandar Stevanovic',
      position: 'DEF',
    },
    {
      name: 'Pavle Mrakovic',
      position: 'DEF',
    },
    {
      name: 'Stefan Ilic',
      position: 'ATK',
    },
    {
      name: 'Matija Sofranac',
      position: 'ATK',
    },
    {
      name: 'Ivan Bojanovic',
      position: 'MID',
    },
    {
      name: 'Djordjije Vujovic',
      position: 'ATK',
    },
    {
      name: 'Matija Filipovic',
      position: 'MID',
    },
    {
      name: 'Andrija Filipovic',
      position: 'MID',
    },
  ];

  console.info('Starting seed players...');

  await Promise.all(
    players.map((playerData) => prisma.player.create({ data: playerData }))
  );

  console.info('Seed finished.');
})();
