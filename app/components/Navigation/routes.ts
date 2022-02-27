import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCutlery } from '@fortawesome/free-solid-svg-icons';

export type AppRoute = {
  path: string;
  displayName: string;
  displayInNav: boolean;
  icon: IconDefinition;
};

export const routes: AppRoute[] = [
  {
    path: '/brackets',
    displayName: 'Brackets',
    displayInNav: true,
    icon: faCutlery,
  },
];
