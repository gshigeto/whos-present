import { Injectable } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as moment from 'moment';

/*
  Generated class for the FirebaseGroupsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebaseGroupsProvider {

  constructor(private angularFireDB: AngularFireDatabase) { }

  public create(ownerId: string, orgId: string, title: string): Promise<any> {
    let now = moment().format();
    return new Promise((resolve, reject) => {
      let groupId = this.angularFireDB.list(`groups`).push({
        owner: ownerId,
        organization_id: orgId,
        created: now,
        title: title
      }).key

      this.angularFireDB.object(`organizations/${orgId}/groups/${groupId}`).set({
        title: title,
        created: now
      }).then(_ => {
        this.angularFireDB.object(`users/${ownerId}/groups/${groupId}`).set({
          title: title,
          created: now
        }).then(_ => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  public delete(ownerId: string, orgId: string, groupId: string): Promise<any> {
    return Promise.all([
      this.angularFireDB.list(`groups`).remove(groupId),
      this.angularFireDB.object(`organizations/${orgId}/groups/${groupId}`).remove(),
      this.angularFireDB.object(`user/${ownerId}/groups/${groupId}`).remove()
    ]);
  }

  public update(ownerId: string, orgId: string, groupId: string, newTitle: string): Promise<any> {
    return Promise.all([
      this.angularFireDB.object(`groups/${groupId}`).update({ title: newTitle }),
      this.angularFireDB.object(`organizations/${orgId}/groups/${groupId}`).update({ title: newTitle }),
      this.angularFireDB.object(`user/${ownerId}/groups/${groupId}`).update({ title: newTitle })
    ]);
  }

}
