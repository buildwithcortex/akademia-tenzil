import * as migration_20260807_195016_initial from './20260807_195016_initial';
import * as migration_20260808_170225_applications from './20260808_170225_applications';

export const migrations = [
  {
    up: migration_20260807_195016_initial.up,
    down: migration_20260807_195016_initial.down,
    name: '20260807_195016_initial',
  },
  {
    up: migration_20260808_170225_applications.up,
    down: migration_20260808_170225_applications.down,
    name: '20260808_170225_applications'
  },
];
