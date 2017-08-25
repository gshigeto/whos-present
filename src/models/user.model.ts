export interface User {
  created: string;
  display_name: string;
  email: string;
  last_login: string;

  groups?: Array<SubGroup>;
  organizations?: Array<SubOrganization>;
}

export interface SubGroup {
  title: string;
  id: string;
}

export interface SubOrganization {
  $key?: string;
  title: string;
  created: string;
}
