import { Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AppVersion } from '@ionic-native/app-version';
import { ENV } from '@app/env';

/*
  Generated class for the GoogleAnalyticsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GoogleAnalyticsProvider {

  constructor(private appVersion: AppVersion, private ga: GoogleAnalytics) { }

  init(): void {
    this.ga.startTrackerWithId(ENV.GOOGLE_ANALYTICS).then(_ => {
      this.appVersion.getVersionNumber().then((version: string) => {
        this.ga.setAppVersion(version);
        console.info(`Goodle Analytics started for v${version}`);
      }).catch(err => console.warn(`Get version number error: ${err}`));
    }).catch(err => console.warn(`Start with TrackerID error: ${err}`));
  }

  /**
   * Set user id for Google Analytics
   * @param userId
   */
  setUserId(userId: string) {
    this.ga.setUserId(userId)
  }

  /**
   * Track a view with Google Analytics
   * @param view name of view to track
   */
  trackView(view: string) {
    this.ga.trackView(view);
  }

  /**
   * Track an event with Google Analytics
   * @param category
   * @param action
   */
  trackEvent(category: string, action: string, label?: string): void {
    this.ga.trackEvent(category, action, label);
  }

}
