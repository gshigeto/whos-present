import { SubGroup, SubOrganization } from '.'

export interface User {
  created: string;
  display_name: string;
  email: string;
  last_login: string;

  groups?: Array<SubGroup>;
  organizations?: Array<SubOrganization>;
}
