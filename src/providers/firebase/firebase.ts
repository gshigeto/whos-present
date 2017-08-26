import { Injectable } from '@angular/core';

import { FacebookProvider } from '../facebook/facebook';

import { User, SubOrganization } from '../../models/user.model';
import { FirebaseOrganizationsProvider } from './firebase-organizations/firebase-organizations';
import { FirebaseGroupsProvider } from './firebase-groups/firebase-groups';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
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
    private firebaseOrg: FirebaseOrganizationsProvider
  ) {
    angularFireAuth.authState.subscribe(authUser => {
      if (authUser) {
        this.angularFireDB.object(`users/${authUser.uid}`).update({
          last_login: moment().format()
        }).then(_ => {
          this.authUser = authUser
          this.init();
        });
      } else {
        this.destroy();
      }
    });
  }

  private init() {
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
        resolve(user);
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

  /**
   * Get groups and people associated with organization
   * @param orgId organization key to get information for
   */
  public organizationInfo(orgId: string): Promise<any> {
    return Promise.all([
      this.angularFireDB.list(`organizations/${orgId}/groups`),
      this.angularFireDB.list(`organizations/${orgId}/people`)
    ])
  }

  public createGroup(orgId: string, title: string): Promise<any> {
    return this.firebaseGroups.create(this.authUser.uid, orgId, title);
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
