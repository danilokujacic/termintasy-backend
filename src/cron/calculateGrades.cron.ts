import cron from 'node-cron';
import calculatePlayerGrades from '../utils/calculatePlayerGrade';
import calculateGrade from '../utils/calculateGameStatsGrades';

cron.schedule('0 0 * * 3', () => {
  console.log('Running weekly grade calculation...');
  calculateGrade();
  calculatePlayerGrades();
});
