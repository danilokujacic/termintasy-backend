const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
(async () => {
  const playerNicknamess = [
    {
      name: 'Stefan Ilic',
      nicknames: 'stivi,skakaneli,stipe',
    },
    // {
    //   name: 'Ilija Brankovic',
    //   nicknames: 'idzo',
    // },
    // {
    //   name: 'Simke',
    //   nicknames: 'simke,simi',
    // },
    {
      name: 'Djordjije Vujovic',
      nicknames: 'djole',
    },
    {
      name: 'Pavle Mrakovic',
      nicknames: 'paka,mrak',
    },
    {
      name: 'Ivan Bojanovic',
      nicknames: 'ivo,ibo',
    },
    {
      name: 'Petar Lekovic',
      nicknames: 'leko,pero',
    },
    {
      name: 'Aleksandar Stevanovic',
      nicknames: 'sale,sasa',
    },
    {
      name: 'Andrija Filipovic',
      nicknames: 'ada',
    },
    {
      name: 'Matija Filipovic',
      nicknames: 'matija',
    },
    {
      name: 'Aleksandar Buskovic',
      nicknames: 'buske,aco',
    },
    {
      name: 'Nikola Burzanovic',
      nicknames: 'burzo,dzoni',
    },
    {
      name: 'Andrija Vujovic',
      nicknames: 'drki',
    },
    {
      name: 'Aleksandar Radosevic',
      nicknames: 'rados,rale',
    },
    {
      name: 'Danilo Kujacic',
      nicknames: 'kujo,kuki,kujaca',
    },
    {
      name: 'Matija Sofranac',
      nicknames: 'sole',
    },
  ];
  for (const player of playerNicknamess) {
    console.log(player.name);
    await prisma.player.update({
      where: {
        name: player.name,
      },
      data: {
        nicknames: player.nicknames,
      },
    });
  }
})();
