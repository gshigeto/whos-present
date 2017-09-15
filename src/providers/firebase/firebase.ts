import { Injectable } from '@angular/core';

import { FacebookProvider } from '../facebook/facebook';
import { GoogleAnalyticsProvider } from '../google-analytics/google-analytics';

import { User } from '../../models';
import { FirebaseGroupsProvider } from './firebase-groups/firebase-groups';
import { FirebaseOrganizationsProvider } from './firebase-organizations/firebase-organizations';
import { FirebasePeopleProvider } from './firebase-people/firebase-people';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import * as moment from 'moment';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FirebaseProvider {

  authUser: firebase.User;
  user: FirebaseObjectObservable<User>;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireDB: AngularFireDatabase,
    private facebook: FacebookProvider,
    private firebaseGroups: FirebaseGroupsProvider,
    private firebaseOrg: FirebaseOrganizationsProvider,
    private firebasePeople: FirebasePeopleProvider,
    private ga: GoogleAnalyticsProvider
  ) {
  }

  private init() {
    this.ga.setUserId(this.authUser.uid);
    this.user = this.angularFireDB.object(`users/${this.authUser.uid}`);
    this.firebaseOrg.init(this.authUser.uid);
  }

  private destroy() {
    this.authUser = null;
  }

  /**
   * Check to see if the user is currently logged in
   */
  public authenticated(): Promise<any> {
    return new Promise(resolve => {
      let sub = this.angularFireAuth.authState.subscribe((user: firebase.User) => {
        sub.unsubscribe();
        if (user) {
          this.angularFireDB.object(`users/${user.uid}`).update({
            last_login: moment().format()
          }).then(_ => {
            this.authUser = user
            this.init();
            resolve(user);
          });
        } else {
          this.destroy();
          resolve();
        }
      })
    });
  }

  /**
   * Sends an email to the user to reset their password
   * @param email The user's email address
  */
  public sendForgotPasswordEmail(email: string): firebase.Promise<any> {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }

  /**
   * Sign into Firebase using email and password authentication
   * @param email of the user logging in
   * @param password of the user logging in
   * @return Promise<any>
   */
  public firebaseLogin(email: string, password: string): firebase.Promise<any> {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
  }

  /**
   * Create a Firebase Auth user
   * @param email of the user being created
   * @param password of the user being created
   */
  public createFirebaseUser(credentials: { firstName: string, lastName: string, email: string, password: string }): firebase.Promise<any> {
    return new Promise((resolve, reject) => {
      this.angularFireAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password).then(_ => {
        this.userExists(`${credentials.firstName} ${credentials.lastName}`).then(_ => {
          this.sendVerificationEmail().then(_ => {
            resolve();
          }).catch(err => {
            reject(err);
          });
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Log into Facebook and sign into Firebase with Facebook Access Token
   */
  public facebookLogin(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.facebook.login().then(resp => {
        this.angularFireAuth.auth.signInWithCredential(firebase.auth.FacebookAuthProvider.credential(resp.authResponse.accessToken)).then(credentials => {
          resolve(this.userExists(credentials.displayName));
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Log out of all potential auth services
   */
  public logout(): Promise<any> {
    return Promise.all([
      this.angularFireAuth.auth.signOut()
    ]);
  }

  /**
   * Get user organizations observable
   */
  public userOrganizations() {
    return this.firebaseOrg.userOrganizations;
  }

  /**
   * Get user groups observable
   */
  public userGroups() {
    return this.firebaseOrg.userGroups;
  }

  /**
   * Create a new organization for the currently logged in user
   * @param title new organization title
   */
  public createOrganization(title: string) {
    return this.firebaseOrg.create(this.authUser.uid, title);
  }

  /**
   * Delete an organization
   * @param orgId organization id to be deleted
   */
  public deleteOrganization(orgId: string): Promise<any> {
    return this.firebaseOrg.delete(this.authUser.uid, orgId);
  }

  /**
   * Update the title of an organization
   * @param orgId organization id to be updated
   * @param newTitle new title to replace old title
   */
  public updateOrganization(orgId: string, newTitle: string): Promise<any> {
    return this.firebaseOrg.update(this.authUser.uid, orgId, newTitle);
  }

  public organizationAttendance(orgId: string): FirebaseListObservable<any> {
    return this.angularFireDB.list(`organizations/${orgId}/attendance`, {
      query: {
        limitToLast: 10
      }
    });
  }

  /**
   * Get groups and people associated with organization
   * @param orgId organization key to get information for
   */
  public organizationEntities(orgId: string) {
    return Promise.all([
      this.angularFireDB.list(`organizations/${orgId}/groups`),
      this.angularFireDB.list(`organizations/${orgId}/people`)
    ])
  }

  /**
   * Get groups and people associated with organization
   * @param orgId organization key to get information for
   */
  public organizationPeople(orgId: string) {
    return this.angularFireDB.list(`organizations/${orgId}/people`)
  }

  /**
   * Create a group under an organization
   * @param orgId organization key to create group under
   * @param title new group title
   */
  public createGroup(orgId: string, title: string): Promise<any> {
    return this.firebaseGroups.create(this.authUser.uid, orgId, title);
  }

  public addGroupPerson(groupId: string, person: any) {
    return this.firebaseGroups.addPerson(groupId, person);
  }

  public deleteGroupPerson(groupId: string, personId: any) {
    return this.firebaseGroups.deletePerson(groupId, personId);
  }

  public groupInformation(groupId: string): FirebaseObjectObservable<any> {
    return this.angularFireDB.object(`groups/${groupId}`);
  }

  /**
   * Get all people in a group
   * @param groupId group key to get people for
   */
  public groupPeople(groupId: string): FirebaseListObservable<any> {
    return this.angularFireDB.list(`groups/${groupId}/people`);
  }

  /**
   * Create a person under an organization
   * @param orgId organization key to create group under
   * @param person new person
   */
  public createPerson(orgId: string, name: string): Promise<any> {
    return this.firebasePeople.create(this.authUser.uid, orgId, name);
  }

  /**
   * Get person information from key
   * @param personId key of the person
   */
  public getPerson(personId: string): FirebaseObjectObservable<any> {
    return this.angularFireDB.object(`people/${personId}`);
  }

  public takeAttendance(orgId: string, group: string, people: Array<any>, description: string) {
    return this.firebaseOrg.takeAttendance(orgId, group, people, description);
  }

  public getAttendanceInformation(orgId: string, attendanceId: string) {
    return this.angularFireDB.object(`organizations/${orgId}/attendance/${attendanceId}`);
  }

  /**
   * Check if the authenticated user exists in DB
   * If user does not exist, create a record
   * If the user does exist, update last_login
   */
  private userExists(displayName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let authStateSubscription = this.angularFireAuth.authState.subscribe(user => {
        authStateSubscription.unsubscribe();
        let userSubscription = this.angularFireDB.object(`users/${user.uid}`).subscribe(existingUser => {
          userSubscription.unsubscribe();
          let now = moment().format();
          if (!existingUser.created) {
            user.updateProfile({
              displayName: displayName,
              photoURL: null
            }).then(_ => {
              this.angularFireDB.object(`users/${user.uid}`).set({
                display_name: user.displayName,
                email: user.email,
                last_login: now,
                created: now
              }).then(_ => {
                resolve();
              });
            });
          }
          resolve();
        });
      });
    });
  }

  /**
   * Send a verification email to the user to verify email address
   */
  public sendVerificationEmail(): Promise<any> {
    return new Promise((resolve, reject) => {
      let userSubscription = this.angularFireAuth.authState.subscribe(user => {
        userSubscription.unsubscribe();
        user.sendEmailVerification().then(_ => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    });
  }

}
