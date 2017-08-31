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
  userGroups: FirebaseListObservable<any>;

  constructor(private angularFireDB: AngularFireDatabase) { }

  public init(ownerId: string) {
    this.userOrganizations = this.angularFireDB.list(`users/${ownerId}/organizations`);
    this.userGroups = this.angularFireDB.list(`users/${ownerId}/groups`);
  }

  public create(ownerId: string, title: string): Promise<any> {
    let now = moment().format();
    return new Promise((resolve, reject) => {
      let orgId = this.angularFireDB.list(`organizations`).push({
        creator: ownerId,
        created: now,
        title: title
      }).key

      this.angularFireDB.object(`users/${ownerId}/organizations/${orgId}`).set(title).then(_ => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  public delete(ownerId: string, orgId: string): Promise<any> {
    return this.deleteOrganizationGroups(ownerId, orgId).then(_ => {
      return this.deleteOrganizationPeople(orgId).then(_ => {
        return Promise.all([
          this.angularFireDB.list(`organizations`).remove(orgId),
          this.angularFireDB.object(`users/${ownerId}/organizations/${orgId}`).remove()
        ]);
      })
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

  private deleteOrganizationPeople(orgId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireDB.list(`organizations/${orgId}/people`).subscribe(people => {
        people.forEach(person => {
          this.angularFireDB.object(`people/${person.$key}`).remove();
        });
        resolve();
      });
    });
  }

  public update(ownerId: string, orgId: string, newTitle: string): Promise<any> {
    return Promise.all([
      this.angularFireDB.object(`organizations/${orgId}`).update({ title: newTitle }),
      this.angularFireDB.object(`users/${ownerId}/organizations/${orgId}`).set(newTitle)
    ]);
  }

  public takeAttendance(orgId: string, people: Array<any>, description: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let now = moment().format();
      description = description || 'No Description';
      let attendanceKey = this.angularFireDB.list(`attendance`).push({
        created: now,
        description: description
      }).key;

      this.angularFireDB.object(`organizations/${orgId}/attendance/${attendanceKey}`).set(description).then(_ => {
        people.forEach(person => {
          let update = person.present ? 'timesPresent' : 'timesAbsent';
          this.angularFireDB.object(`people/${person.$key}/attendance/${attendanceKey}`).set(person.present || false);
          let subscription = this.angularFireDB.object(`people/${person.$key}/${update}`).subscribe(number => {
            subscription.unsubscribe();
            this.angularFireDB.object(`people/${person.$key}/${update}`).set(number.$value + 1);
          });
        });
        resolve();
      });
    });
  }

}
