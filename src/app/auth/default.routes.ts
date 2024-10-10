import { Role } from './role';

// Default routes for each role
export const defaultRoutes: { [key in Role]: string } = {
  [Role.Admin]: '/admin',
  [Role.Analyst]: '/dashboards',
  [Role.Agent]: '/incidents',
};
