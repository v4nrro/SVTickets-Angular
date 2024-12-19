import { InjectionToken, Provider } from '@angular/core';

export const CLIENT_ID = new InjectionToken<string>('746820501392-oalflicqch2kuc12s8rclb5rf7b1fist');

export function provideGoogleId(clientId: string): Provider {
  return { provide: CLIENT_ID, useValue: clientId };
}