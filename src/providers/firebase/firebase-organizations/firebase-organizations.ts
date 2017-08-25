import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';

/*
  Generated class for the OrganizationsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseOrganizationsProvider {

  userOrganizations: FirebaseListObservable<any>;

  constructor(private angularFireDB: AngularFireDatabase) { }

  public init(ownerId: string) {
    this.userOrganizations = this.angularFireDB.list(`users/${ownerId}/organizations`);
  }

  public create(ownerId: string, title: string): Promise<any> {
    let now = moment().format();
    return new Promise((resolve, reject) => {
      let orgId = this.angularFireDB.list(`organizations`).push({
        owner: ownerId,
        created: now,
        title: title
      }).key

      this.angularFireDB.object(`users/${ownerId}/organizations/${orgId}`).set({
        title: title,
        created: now
      }).then(_ => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public delete(ownerId: string, orgId: string): Promise<any> {
    return this.deleteOrganizationGroups(ownerId, orgId).then(_ => {
      return Promise.all([
        this.angularFireDB.list(`organizations`).remove(orgId),
        this.angularFireDB.object(`users/${ownerId}/organizations/${orgId}`).remove()
      ]);
    })
  }

  private deleteOrganizationGroups(ownerId: string, orgId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireDB.list(`organizations/${orgId}/groups`).subscribe(groups => {
        groups.forEach(group => {
          this.angularFireDB.object(`groups/${group.$key}`).remove();
          this.angularFireDB.object(`users/${ownerId}/groups/${group.$key}`).remove();
        });
        resolve();
      });
    });
  }

  public update(ownerId: string, orgId: string, newTitle: string): Promise<any> {
    return Promise.all([
      this.angularFireDB.object(`organizations/${orgId}`).update({ title: newTitle }),
      this.angularFireDB.object(`users/${ownerId}/organizations/${orgId}`).update({ title: newTitle })
    ]);
  }

}
