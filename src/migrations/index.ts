import * as migration_20260807_195016_initial from './20260807_195016_initial';
import * as migration_20260808_170225_applications from './20260808_170225_applications';
import * as migration_20260909_201016_gjinia_email_index from './20260909_201016_gjinia_email_index';
import * as migration_20260909_201100_apply_throttle from './20260909_201100_apply_throttle';

export const migrations = [
  {
    up: migration_20260807_195016_initial.up,
    down: migration_20260807_195016_initial.down,
    name: '20260807_195016_initial',
  },
  {
    up: migration_20260808_170225_applications.up,
    down: migration_20260808_170225_applications.down,
    name: '20260808_170225_applications',
  },
  {
    up: migration_20260909_201016_gjinia_email_index.up,
    down: migration_20260909_201016_gjinia_email_index.down,
    name: '20260909_201016_gjinia_email_index'
  },
  {
    up: migration_20260909_201100_apply_throttle.up,
    down: migration_20260909_201100_apply_throttle.down,
    name: '20260909_201100_apply_throttle',
  },
];
