const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
(async () => {
  const playerImages = [
    {
      name: 'Stefan Ilic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983941/stipe_ismuwn.png',
    },
    {
      name: 'Ilija Brankovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736989345/ilija_vi4ea3.png',
    },
    {
      name: 'Simke',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736989345/simke_yufpef.png',
    },
    {
      name: 'Djordjije Vujovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983941/djole_r3vrpb.png',
    },
    {
      name: 'Pavle Mrakovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983941/paka_mp1qnf.png',
    },
    {
      name: 'Vidak Buskovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983941/idzo_xicyvw.png',
    },
    {
      name: 'Ivan Bojanovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983941/ivo_nhqtny.png',
    },
    {
      name: 'Petar Lekovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983941/leko_pntqsf.png',
    },
    {
      name: 'Aleksandar Stevanovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983940/sale_xqc2bz.png',
    },
    {
      name: 'Andrija Filipovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736987628/andrija_f_zatnj0.png',
    },
    {
      name: 'Matija Filipovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736987627/matija_f_n12bc1.png',
    },
    {
      name: 'Aleksandar Buskovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736987628/buske_b3wzmk.png',
    },
    {
      name: 'Nikola Burzanovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736987627/burzo_nqpswa.png',
    },
    {
      name: 'Andrija Vujovic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736988696/drki_s4muab.png',
    },
    {
      name: 'Aleksandar Radosevic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736988696/rale_tbolgc.png',
    },
    {
      name: 'Danilo Kujacic',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736988696/kuki_woudlp.png',
    },
    {
      name: 'Matija Sofranac',
      image:
        'https://res.cloudinary.com/dlryrlcb1/image/upload/v1736983940/sole_fdpyvc.png',
    },
  ];
  for (const player of playerImages) {
    await prisma.player.update({
      where: {
        name: player.name,
      },
      data: {
        image: player.image,
      },
    });
  }
})();
