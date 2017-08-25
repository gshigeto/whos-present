export interface Group {
  organization_id: string;
  owner: string;
  title: string;
  created: string;
  read_members?: object;
  write_members?: object;
}
