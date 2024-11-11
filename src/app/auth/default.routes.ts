import { Role } from './role';

// Default routes for each role
export const defaultRoutes: Record<Role, string> = {
  [Role.Admin]: '/admin',
  [Role.Analyst]: '/dashboards',
  [Role.Agent]: '/incidents',
};
