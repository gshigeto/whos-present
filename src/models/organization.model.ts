export interface Organization {
  owner: string;
  created: string;
  title: string;
  read_members?: object;
  write_members?: object;
  groups?: Array<SubGroup>;
  people?: Array<Person>;
}

export interface SubGroup {
  title: string;
  id: string;
}

export interface Person {
  firstName: string;
  lastName: string;
}
