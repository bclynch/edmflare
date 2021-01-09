import { Apollo } from 'apollo-angular';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { NgModule, Inject, PLATFORM_ID } from '@angular/core';
import { ENV } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObjectService } from './services/globalObject.service';

declare global {
  interface Window {
    CSRF_TOKEN: any;
  }
}

@NgModule({})
export class GraphQLModule {
  windowRef;

  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    private globalObjectService: GlobalObjectService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.windowRef = this.globalObjectService.getWindow();
    const http = httpLink.create({ uri: ENV.apolloBaseURL, withCredentials: true, method: 'POST' });
    const middleware = setContext(() => ({
      headers: new HttpHeaders({
        // 'Access-Control-Allow-Origin': 'http://localhost:4200',
        // 'Content-Type': 'application/json',
        // 'Access-Control-Allow-Credentials': 'true',
        // 'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
        // 'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credentials'
      })
    }));
    const moddedHttp = middleware.concat(http);
    // const cache = new InMemoryCache({
    //   dataIdFromObject: o => o.id
    // });
    const cache = new InMemoryCache();

    const logoutOn401ErrorLink = onError(({ networkError }) => {
      if (networkError) { // && networkError.status === 401
        console.log('NETWORK ISSUE: ', networkError);
        // Logout
      }
    });
    const csrfMiddlewareLink = new ApolloLink((operation, forward) => {
      if (isPlatformBrowser(this.platformId) && typeof this.windowRef.CSRF_TOKEN === 'string') {
        operation.setContext({
          headers: {
            'X-Token': this.windowRef.CSRF_TOKEN,
          },
        });
      }
      return forward(operation);
    });

    const link = ApolloLink.from([
      logoutOn401ErrorLink,
      csrfMiddlewareLink,
      moddedHttp
    ]);
    // const resolvers = {
    //   Mutation: {
    //     // eslint-disable-next-line no-shadow
    //     updateNetworkStatus: (_, { isConnected }, { cache }) => {
    //       cache.writeData({ data: { isConnected } });
    //       return null;
    //     },
    //   },
    // };

    apollo.create({
      link,
      cache,
      // resolvers
    });
  }
}
