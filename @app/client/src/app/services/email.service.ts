import { Injectable } from '@angular/core';
import { ENV } from '../../environments/environment';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DeviceService, DeviceType } from './device.service';

@Injectable()
export class EmailService {
  endpoint;

  constructor(
    private http: HttpClient,
    private deviceService: DeviceService
  ) {
    this.endpoint = `${this.deviceService.device === DeviceType.ANDROID ? ENV.androidAddress : ENV.address}${ENV.serverPort ? `:${ENV.serverPort}` : ''}`;
  }

  sendResetEmail(email: string, pw: string) {
    return this.http.post(`${this.endpoint}${ENV.apiBaseURL}/mailing/reset`, { email, pw })
      .pipe(map(
        response => (response)
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  sendContactEmail(data: { why: string; name: string; email: string; content: string; }) {
    return this.http.post(`${ENV.apiBaseURL}/mailing/contact`, { data })
      .pipe(map(
        response => (response)
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  sendRegistrationEmail(email: string) {
    return this.http.post(`${ENV.apiBaseURL}/mailing/registration`, { email })
      .pipe(map(
        response => (response)
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }
}
