import { Injectable } from '@angular/core';

// import { Person } from '../../../models';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';

/*
  Generated class for the FirebasePeopleProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FirebasePeopleProvider {

  constructor(private angularFireDB: AngularFireDatabase) { }

  public create(creatorId: string, orgId: string, name: string): Promise<any> {
    let now = moment().format();
    return new Promise((resolve, reject) => {
      let personKey = this.angularFireDB.list(`people`).push({
        creator: creatorId,
        created: now,
        organization: orgId,
        name: name,
        timesPresent: 0,
        timesAbsent: 0
      }).key;

      this.angularFireDB.object(`organizations/${orgId}/people/${personKey}`).set(name).then(_ => {
        resolve();
      });

    });
  }

}
