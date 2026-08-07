import * as migration_20260807_195016_initial from './20260807_195016_initial';

export const migrations = [
  {
    up: migration_20260807_195016_initial.up,
    down: migration_20260807_195016_initial.down,
    name: '20260807_195016_initial'
  },
];
