import { NgModule } from '@angular/core';
import { ApolloModule, Apollo } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { ENV } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';

declare global {
  interface Window {
    CSRF_TOKEN: any;
  }
}

@NgModule({
  exports: [
    ApolloModule,
  ],
  imports: [
    HttpLinkModule
  ]
})
export class GraphQLModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {

    const http = httpLink.create({ uri: ENV.apolloBaseURL, withCredentials: true, method: 'POST' });
    const middleware = setContext(() => ({
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credentials'
      })
    }));
    const moddedHttp = middleware.concat(http);
    const cache = new InMemoryCache({
      dataIdFromObject: o => o.id
    });

    const logoutOn401ErrorLink = onError(({ networkError }) => {
      if (networkError) { // && networkError.status === 401
        console.log('NETWORK ISSUE: ', networkError);
        // Logout
      }
    });
    const csrfMiddlewareLink = new ApolloLink((operation, forward) => {
      if (typeof window.CSRF_TOKEN === 'string') {
        operation.setContext({
          headers: {
            'X-Token': window.CSRF_TOKEN,
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
    const resolvers = {
      Mutation: {
        // eslint-disable-next-line no-shadow
        updateNetworkStatus: (_, { isConnected }, { cache }) => {
          cache.writeData({ data: { isConnected } });
          return null;
        },
      },
    };

    apollo.create({
      link,
      cache,
      resolvers
    });
  }
}
