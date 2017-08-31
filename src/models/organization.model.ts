import { Person, SubGroup } from '.';

export interface Organization {
  owner: string;
  created: string;
  title: string;
  read_members?: object;
  write_members?: object;
  groups?: Array<SubGroup>;
  people?: Array<Person>;
}
