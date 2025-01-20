import cron from 'node-cron';
import calculatePlayerGrades from 'src/utils/calculatePlayerGrade';

cron.schedule('0 0 * * 3', () => {
  console.log('Running weekly grade calculation...');
  calculatePlayerGrades();
});
