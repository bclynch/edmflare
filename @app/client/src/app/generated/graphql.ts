// ====================================================
// START: Apollo Angular template
// ====================================================

import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";

import gql from "graphql-tag";

// ====================================================
// Apollo Services
// ====================================================

@Injectable({
  providedIn: "root"
})
export class AllLocationsGQL extends Apollo.Query<
  AllLocations.Query,
  AllLocations.Variables
> {
  document: any = gql`
    query allLocations($currentDate: BigInt!) {
      regions {
        nodes {
          name
          lat
          lon
          citiesByRegion(orderBy: REGION_ASC) {
            nodes {
              id
              name
              venuesByCity {
                nodes {
                  eventsByVenue(
                    filter: {
                      startDate: { greaterThanOrEqualTo: $currentDate }
                    }
                  ) {
                    totalCount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ArtistByNameGQL extends Apollo.Query<
  ArtistByName.Query,
  ArtistByName.Variables
> {
  document: any = gql`
    query artistByName($name: String!, $userId: Int!) {
      artist(name: $name) {
        name
        description
        photo
        twitterUsername
        twitterUrl
        facebookUsername
        facebookUrl
        instagramUsername
        instagramUrl
        soundcloudUsername
        soundcloudUrl
        youtubeUsername
        youtubeUrl
        spotifyUrl
        homepage
        genreToArtists {
          nodes {
            genreId
          }
        }
        followLists(filter: { userId: { equalTo: $userId } }) {
          nodes {
            id
          }
        }
        artistToEvents {
          nodes {
            event {
              name
              venue
              startDate
              id
              ticketproviderurl
              ticketproviderid
              watchLists(filter: { userId: { equalTo: $userId } }) {
                nodes {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateFollowListGQL extends Apollo.Mutation<
  CreateFollowList.Mutation,
  CreateFollowList.Variables
> {
  document: any = gql`
    mutation createFollowList(
      $userId: Int!
      $artistId: String
      $venueId: String
    ) {
      createFollowList(
        input: {
          followList: {
            userId: $userId
            artistId: $artistId
            venueId: $venueId
          }
        }
      ) {
        followList {
          id
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreatePushSubscriptionGQL extends Apollo.Mutation<
  CreatePushSubscription.Mutation,
  CreatePushSubscription.Variables
> {
  document: any = gql`
    mutation createPushSubscription(
      $userId: Int!
      $endpoint: String!
      $p256Dh: String!
      $auth: String!
    ) {
      createPushSubscription(
        input: {
          pushSubscription: {
            userId: $userId
            endpoint: $endpoint
            expirationTime: null
            p256Dh: $p256Dh
            auth: $auth
          }
        }
      ) {
        clientMutationId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateWatchListGQL extends Apollo.Mutation<
  CreateWatchList.Mutation,
  CreateWatchList.Variables
> {
  document: any = gql`
    mutation createWatchList($userId: Int!, $eventId: String!) {
      createWatchList(
        input: { watchList: { userId: $userId, eventId: $eventId } }
      ) {
        watchList {
          id
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CreateWatchedToAccountGQL extends Apollo.Mutation<
  CreateWatchedToAccount.Mutation,
  CreateWatchedToAccount.Variables
> {
  document: any = gql`
    mutation createWatchedToAccount(
      $userId: Int!
      $region: String
      $cityId: Int
    ) {
      createWatchedToAccount(
        input: {
          watchedToAccount: {
            userId: $userId
            region: $region
            cityId: $cityId
          }
        }
      ) {
        watchedToAccount {
          id
          region
          city {
            id
            name
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class CurrentUserGQL extends Apollo.Query<
  CurrentUser.Query,
  CurrentUser.Variables
> {
  document: any = gql`
    query currentUser {
      currentUser {
        username
        notificationFrequency
        pushNotification
        emailNotification
        profilePhoto
        id
        watchLists {
          totalCount
        }
        pushSubscriptions {
          nodes {
            id
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeletePushSubscriptionByIdGQL extends Apollo.Mutation<
  DeletePushSubscriptionById.Mutation,
  DeletePushSubscriptionById.Variables
> {
  document: any = gql`
    mutation deletePushSubscriptionById($id: Int!) {
      deletePushSubscription(input: { id: $id }) {
        clientMutationId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class DeleteWatchedByIdGQL extends Apollo.Mutation<
  DeleteWatchedById.Mutation,
  DeleteWatchedById.Variables
> {
  document: any = gql`
    mutation deleteWatchedById($id: Int!) {
      deleteWatchedToAccount(input: { id: $id }) {
        clientMutationId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class EventByIdGQL extends Apollo.Query<
  EventById.Query,
  EventById.Variables
> {
  document: any = gql`
    query eventById($eventId: String!, $userId: Int!) {
      event(id: $eventId) {
        id
        name
        startDate
        endDate
        ticketproviderurl
        ticketproviderid
        description
        banner
        venueByVenue {
          name
          lat
          lon
          city
          address
        }
        watchLists(filter: { userId: { equalTo: $userId } }) {
          nodes {
            id
          }
        }
        artistToEvents {
          nodes {
            artist {
              name
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ForgotPasswordGQL extends Apollo.Mutation<
  ForgotPassword.Mutation,
  ForgotPassword.Variables
> {
  document: any = gql`
    mutation forgotPassword($email: String!) {
      forgotPassword(input: { email: $email }) {
        success
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class LoginUserGQL extends Apollo.Mutation<
  LoginUser.Mutation,
  LoginUser.Variables
> {
  document: any = gql`
    mutation loginUser($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        user {
          username
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class RegisterUserGQL extends Apollo.Mutation<
  RegisterUser.Mutation,
  RegisterUser.Variables
> {
  document: any = gql`
    mutation registerUser(
      $username: String!
      $email: String!
      $password: String!
    ) {
      register(
        input: { username: $username, email: $email, password: $password }
      ) {
        user {
          username
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class RemoveFollowlistGQL extends Apollo.Mutation<
  RemoveFollowlist.Mutation,
  RemoveFollowlist.Variables
> {
  document: any = gql`
    mutation removeFollowlist($followListId: Int!) {
      deleteFollowList(input: { id: $followListId }) {
        clientMutationId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class RemoveWatchlistGQL extends Apollo.Mutation<
  RemoveWatchlist.Mutation,
  RemoveWatchlist.Variables
> {
  document: any = gql`
    mutation removeWatchlist($watchListId: Int!) {
      deleteWatchList(input: { id: $watchListId }) {
        clientMutationId
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class ResetPasswordGQL extends Apollo.Mutation<
  ResetPassword.Mutation,
  ResetPassword.Variables
> {
  document: any = gql`
    mutation resetPassword(
      $userId: Int!
      $token: String!
      $newPassword: String!
    ) {
      resetPassword(
        input: { userId: $userId, token: $token, newPassword: $newPassword }
      ) {
        user {
          username
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class SearchEventsByCityGQL extends Apollo.Query<
  SearchEventsByCity.Query,
  SearchEventsByCity.Variables
> {
  document: any = gql`
    query searchEventsByCity(
      $query: String!
      $cityId: Int!
      $userId: Int!
      $greaterThan: BigInt!
      $lessThan: BigInt!
      $batchSize: Int
      $offset: Int
    ) {
      searchEventsByCity(
        query: $query
        cityid: $cityId
        filter: {
          startDate: {
            greaterThanOrEqualTo: $greaterThan
            lessThanOrEqualTo: $lessThan
          }
        }
        first: $batchSize
        offset: $offset
      ) {
        totalCount
        nodes {
          id
          name
          startDate
          ticketproviderurl
          ticketproviderid
          venue
          createdAt
          venueByVenue {
            lat
            lon
          }
          artistToEvents(first: 1) {
            nodes {
              artist {
                photo
              }
            }
          }
          watchLists(filter: { userId: { equalTo: $userId } }) {
            nodes {
              id
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class SearchEventsByRegionGQL extends Apollo.Query<
  SearchEventsByRegion.Query,
  SearchEventsByRegion.Variables
> {
  document: any = gql`
    query searchEventsByRegion(
      $query: String!
      $regionName: String!
      $userId: Int!
      $greaterThan: BigInt!
      $lessThan: BigInt!
      $batchSize: Int
      $offset: Int
    ) {
      searchEventsByRegion(
        query: $query
        regionName: $regionName
        filter: {
          startDate: {
            greaterThanOrEqualTo: $greaterThan
            lessThanOrEqualTo: $lessThan
          }
        }
        first: $batchSize
        offset: $offset
      ) {
        totalCount
        nodes {
          id
          name
          startDate
          ticketproviderurl
          ticketproviderid
          venue
          createdAt
          venueByVenue {
            lat
            lon
          }
          artistToEvents(first: 1) {
            nodes {
              artist {
                photo
              }
            }
          }
          watchLists(filter: { userId: { equalTo: $userId } }) {
            nodes {
              id
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UpdateAccountGQL extends Apollo.Mutation<
  UpdateAccount.Mutation,
  UpdateAccount.Variables
> {
  document: any = gql`
    mutation updateAccount(
      $userId: Int!
      $profilePhoto: String
      $notificationFrequency: Frequency
      $pushNotification: Boolean
      $emailNotification: Boolean
    ) {
      updateUser(
        input: {
          id: $userId
          patch: {
            notificationFrequency: $notificationFrequency
            profilePhoto: $profilePhoto
            pushNotification: $pushNotification
            emailNotification: $emailNotification
          }
        }
      ) {
        user {
          username
          notificationFrequency
          profilePhoto
          pushNotification
          emailNotification
          id
          watchLists {
            totalCount
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class UserByUsernameGQL extends Apollo.Query<
  UserByUsername.Query,
  UserByUsername.Variables
> {
  document: any = gql`
    query userByUsername($username: String!, $userId: Int!) {
      userByUsername(username: $username) {
        username
        profilePhoto
        watchLists {
          totalCount
          nodes {
            event {
              id
              name
              startDate
              ticketproviderurl
              ticketproviderid
              venue
              createdAt
              artistToEvents(first: 1) {
                nodes {
                  artist {
                    photo
                  }
                }
              }
              watchLists(filter: { userId: { equalTo: $userId } }) {
                nodes {
                  id
                }
              }
            }
          }
        }
        followLists {
          totalCount
          nodes {
            id
            artist {
              name
              photo
            }
            venue {
              name
              photo
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class VenueByNameGQL extends Apollo.Query<
  VenueByName.Query,
  VenueByName.Variables
> {
  document: any = gql`
    query venueByName($name: String!, $userId: Int!, $currentDate: BigInt!) {
      venue(name: $name) {
        name
        description
        lat
        lon
        city
        address
        photo
        logo
        followLists(filter: { userId: { equalTo: $userId } }) {
          nodes {
            id
          }
        }
        eventsByVenue(
          orderBy: START_DATE_ASC
          filter: { startDate: { greaterThanOrEqualTo: $currentDate } }
        ) {
          nodes {
            name
            startDate
            ticketproviderurl
            ticketproviderid
            id
            artistToEvents(first: 1) {
              nodes {
                artist {
                  photo
                }
              }
            }
          }
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class VerifyUserEmailGQL extends Apollo.Mutation<
  VerifyUserEmail.Mutation,
  VerifyUserEmail.Variables
> {
  document: any = gql`
    mutation verifyUserEmail($token: String!) {
      verifyUserEmail(input: { token: $token }) {
        userEmail {
          isVerified
        }
      }
    }
  `;
}
@Injectable({
  providedIn: "root"
})
export class WatchedLocationByAccountGQL extends Apollo.Query<
  WatchedLocationByAccount.Query,
  WatchedLocationByAccount.Variables
> {
  document: any = gql`
    query watchedLocationByAccount($userId: Int!) {
      watchedToAccounts(filter: { userId: { equalTo: $userId } }) {
        nodes {
          id
          region
          city {
            id
            name
          }
        }
      }
    }
  `;
}

// ====================================================
// END: Apollo Angular template
// ====================================================

export type Maybe<T> = T | null;

/** A condition to be used against `Artist` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface ArtistCondition {
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<string>;
}
/** A filter to be used against `Artist` object types. All fields are combined with a logical ‘and.’ */
export interface ArtistFilter {
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<ArtistFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<ArtistFilter[]>;
  /** Negates the expression. */
  not?: Maybe<ArtistFilter>;
}
/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export interface StringFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<string>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<string>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<string>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<string>;
  /** Included in the specified list. */
  in?: Maybe<string[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<string[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<string>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<string>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<string>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<string>;
  /** Contains the specified string (case-sensitive). */
  includes?: Maybe<string>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: Maybe<string>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: Maybe<string>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: Maybe<string>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: Maybe<string>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: Maybe<string>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: Maybe<string>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: Maybe<string>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: Maybe<string>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: Maybe<string>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: Maybe<string>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: Maybe<string>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: Maybe<string>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: Maybe<string>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: Maybe<string>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: Maybe<string>;
  /** Matches the specified pattern using the SQL standard's definition of a regular expression. */
  similarTo?: Maybe<string>;
  /** Does not match the specified pattern using the SQL standard's definition of a regular expression. */
  notSimilarTo?: Maybe<string>;
}
/** A condition to be used against `GenreToArtist` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface GenreToArtistCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `genreId` field. */
  genreId?: Maybe<string>;
  /** Checks for equality with the object’s `artistId` field. */
  artistId?: Maybe<string>;
}
/** A filter to be used against `GenreToArtist` object types. All fields are combined with a logical ‘and.’ */
export interface GenreToArtistFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `genreId` field. */
  genreId?: Maybe<StringFilter>;
  /** Filter by the object’s `artistId` field. */
  artistId?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<GenreToArtistFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<GenreToArtistFilter[]>;
  /** Negates the expression. */
  not?: Maybe<GenreToArtistFilter>;
}
/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export interface IntFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<number>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<number>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<number>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<number>;
  /** Included in the specified list. */
  in?: Maybe<number[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<number[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<number>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<number>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<number>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<number>;
}
/** A condition to be used against `ArtistToEvent` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface ArtistToEventCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `artistId` field. */
  artistId?: Maybe<string>;
  /** Checks for equality with the object’s `eventId` field. */
  eventId?: Maybe<string>;
}
/** A filter to be used against `ArtistToEvent` object types. All fields are combined with a logical ‘and.’ */
export interface ArtistToEventFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `artistId` field. */
  artistId?: Maybe<StringFilter>;
  /** Filter by the object’s `eventId` field. */
  eventId?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<ArtistToEventFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<ArtistToEventFilter[]>;
  /** Negates the expression. */
  not?: Maybe<ArtistToEventFilter>;
}
/** A condition to be used against `Region` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface RegionCondition {
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<string>;
  /** Checks for equality with the object’s `country` field. */
  country?: Maybe<string>;
}
/** A filter to be used against `Region` object types. All fields are combined with a logical ‘and.’ */
export interface RegionFilter {
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `country` field. */
  country?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<RegionFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<RegionFilter[]>;
  /** Negates the expression. */
  not?: Maybe<RegionFilter>;
}
/** A condition to be used against `City` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface CityCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `region` field. */
  region?: Maybe<string>;
  /** Checks for equality with the object’s `country` field. */
  country?: Maybe<string>;
}
/** A filter to be used against `City` object types. All fields are combined with a logical ‘and.’ */
export interface CityFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `region` field. */
  region?: Maybe<StringFilter>;
  /** Filter by the object’s `country` field. */
  country?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<CityFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<CityFilter[]>;
  /** Negates the expression. */
  not?: Maybe<CityFilter>;
}
/** A condition to be used against `Event` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface EventCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<string>;
  /** Checks for equality with the object’s `venue` field. */
  venue?: Maybe<string>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<number>;
  /** Checks for equality with the object’s `region` field. */
  region?: Maybe<string>;
  /** Checks for equality with the object’s `country` field. */
  country?: Maybe<string>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<string>;
  /** Checks for equality with the object’s `startDate` field. */
  startDate?: Maybe<BigInt>;
  /** Checks for equality with the object’s `contributor` field. */
  contributor?: Maybe<number>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: Maybe<Datetime>;
}
/** A filter to be used against `Event` object types. All fields are combined with a logical ‘and.’ */
export interface EventFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<StringFilter>;
  /** Filter by the object’s `venue` field. */
  venue?: Maybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<IntFilter>;
  /** Filter by the object’s `region` field. */
  region?: Maybe<StringFilter>;
  /** Filter by the object’s `country` field. */
  country?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `startDate` field. */
  startDate?: Maybe<BigIntFilter>;
  /** Filter by the object’s `contributor` field. */
  contributor?: Maybe<IntFilter>;
  /** Filter by the object’s `createdAt` field. */
  createdAt?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<EventFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<EventFilter[]>;
  /** Negates the expression. */
  not?: Maybe<EventFilter>;
}
/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export interface BigIntFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<BigInt>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<BigInt>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<BigInt>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<BigInt>;
  /** Included in the specified list. */
  in?: Maybe<BigInt[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<BigInt[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<BigInt>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<BigInt>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<BigInt>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<BigInt>;
}
/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export interface DatetimeFilter {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<boolean>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Datetime>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Datetime>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Datetime>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Datetime>;
  /** Included in the specified list. */
  in?: Maybe<Datetime[]>;
  /** Not included in the specified list. */
  notIn?: Maybe<Datetime[]>;
  /** Less than the specified value. */
  lessThan?: Maybe<Datetime>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Datetime>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Datetime>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Datetime>;
}
/** A condition to be used against `WatchedToAccount` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface WatchedToAccountCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<number>;
  /** Checks for equality with the object’s `region` field. */
  region?: Maybe<string>;
  /** Checks for equality with the object’s `cityId` field. */
  cityId?: Maybe<number>;
}
/** A filter to be used against `WatchedToAccount` object types. All fields are combined with a logical ‘and.’ */
export interface WatchedToAccountFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `region` field. */
  region?: Maybe<StringFilter>;
  /** Filter by the object’s `cityId` field. */
  cityId?: Maybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<WatchedToAccountFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<WatchedToAccountFilter[]>;
  /** Negates the expression. */
  not?: Maybe<WatchedToAccountFilter>;
}
/** A condition to be used against `UserEmail` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface UserEmailCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<number>;
}
/** A filter to be used against `UserEmail` object types. All fields are combined with a logical ‘and.’ */
export interface UserEmailFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<UserEmailFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<UserEmailFilter[]>;
  /** Negates the expression. */
  not?: Maybe<UserEmailFilter>;
}
/** A condition to be used against `PushSubscription` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface PushSubscriptionCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<number>;
}
/** A filter to be used against `PushSubscription` object types. All fields are combined with a logical ‘and.’ */
export interface PushSubscriptionFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<PushSubscriptionFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<PushSubscriptionFilter[]>;
  /** Negates the expression. */
  not?: Maybe<PushSubscriptionFilter>;
}
/** A condition to be used against `WatchList` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface WatchListCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<number>;
  /** Checks for equality with the object’s `eventId` field. */
  eventId?: Maybe<string>;
}
/** A filter to be used against `WatchList` object types. All fields are combined with a logical ‘and.’ */
export interface WatchListFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `eventId` field. */
  eventId?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<WatchListFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<WatchListFilter[]>;
  /** Negates the expression. */
  not?: Maybe<WatchListFilter>;
}
/** A condition to be used against `FollowList` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface FollowListCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<number>;
  /** Checks for equality with the object’s `artistId` field. */
  artistId?: Maybe<string>;
  /** Checks for equality with the object’s `venueId` field. */
  venueId?: Maybe<string>;
}
/** A filter to be used against `FollowList` object types. All fields are combined with a logical ‘and.’ */
export interface FollowListFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `artistId` field. */
  artistId?: Maybe<StringFilter>;
  /** Filter by the object’s `venueId` field. */
  venueId?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<FollowListFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<FollowListFilter[]>;
  /** Negates the expression. */
  not?: Maybe<FollowListFilter>;
}
/** A condition to be used against `Venue` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface VenueCondition {
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<string>;
  /** Checks for equality with the object’s `city` field. */
  city?: Maybe<number>;
}
/** A filter to be used against `Venue` object types. All fields are combined with a logical ‘and.’ */
export interface VenueFilter {
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `city` field. */
  city?: Maybe<IntFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<VenueFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<VenueFilter[]>;
  /** Negates the expression. */
  not?: Maybe<VenueFilter>;
}
/** A condition to be used against `Country` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface CountryCondition {
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<string>;
}
/** A filter to be used against `Country` object types. All fields are combined with a logical ‘and.’ */
export interface CountryFilter {
  /** Filter by the object’s `code` field. */
  code?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<CountryFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<CountryFilter[]>;
  /** Negates the expression. */
  not?: Maybe<CountryFilter>;
}
/** A condition to be used against `Genre` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface GenreCondition {
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<string>;
}
/** A filter to be used against `Genre` object types. All fields are combined with a logical ‘and.’ */
export interface GenreFilter {
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<GenreFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<GenreFilter[]>;
  /** Negates the expression. */
  not?: Maybe<GenreFilter>;
}
/** A condition to be used against `UserAuthentication` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface UserAuthenticationCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `service` field. */
  service?: Maybe<string>;
}
/** A filter to be used against `UserAuthentication` object types. All fields are combined with a logical ‘and.’ */
export interface UserAuthenticationFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `service` field. */
  service?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<UserAuthenticationFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<UserAuthenticationFilter[]>;
  /** Negates the expression. */
  not?: Maybe<UserAuthenticationFilter>;
}
/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface UserCondition {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<number>;
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<string>;
}
/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export interface UserFilter {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `username` field. */
  username?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<UserFilter[]>;
  /** Checks for any expressions in this list. */
  or?: Maybe<UserFilter[]>;
  /** Negates the expression. */
  not?: Maybe<UserFilter>;
}
/** All input for the create `Artist` mutation. */
export interface CreateArtistInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Artist` to be created by this mutation. */
  artist: ArtistInput;
}
/** An input for mutations affecting `Artist` */
export interface ArtistInput {
  /** Primary key and name of artist. */
  name: string;
  /** Description of the artist. */
  description?: Maybe<string>;
  /** Photo of the artist. */
  photo?: Maybe<string>;
  /** Twitter username of the artist. */
  twitterUsername?: Maybe<string>;
  /** Twitter url of the artist. */
  twitterUrl?: Maybe<string>;
  /** Facebook username of the artist. */
  facebookUsername?: Maybe<string>;
  /** Facebook url of the artist. */
  facebookUrl?: Maybe<string>;
  /** Instagram username of the artist. */
  instagramUsername?: Maybe<string>;
  /** Instagram url of the artist. */
  instagramUrl?: Maybe<string>;
  /** Soundcloud username of the artist. */
  soundcloudUsername?: Maybe<string>;
  /** Soundcloud url of the artist. */
  soundcloudUrl?: Maybe<string>;
  /** Youtube username of the artist. */
  youtubeUsername?: Maybe<string>;
  /** Youtube url of the artist. */
  youtubeUrl?: Maybe<string>;
  /** Spotify url of the artist. */
  spotifyUrl?: Maybe<string>;
  /** Homepage url of the artist. */
  homepage?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `ArtistToEvent` mutation. */
export interface CreateArtistToEventInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `ArtistToEvent` to be created by this mutation. */
  artistToEvent: ArtistToEventInput;
}
/** An input for mutations affecting `ArtistToEvent` */
export interface ArtistToEventInput {
  /** Primary key and id of row. */
  id?: Maybe<number>;
  /** Ref to artist. */
  artistId: string;
  /** Ref to event. */
  eventId: string;
}
/** All input for the create `City` mutation. */
export interface CreateCityInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `City` to be created by this mutation. */
  city: CityInput;
}
/** An input for mutations affecting `City` */
export interface CityInput {
  /** Primary key and id for city. */
  id?: Maybe<number>;
  /** Name for city. */
  name?: Maybe<string>;
  /** Description of the genre. */
  description?: Maybe<string>;
  /** Photo for city. */
  photo?: Maybe<string>;
  /** Region ref for city. */
  region?: Maybe<string>;
  /** Region ref for country. */
  country?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `Country` mutation. */
export interface CreateCountryInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Country` to be created by this mutation. */
  country: CountryInput;
}
/** An input for mutations affecting `Country` */
export interface CountryInput {
  /** Primary key and code for country. */
  code: string;
  /** Name for country. */
  name?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `Event` mutation. */
export interface CreateEventInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Event` to be created by this mutation. */
  event: EventInput;
}
/** An input for mutations affecting `Event` */
export interface EventInput {
  /** Primary key and id of event. */
  id: string;
  /** Ref to venue where event takes place. */
  venue: string;
  /** Ref to city where event takes place. */
  city: number;
  /** Ref to region where event takes place. */
  region?: Maybe<string>;
  /** Ref to country where event takes place. */
  country?: Maybe<string>;
  /** Name of event. */
  name?: Maybe<string>;
  /** Description of event. */
  description?: Maybe<string>;
  /** Type of event. */
  type?: Maybe<EventType>;
  /** Start date of event. */
  startDate: BigInt;
  /** End date of event. */
  endDate?: Maybe<BigInt>;
  /** Id by the ticket provider useful for affiliate links. */
  ticketproviderid?: Maybe<string>;
  /** URL by the ticket provider useful for affiliate links. */
  ticketproviderurl?: Maybe<string>;
  /** Banner of event page. */
  banner?: Maybe<string>;
  /** Whether to display event if it has been approved. */
  approved?: Maybe<boolean>;
  /** Who submitted the event. */
  contributor?: Maybe<number>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `FollowList` mutation. */
export interface CreateFollowListInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `FollowList` to be created by this mutation. */
  followList: FollowListInput;
}
/** An input for mutations affecting `FollowList` */
export interface FollowListInput {
  /** Primary key and id of row. */
  id?: Maybe<number>;
  /** Ref to user. */
  userId: number;
  /** Ref to artist. */
  artistId?: Maybe<string>;
  /** Ref to venue. */
  venueId?: Maybe<string>;
}
/** All input for the create `Genre` mutation. */
export interface CreateGenreInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Genre` to be created by this mutation. */
  genre: GenreInput;
}
/** An input for mutations affecting `Genre` */
export interface GenreInput {
  /** Primary key and name of genre. */
  name: string;

  description?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `GenreToArtist` mutation. */
export interface CreateGenreToArtistInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `GenreToArtist` to be created by this mutation. */
  genreToArtist: GenreToArtistInput;
}
/** An input for mutations affecting `GenreToArtist` */
export interface GenreToArtistInput {
  /** Id of the row. */
  id?: Maybe<number>;
  /** Ref to the genre. */
  genreId: string;
  /** Ref to the artist. */
  artistId: string;
}
/** All input for the create `PushSubscription` mutation. */
export interface CreatePushSubscriptionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `PushSubscription` to be created by this mutation. */
  pushSubscription: PushSubscriptionInput;
}
/** An input for mutations affecting `PushSubscription` */
export interface PushSubscriptionInput {
  /** Unique identifier for the push subscription. */
  id?: Maybe<number>;
  /** Reference to the account this belongs to. */
  userId: number;
  /** This contains a unique URL to a Firebase Cloud Messaging endpoint. This url is a public but unguessable endpoint to the Browser Push Service used by the application server to send push notifications to this subscription. */
  endpoint: string;
  /** This is useful in certain cases, for example, if a message might contain an authentication code that expires after 1 minute. */
  expirationTime?: Maybe<Datetime>;
  /** An encryption key that our server will use to encrypt the message. */
  p256Dh: string;
  /** An authentication secret, which is one of the inputs of the message content encryption process. */
  auth: string;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `Region` mutation. */
export interface CreateRegionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Region` to be created by this mutation. */
  region: RegionInput;
}
/** An input for mutations affecting `Region` */
export interface RegionInput {
  /** Name and primary key of region. */
  name: string;
  /** Description of the region. */
  description?: Maybe<string>;
  /** Photo of the region. */
  photo?: Maybe<string>;
  /** Country ref region belongs to. */
  country?: Maybe<string>;
  /** Latitude location of the region. */
  lat?: Maybe<BigFloat>;
  /** Longitude location of the region. */
  lon?: Maybe<BigFloat>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `UserAuthentication` mutation. */
export interface CreateUserAuthenticationInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `UserAuthentication` to be created by this mutation. */
  userAuthentication: UserAuthenticationInput;
}
/** An input for mutations affecting `UserAuthentication` */
export interface UserAuthenticationInput {
  id?: Maybe<number>;
  /** The login service used, e.g. `twitter` or `github`. */
  service: string;
  /** A unique identifier for the user within the login service. */
  identifier: string;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `UserEmail` mutation. */
export interface CreateUserEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `UserEmail` to be created by this mutation. */
  userEmail: UserEmailInput;
}
/** An input for mutations affecting `UserEmail` */
export interface UserEmailInput {
  id?: Maybe<number>;

  userId?: Maybe<number>;
  /** The users email address, in `a@b.c` format. */
  email: string;
  /** True if the user has is_verified their email address (by clicking the link in the email we sent them, or logging in with a social login provider), false otherwise. */
  isVerified?: Maybe<boolean>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `User` mutation. */
export interface CreateUserInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
}
/** An input for mutations affecting `User` */
export interface UserInput {
  /** Unique identifier for the user. */
  id?: Maybe<number>;
  /** Public-facing username (or 'handle') of the user. */
  username: string;
  /** Public-facing name (or pseudonym) of the user. */
  name?: Maybe<string>;
  /** Optional profile photo. */
  profilePhoto?: Maybe<string>;
  /** If true, the user has elevated privileges. */
  isAdmin?: Maybe<boolean>;
  /** Designates notification frequency */
  notificationFrequency?: Maybe<Frequency>;
  /** Boolean yes or no for push notifications */
  pushNotification?: Maybe<boolean>;
  /** Boolean yes or no for email notifications */
  emailNotification?: Maybe<boolean>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `Venue` mutation. */
export interface CreateVenueInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `Venue` to be created by this mutation. */
  venue: VenueInput;
}
/** An input for mutations affecting `Venue` */
export interface VenueInput {
  /** Primary key and name of venue. */
  name: string;
  /** Description of venue. */
  description?: Maybe<string>;
  /** Latitude of venue. */
  lat?: Maybe<BigFloat>;
  /** Longitude of venue. */
  lon?: Maybe<BigFloat>;
  /** Ref to city of venue. */
  city: number;
  /** Address of venue. */
  address?: Maybe<string>;
  /** Photo of venue. */
  photo?: Maybe<string>;
  /** Logo of venue. */
  logo?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the create `WatchList` mutation. */
export interface CreateWatchListInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `WatchList` to be created by this mutation. */
  watchList: WatchListInput;
}
/** An input for mutations affecting `WatchList` */
export interface WatchListInput {
  /** Primary key and id of row. */
  id?: Maybe<number>;
  /** Ref to user. */
  userId: number;
  /** Ref to event. */
  eventId: string;
}
/** All input for the create `WatchedToAccount` mutation. */
export interface CreateWatchedToAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The `WatchedToAccount` to be created by this mutation. */
  watchedToAccount: WatchedToAccountInput;
}
/** An input for mutations affecting `WatchedToAccount` */
export interface WatchedToAccountInput {
  /** Id of the row. */
  id?: Maybe<number>;
  /** Ref to user account. */
  userId: number;
  /** Ref to region. */
  region?: Maybe<string>;
  /** Ref to city. */
  cityId?: Maybe<number>;
}
/** All input for the `updateArtistByNodeId` mutation. */
export interface UpdateArtistByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Artist` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Artist` being updated. */
  patch: ArtistPatch;
}
/** Represents an update to a `Artist`. Fields that are set will be updated. */
export interface ArtistPatch {
  /** Primary key and name of artist. */
  name?: Maybe<string>;
  /** Description of the artist. */
  description?: Maybe<string>;
  /** Photo of the artist. */
  photo?: Maybe<string>;
  /** Twitter username of the artist. */
  twitterUsername?: Maybe<string>;
  /** Twitter url of the artist. */
  twitterUrl?: Maybe<string>;
  /** Facebook username of the artist. */
  facebookUsername?: Maybe<string>;
  /** Facebook url of the artist. */
  facebookUrl?: Maybe<string>;
  /** Instagram username of the artist. */
  instagramUsername?: Maybe<string>;
  /** Instagram url of the artist. */
  instagramUrl?: Maybe<string>;
  /** Soundcloud username of the artist. */
  soundcloudUsername?: Maybe<string>;
  /** Soundcloud url of the artist. */
  soundcloudUrl?: Maybe<string>;
  /** Youtube username of the artist. */
  youtubeUsername?: Maybe<string>;
  /** Youtube url of the artist. */
  youtubeUrl?: Maybe<string>;
  /** Spotify url of the artist. */
  spotifyUrl?: Maybe<string>;
  /** Homepage url of the artist. */
  homepage?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateArtist` mutation. */
export interface UpdateArtistInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Artist` being updated. */
  patch: ArtistPatch;
  /** Primary key and name of artist. */
  name: string;
}
/** All input for the `updateArtistToEventByNodeId` mutation. */
export interface UpdateArtistToEventByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `ArtistToEvent` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `ArtistToEvent` being updated. */
  patch: ArtistToEventPatch;
}
/** Represents an update to a `ArtistToEvent`. Fields that are set will be updated. */
export interface ArtistToEventPatch {
  /** Primary key and id of row. */
  id?: Maybe<number>;
  /** Ref to artist. */
  artistId?: Maybe<string>;
  /** Ref to event. */
  eventId?: Maybe<string>;
}
/** All input for the `updateArtistToEvent` mutation. */
export interface UpdateArtistToEventInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `ArtistToEvent` being updated. */
  patch: ArtistToEventPatch;
  /** Primary key and id of row. */
  id: number;
}
/** All input for the `updateCityByNodeId` mutation. */
export interface UpdateCityByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `City` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `City` being updated. */
  patch: CityPatch;
}
/** Represents an update to a `City`. Fields that are set will be updated. */
export interface CityPatch {
  /** Primary key and id for city. */
  id?: Maybe<number>;
  /** Name for city. */
  name?: Maybe<string>;
  /** Description of the genre. */
  description?: Maybe<string>;
  /** Photo for city. */
  photo?: Maybe<string>;
  /** Region ref for city. */
  region?: Maybe<string>;
  /** Region ref for country. */
  country?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateCity` mutation. */
export interface UpdateCityInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `City` being updated. */
  patch: CityPatch;
  /** Primary key and id for city. */
  id: number;
}
/** All input for the `updateCountryByNodeId` mutation. */
export interface UpdateCountryByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Country` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Country` being updated. */
  patch: CountryPatch;
}
/** Represents an update to a `Country`. Fields that are set will be updated. */
export interface CountryPatch {
  /** Primary key and code for country. */
  code?: Maybe<string>;
  /** Name for country. */
  name?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateCountry` mutation. */
export interface UpdateCountryInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Country` being updated. */
  patch: CountryPatch;
  /** Primary key and code for country. */
  code: string;
}
/** All input for the `updateEventByNodeId` mutation. */
export interface UpdateEventByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Event` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Event` being updated. */
  patch: EventPatch;
}
/** Represents an update to a `Event`. Fields that are set will be updated. */
export interface EventPatch {
  /** Primary key and id of event. */
  id?: Maybe<string>;
  /** Ref to venue where event takes place. */
  venue?: Maybe<string>;
  /** Ref to city where event takes place. */
  city?: Maybe<number>;
  /** Ref to region where event takes place. */
  region?: Maybe<string>;
  /** Ref to country where event takes place. */
  country?: Maybe<string>;
  /** Name of event. */
  name?: Maybe<string>;
  /** Description of event. */
  description?: Maybe<string>;
  /** Type of event. */
  type?: Maybe<EventType>;
  /** Start date of event. */
  startDate?: Maybe<BigInt>;
  /** End date of event. */
  endDate?: Maybe<BigInt>;
  /** Id by the ticket provider useful for affiliate links. */
  ticketproviderid?: Maybe<string>;
  /** URL by the ticket provider useful for affiliate links. */
  ticketproviderurl?: Maybe<string>;
  /** Banner of event page. */
  banner?: Maybe<string>;
  /** Whether to display event if it has been approved. */
  approved?: Maybe<boolean>;
  /** Who submitted the event. */
  contributor?: Maybe<number>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateEvent` mutation. */
export interface UpdateEventInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Event` being updated. */
  patch: EventPatch;
  /** Primary key and id of event. */
  id: string;
}
/** All input for the `updateFollowListByNodeId` mutation. */
export interface UpdateFollowListByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `FollowList` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `FollowList` being updated. */
  patch: FollowListPatch;
}
/** Represents an update to a `FollowList`. Fields that are set will be updated. */
export interface FollowListPatch {
  /** Primary key and id of row. */
  id?: Maybe<number>;
  /** Ref to user. */
  userId?: Maybe<number>;
  /** Ref to artist. */
  artistId?: Maybe<string>;
  /** Ref to venue. */
  venueId?: Maybe<string>;
}
/** All input for the `updateFollowList` mutation. */
export interface UpdateFollowListInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `FollowList` being updated. */
  patch: FollowListPatch;
  /** Primary key and id of row. */
  id: number;
}
/** All input for the `updateGenreByNodeId` mutation. */
export interface UpdateGenreByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Genre` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Genre` being updated. */
  patch: GenrePatch;
}
/** Represents an update to a `Genre`. Fields that are set will be updated. */
export interface GenrePatch {
  /** Primary key and name of genre. */
  name?: Maybe<string>;

  description?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateGenre` mutation. */
export interface UpdateGenreInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Genre` being updated. */
  patch: GenrePatch;
  /** Primary key and name of genre. */
  name: string;
}
/** All input for the `updateGenreToArtistByNodeId` mutation. */
export interface UpdateGenreToArtistByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `GenreToArtist` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `GenreToArtist` being updated. */
  patch: GenreToArtistPatch;
}
/** Represents an update to a `GenreToArtist`. Fields that are set will be updated. */
export interface GenreToArtistPatch {
  /** Id of the row. */
  id?: Maybe<number>;
  /** Ref to the genre. */
  genreId?: Maybe<string>;
  /** Ref to the artist. */
  artistId?: Maybe<string>;
}
/** All input for the `updateGenreToArtist` mutation. */
export interface UpdateGenreToArtistInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `GenreToArtist` being updated. */
  patch: GenreToArtistPatch;
  /** Id of the row. */
  id: number;
}
/** All input for the `updatePushSubscriptionByNodeId` mutation. */
export interface UpdatePushSubscriptionByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `PushSubscription` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `PushSubscription` being updated. */
  patch: PushSubscriptionPatch;
}
/** Represents an update to a `PushSubscription`. Fields that are set will be updated. */
export interface PushSubscriptionPatch {
  /** Unique identifier for the push subscription. */
  id?: Maybe<number>;
  /** Reference to the account this belongs to. */
  userId?: Maybe<number>;
  /** This contains a unique URL to a Firebase Cloud Messaging endpoint. This url is a public but unguessable endpoint to the Browser Push Service used by the application server to send push notifications to this subscription. */
  endpoint?: Maybe<string>;
  /** This is useful in certain cases, for example, if a message might contain an authentication code that expires after 1 minute. */
  expirationTime?: Maybe<Datetime>;
  /** An encryption key that our server will use to encrypt the message. */
  p256Dh?: Maybe<string>;
  /** An authentication secret, which is one of the inputs of the message content encryption process. */
  auth?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updatePushSubscription` mutation. */
export interface UpdatePushSubscriptionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `PushSubscription` being updated. */
  patch: PushSubscriptionPatch;
  /** Unique identifier for the push subscription. */
  id: number;
}
/** All input for the `updateRegionByNodeId` mutation. */
export interface UpdateRegionByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Region` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Region` being updated. */
  patch: RegionPatch;
}
/** Represents an update to a `Region`. Fields that are set will be updated. */
export interface RegionPatch {
  /** Name and primary key of region. */
  name?: Maybe<string>;
  /** Description of the region. */
  description?: Maybe<string>;
  /** Photo of the region. */
  photo?: Maybe<string>;
  /** Country ref region belongs to. */
  country?: Maybe<string>;
  /** Latitude location of the region. */
  lat?: Maybe<BigFloat>;
  /** Longitude location of the region. */
  lon?: Maybe<BigFloat>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateRegion` mutation. */
export interface UpdateRegionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Region` being updated. */
  patch: RegionPatch;
  /** Name and primary key of region. */
  name: string;
}
/** All input for the `updateUserAuthenticationByNodeId` mutation. */
export interface UpdateUserAuthenticationByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserAuthentication` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `UserAuthentication` being updated. */
  patch: UserAuthenticationPatch;
}
/** Represents an update to a `UserAuthentication`. Fields that are set will be updated. */
export interface UserAuthenticationPatch {
  id?: Maybe<number>;
  /** The login service used, e.g. `twitter` or `github`. */
  service?: Maybe<string>;
  /** A unique identifier for the user within the login service. */
  identifier?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateUserAuthentication` mutation. */
export interface UpdateUserAuthenticationInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserAuthentication` being updated. */
  patch: UserAuthenticationPatch;

  id: number;
}
/** All input for the `updateUserAuthenticationByServiceAndIdentifier` mutation. */
export interface UpdateUserAuthenticationByServiceAndIdentifierInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserAuthentication` being updated. */
  patch: UserAuthenticationPatch;
  /** The login service used, e.g. `twitter` or `github`. */
  service: string;
  /** A unique identifier for the user within the login service. */
  identifier: string;
}
/** All input for the `updateUserEmailByNodeId` mutation. */
export interface UpdateUserEmailByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserEmail` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `UserEmail` being updated. */
  patch: UserEmailPatch;
}
/** Represents an update to a `UserEmail`. Fields that are set will be updated. */
export interface UserEmailPatch {
  id?: Maybe<number>;

  userId?: Maybe<number>;
  /** The users email address, in `a@b.c` format. */
  email?: Maybe<string>;
  /** True if the user has is_verified their email address (by clicking the link in the email we sent them, or logging in with a social login provider), false otherwise. */
  isVerified?: Maybe<boolean>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateUserEmail` mutation. */
export interface UpdateUserEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserEmail` being updated. */
  patch: UserEmailPatch;

  id: number;
}
/** All input for the `updateUserEmailByUserIdAndEmail` mutation. */
export interface UpdateUserEmailByUserIdAndEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `UserEmail` being updated. */
  patch: UserEmailPatch;

  userId: number;
  /** The users email address, in `a@b.c` format. */
  email: string;
}
/** All input for the `updateUserByNodeId` mutation. */
export interface UpdateUserByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
}
/** Represents an update to a `User`. Fields that are set will be updated. */
export interface UserPatch {
  /** Unique identifier for the user. */
  id?: Maybe<number>;
  /** Public-facing username (or 'handle') of the user. */
  username?: Maybe<string>;
  /** Public-facing name (or pseudonym) of the user. */
  name?: Maybe<string>;
  /** Optional profile photo. */
  profilePhoto?: Maybe<string>;
  /** If true, the user has elevated privileges. */
  isAdmin?: Maybe<boolean>;
  /** Designates notification frequency */
  notificationFrequency?: Maybe<Frequency>;
  /** Boolean yes or no for push notifications */
  pushNotification?: Maybe<boolean>;
  /** Boolean yes or no for email notifications */
  emailNotification?: Maybe<boolean>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateUser` mutation. */
export interface UpdateUserInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
  /** Unique identifier for the user. */
  id: number;
}
/** All input for the `updateUserByUsername` mutation. */
export interface UpdateUserByUsernameInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
  /** Public-facing username (or 'handle') of the user. */
  username: string;
}
/** All input for the `updateVenueByNodeId` mutation. */
export interface UpdateVenueByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Venue` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `Venue` being updated. */
  patch: VenuePatch;
}
/** Represents an update to a `Venue`. Fields that are set will be updated. */
export interface VenuePatch {
  /** Primary key and name of venue. */
  name?: Maybe<string>;
  /** Description of venue. */
  description?: Maybe<string>;
  /** Latitude of venue. */
  lat?: Maybe<BigFloat>;
  /** Longitude of venue. */
  lon?: Maybe<BigFloat>;
  /** Ref to city of venue. */
  city?: Maybe<number>;
  /** Address of venue. */
  address?: Maybe<string>;
  /** Photo of venue. */
  photo?: Maybe<string>;
  /** Logo of venue. */
  logo?: Maybe<string>;

  createdAt?: Maybe<Datetime>;

  updatedAt?: Maybe<Datetime>;
}
/** All input for the `updateVenue` mutation. */
export interface UpdateVenueInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `Venue` being updated. */
  patch: VenuePatch;
  /** Primary key and name of venue. */
  name: string;
}
/** All input for the `updateWatchListByNodeId` mutation. */
export interface UpdateWatchListByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `WatchList` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `WatchList` being updated. */
  patch: WatchListPatch;
}
/** Represents an update to a `WatchList`. Fields that are set will be updated. */
export interface WatchListPatch {
  /** Primary key and id of row. */
  id?: Maybe<number>;
  /** Ref to user. */
  userId?: Maybe<number>;
  /** Ref to event. */
  eventId?: Maybe<string>;
}
/** All input for the `updateWatchList` mutation. */
export interface UpdateWatchListInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `WatchList` being updated. */
  patch: WatchListPatch;
  /** Primary key and id of row. */
  id: number;
}
/** All input for the `updateWatchedToAccountByNodeId` mutation. */
export interface UpdateWatchedToAccountByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `WatchedToAccount` to be updated. */
  nodeId: string;
  /** An object where the defined keys will be set on the `WatchedToAccount` being updated. */
  patch: WatchedToAccountPatch;
}
/** Represents an update to a `WatchedToAccount`. Fields that are set will be updated. */
export interface WatchedToAccountPatch {
  /** Id of the row. */
  id?: Maybe<number>;
  /** Ref to user account. */
  userId?: Maybe<number>;
  /** Ref to region. */
  region?: Maybe<string>;
  /** Ref to city. */
  cityId?: Maybe<number>;
}
/** All input for the `updateWatchedToAccount` mutation. */
export interface UpdateWatchedToAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** An object where the defined keys will be set on the `WatchedToAccount` being updated. */
  patch: WatchedToAccountPatch;
  /** Id of the row. */
  id: number;
}
/** All input for the `deleteArtistByNodeId` mutation. */
export interface DeleteArtistByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Artist` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteArtist` mutation. */
export interface DeleteArtistInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and name of artist. */
  name: string;
}
/** All input for the `deleteArtistToEventByNodeId` mutation. */
export interface DeleteArtistToEventByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `ArtistToEvent` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteArtistToEvent` mutation. */
export interface DeleteArtistToEventInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and id of row. */
  id: number;
}
/** All input for the `deleteCityByNodeId` mutation. */
export interface DeleteCityByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `City` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteCity` mutation. */
export interface DeleteCityInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and id for city. */
  id: number;
}
/** All input for the `deleteCountryByNodeId` mutation. */
export interface DeleteCountryByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Country` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteCountry` mutation. */
export interface DeleteCountryInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and code for country. */
  code: string;
}
/** All input for the `deleteEventByNodeId` mutation. */
export interface DeleteEventByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Event` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteEvent` mutation. */
export interface DeleteEventInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and id of event. */
  id: string;
}
/** All input for the `deleteFollowListByNodeId` mutation. */
export interface DeleteFollowListByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `FollowList` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteFollowList` mutation. */
export interface DeleteFollowListInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and id of row. */
  id: number;
}
/** All input for the `deleteGenreByNodeId` mutation. */
export interface DeleteGenreByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Genre` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteGenre` mutation. */
export interface DeleteGenreInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and name of genre. */
  name: string;
}
/** All input for the `deleteGenreToArtistByNodeId` mutation. */
export interface DeleteGenreToArtistByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `GenreToArtist` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteGenreToArtist` mutation. */
export interface DeleteGenreToArtistInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Id of the row. */
  id: number;
}
/** All input for the `deletePushSubscriptionByNodeId` mutation. */
export interface DeletePushSubscriptionByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `PushSubscription` to be deleted. */
  nodeId: string;
}
/** All input for the `deletePushSubscription` mutation. */
export interface DeletePushSubscriptionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Unique identifier for the push subscription. */
  id: number;
}
/** All input for the `deleteRegionByNodeId` mutation. */
export interface DeleteRegionByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Region` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteRegion` mutation. */
export interface DeleteRegionInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Name and primary key of region. */
  name: string;
}
/** All input for the `deleteUserAuthenticationByNodeId` mutation. */
export interface DeleteUserAuthenticationByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserAuthentication` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteUserAuthentication` mutation. */
export interface DeleteUserAuthenticationInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  id: number;
}
/** All input for the `deleteUserAuthenticationByServiceAndIdentifier` mutation. */
export interface DeleteUserAuthenticationByServiceAndIdentifierInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The login service used, e.g. `twitter` or `github`. */
  service: string;
  /** A unique identifier for the user within the login service. */
  identifier: string;
}
/** All input for the `deleteUserEmailByNodeId` mutation. */
export interface DeleteUserEmailByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `UserEmail` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteUserEmail` mutation. */
export interface DeleteUserEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  id: number;
}
/** All input for the `deleteUserEmailByUserIdAndEmail` mutation. */
export interface DeleteUserEmailByUserIdAndEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  userId: number;
  /** The users email address, in `a@b.c` format. */
  email: string;
}
/** All input for the `deleteUserByNodeId` mutation. */
export interface DeleteUserByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteUser` mutation. */
export interface DeleteUserInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Unique identifier for the user. */
  id: number;
}
/** All input for the `deleteUserByUsername` mutation. */
export interface DeleteUserByUsernameInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Public-facing username (or 'handle') of the user. */
  username: string;
}
/** All input for the `deleteVenueByNodeId` mutation. */
export interface DeleteVenueByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `Venue` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteVenue` mutation. */
export interface DeleteVenueInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and name of venue. */
  name: string;
}
/** All input for the `deleteWatchListByNodeId` mutation. */
export interface DeleteWatchListByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `WatchList` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteWatchList` mutation. */
export interface DeleteWatchListInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Primary key and id of row. */
  id: number;
}
/** All input for the `deleteWatchedToAccountByNodeId` mutation. */
export interface DeleteWatchedToAccountByNodeIdInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** The globally unique `ID` which will identify a single `WatchedToAccount` to be deleted. */
  nodeId: string;
}
/** All input for the `deleteWatchedToAccount` mutation. */
export interface DeleteWatchedToAccountInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;
  /** Id of the row. */
  id: number;
}
/** All input for the `forgotPassword` mutation. */
export interface ForgotPasswordInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  email: string;
}
/** All input for the `resetPassword` mutation. */
export interface ResetPasswordInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  userId: number;

  token: string;

  newPassword: string;
}
/** All input for the `verifyUserEmail` mutation. */
export interface VerifyUserEmailInput {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<string>;

  token: string;
}

export interface RegisterInput {
  username: string;

  email: string;

  password: string;

  name?: Maybe<string>;

  profile_photo?: Maybe<string>;
}

export interface LoginInput {
  username: string;

  password: string;
}
/** Methods to use when ordering `Artist`. */
export enum ArtistsOrderBy {
  Natural = "NATURAL",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `GenreToArtist`. */
export enum GenreToArtistsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  GenreIdAsc = "GENRE_ID_ASC",
  GenreIdDesc = "GENRE_ID_DESC",
  ArtistIdAsc = "ARTIST_ID_ASC",
  ArtistIdDesc = "ARTIST_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `ArtistToEvent`. */
export enum ArtistToEventsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  ArtistIdAsc = "ARTIST_ID_ASC",
  ArtistIdDesc = "ARTIST_ID_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum EventType {
  Eventbrite = "EVENTBRITE",
  Ticketfly = "TICKETFLY",
  Ticketmaster = "TICKETMASTER",
  Seetickets = "SEETICKETS",
  Etix = "ETIX",
  Other = "OTHER"
}
/** Methods to use when ordering `Region`. */
export enum RegionsOrderBy {
  Natural = "NATURAL",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  CountryAsc = "COUNTRY_ASC",
  CountryDesc = "COUNTRY_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `City`. */
export enum CitiesOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  RegionAsc = "REGION_ASC",
  RegionDesc = "REGION_DESC",
  CountryAsc = "COUNTRY_ASC",
  CountryDesc = "COUNTRY_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `Event`. */
export enum EventsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  VenueAsc = "VENUE_ASC",
  VenueDesc = "VENUE_DESC",
  CityAsc = "CITY_ASC",
  CityDesc = "CITY_DESC",
  RegionAsc = "REGION_ASC",
  RegionDesc = "REGION_DESC",
  CountryAsc = "COUNTRY_ASC",
  CountryDesc = "COUNTRY_DESC",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  StartDateAsc = "START_DATE_ASC",
  StartDateDesc = "START_DATE_DESC",
  ContributorAsc = "CONTRIBUTOR_ASC",
  ContributorDesc = "CONTRIBUTOR_DESC",
  CreatedAtAsc = "CREATED_AT_ASC",
  CreatedAtDesc = "CREATED_AT_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `WatchedToAccount`. */
export enum WatchedToAccountsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
  RegionAsc = "REGION_ASC",
  RegionDesc = "REGION_DESC",
  CityIdAsc = "CITY_ID_ASC",
  CityIdDesc = "CITY_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

export enum Frequency {
  EveryDay = "EVERY_DAY",
  ThreeTimesAWeek = "THREE_TIMES_A_WEEK",
  TwoTimesAWeek = "TWO_TIMES_A_WEEK",
  OnceAWeek = "ONCE_A_WEEK",
  OnceEveryTwoWeeks = "ONCE_EVERY_TWO_WEEKS",
  Never = "NEVER"
}
/** Methods to use when ordering `UserEmail`. */
export enum UserEmailsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `PushSubscription`. */
export enum PushSubscriptionsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `WatchList`. */
export enum WatchListsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
  EventIdAsc = "EVENT_ID_ASC",
  EventIdDesc = "EVENT_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `FollowList`. */
export enum FollowListsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  UserIdAsc = "USER_ID_ASC",
  UserIdDesc = "USER_ID_DESC",
  ArtistIdAsc = "ARTIST_ID_ASC",
  ArtistIdDesc = "ARTIST_ID_DESC",
  VenueIdAsc = "VENUE_ID_ASC",
  VenueIdDesc = "VENUE_ID_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `Venue`. */
export enum VenuesOrderBy {
  Natural = "NATURAL",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  CityAsc = "CITY_ASC",
  CityDesc = "CITY_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `Country`. */
export enum CountriesOrderBy {
  Natural = "NATURAL",
  CodeAsc = "CODE_ASC",
  CodeDesc = "CODE_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `Genre`. */
export enum GenresOrderBy {
  Natural = "NATURAL",
  NameAsc = "NAME_ASC",
  NameDesc = "NAME_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `UserAuthentication`. */
export enum UserAuthenticationsOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  ServiceAsc = "SERVICE_ASC",
  ServiceDesc = "SERVICE_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}
/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  Natural = "NATURAL",
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC",
  UsernameAsc = "USERNAME_ASC",
  UsernameDesc = "USERNAME_DESC",
  PrimaryKeyAsc = "PRIMARY_KEY_ASC",
  PrimaryKeyDesc = "PRIMARY_KEY_DESC"
}

/** A location in a connection that can be used for resuming pagination. */
export type Cursor = any;

/** A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone. */
export type Datetime = any;

/** A signed eight-byte integer. The upper big integer values are greater than the max value for a JavaScript number. Therefore all big integers will be output as strings and not numbers. */
export type BigInt = any;

/** A floating point number that requires more precision than IEEE 754 binary 64 */
export type BigFloat = any;

// ====================================================
// Documents
// ====================================================

export namespace AllLocations {
  export type Variables = {
    currentDate: BigInt;
  };

  export type Query = {
    __typename?: "Query";

    regions: Maybe<Regions>;
  };

  export type Regions = {
    __typename?: "RegionsConnection";

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "Region";

    name: string;

    lat: Maybe<BigFloat>;

    lon: Maybe<BigFloat>;

    citiesByRegion: CitiesByRegion;
  };

  export type CitiesByRegion = {
    __typename?: "CitiesConnection";

    nodes: _Nodes[];
  };

  export type _Nodes = {
    __typename?: "City";

    id: number;

    name: Maybe<string>;

    venuesByCity: VenuesByCity;
  };

  export type VenuesByCity = {
    __typename?: "VenuesConnection";

    nodes: __Nodes[];
  };

  export type __Nodes = {
    __typename?: "Venue";

    eventsByVenue: EventsByVenue;
  };

  export type EventsByVenue = {
    __typename?: "EventsConnection";

    totalCount: number;
  };
}

export namespace ArtistByName {
  export type Variables = {
    name: string;
    userId: number;
  };

  export type Query = {
    __typename?: "Query";

    artist: Maybe<Artist>;
  };

  export type Artist = {
    __typename?: "Artist";

    name: string;

    description: Maybe<string>;

    photo: Maybe<string>;

    twitterUsername: Maybe<string>;

    twitterUrl: Maybe<string>;

    facebookUsername: Maybe<string>;

    facebookUrl: Maybe<string>;

    instagramUsername: Maybe<string>;

    instagramUrl: Maybe<string>;

    soundcloudUsername: Maybe<string>;

    soundcloudUrl: Maybe<string>;

    youtubeUsername: Maybe<string>;

    youtubeUrl: Maybe<string>;

    spotifyUrl: Maybe<string>;

    homepage: Maybe<string>;

    genreToArtists: GenreToArtists;

    followLists: FollowLists;

    artistToEvents: ArtistToEvents;
  };

  export type GenreToArtists = {
    __typename?: "GenreToArtistsConnection";

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "GenreToArtist";

    genreId: string;
  };

  export type FollowLists = {
    __typename?: "FollowListsConnection";

    nodes: _Nodes[];
  };

  export type _Nodes = {
    __typename?: "FollowList";

    id: number;
  };

  export type ArtistToEvents = {
    __typename?: "ArtistToEventsConnection";

    nodes: __Nodes[];
  };

  export type __Nodes = {
    __typename?: "ArtistToEvent";

    event: Maybe<Event>;
  };

  export type Event = {
    __typename?: "Event";

    name: Maybe<string>;

    venue: string;

    startDate: BigInt;

    id: string;

    ticketproviderurl: Maybe<string>;

    ticketproviderid: Maybe<string>;

    watchLists: WatchLists;
  };

  export type WatchLists = {
    __typename?: "WatchListsConnection";

    nodes: ___Nodes[];
  };

  export type ___Nodes = {
    __typename?: "WatchList";

    id: number;
  };
}

export namespace CreateFollowList {
  export type Variables = {
    userId: number;
    artistId?: Maybe<string>;
    venueId?: Maybe<string>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createFollowList: Maybe<CreateFollowList>;
  };

  export type CreateFollowList = {
    __typename?: "CreateFollowListPayload";

    followList: Maybe<FollowList>;
  };

  export type FollowList = {
    __typename?: "FollowList";

    id: number;
  };
}

export namespace CreatePushSubscription {
  export type Variables = {
    userId: number;
    endpoint: string;
    p256Dh: string;
    auth: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createPushSubscription: Maybe<CreatePushSubscription>;
  };

  export type CreatePushSubscription = {
    __typename?: "CreatePushSubscriptionPayload";

    clientMutationId: Maybe<string>;
  };
}

export namespace CreateWatchList {
  export type Variables = {
    userId: number;
    eventId: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createWatchList: Maybe<CreateWatchList>;
  };

  export type CreateWatchList = {
    __typename?: "CreateWatchListPayload";

    watchList: Maybe<WatchList>;
  };

  export type WatchList = {
    __typename?: "WatchList";

    id: number;
  };
}

export namespace CreateWatchedToAccount {
  export type Variables = {
    userId: number;
    region?: Maybe<string>;
    cityId?: Maybe<number>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    createWatchedToAccount: Maybe<CreateWatchedToAccount>;
  };

  export type CreateWatchedToAccount = {
    __typename?: "CreateWatchedToAccountPayload";

    watchedToAccount: Maybe<WatchedToAccount>;
  };

  export type WatchedToAccount = {
    __typename?: "WatchedToAccount";

    id: number;

    region: Maybe<string>;

    city: Maybe<City>;
  };

  export type City = {
    __typename?: "City";

    id: number;

    name: Maybe<string>;
  };
}

export namespace CurrentUser {
  export type Variables = {};

  export type Query = {
    __typename?: "Query";

    currentUser: Maybe<CurrentUser>;
  };

  export type CurrentUser = {
    __typename?: "User";

    username: string;

    notificationFrequency: Frequency;

    pushNotification: Maybe<boolean>;

    emailNotification: Maybe<boolean>;

    profilePhoto: Maybe<string>;

    id: number;

    watchLists: WatchLists;

    pushSubscriptions: PushSubscriptions;
  };

  export type WatchLists = {
    __typename?: "WatchListsConnection";

    totalCount: number;
  };

  export type PushSubscriptions = {
    __typename?: "PushSubscriptionsConnection";

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "PushSubscription";

    id: number;
  };
}

export namespace DeletePushSubscriptionById {
  export type Variables = {
    id: number;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deletePushSubscription: Maybe<DeletePushSubscription>;
  };

  export type DeletePushSubscription = {
    __typename?: "DeletePushSubscriptionPayload";

    clientMutationId: Maybe<string>;
  };
}

export namespace DeleteWatchedById {
  export type Variables = {
    id: number;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteWatchedToAccount: Maybe<DeleteWatchedToAccount>;
  };

  export type DeleteWatchedToAccount = {
    __typename?: "DeleteWatchedToAccountPayload";

    clientMutationId: Maybe<string>;
  };
}

export namespace EventById {
  export type Variables = {
    eventId: string;
    userId: number;
  };

  export type Query = {
    __typename?: "Query";

    event: Maybe<Event>;
  };

  export type Event = {
    __typename?: "Event";

    id: string;

    name: Maybe<string>;

    startDate: BigInt;

    endDate: Maybe<BigInt>;

    ticketproviderurl: Maybe<string>;

    ticketproviderid: Maybe<string>;

    description: Maybe<string>;

    banner: Maybe<string>;

    venueByVenue: Maybe<VenueByVenue>;

    watchLists: WatchLists;

    artistToEvents: ArtistToEvents;
  };

  export type VenueByVenue = {
    __typename?: "Venue";

    name: string;

    lat: Maybe<BigFloat>;

    lon: Maybe<BigFloat>;

    city: number;

    address: Maybe<string>;
  };

  export type WatchLists = {
    __typename?: "WatchListsConnection";

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "WatchList";

    id: number;
  };

  export type ArtistToEvents = {
    __typename?: "ArtistToEventsConnection";

    nodes: _Nodes[];
  };

  export type _Nodes = {
    __typename?: "ArtistToEvent";

    artist: Maybe<Artist>;
  };

  export type Artist = {
    __typename?: "Artist";

    name: string;
  };
}

export namespace ForgotPassword {
  export type Variables = {
    email: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    forgotPassword: Maybe<ForgotPassword>;
  };

  export type ForgotPassword = {
    __typename?: "ForgotPasswordPayload";

    success: Maybe<boolean>;
  };
}

export namespace LoginUser {
  export type Variables = {
    username: string;
    password: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    login: Maybe<Login>;
  };

  export type Login = {
    __typename?: "LoginPayload";

    user: User;
  };

  export type User = {
    __typename?: "User";

    username: string;
  };
}

export namespace RegisterUser {
  export type Variables = {
    username: string;
    email: string;
    password: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    register: Maybe<Register>;
  };

  export type Register = {
    __typename?: "RegisterPayload";

    user: User;
  };

  export type User = {
    __typename?: "User";

    username: string;
  };
}

export namespace RemoveFollowlist {
  export type Variables = {
    followListId: number;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteFollowList: Maybe<DeleteFollowList>;
  };

  export type DeleteFollowList = {
    __typename?: "DeleteFollowListPayload";

    clientMutationId: Maybe<string>;
  };
}

export namespace RemoveWatchlist {
  export type Variables = {
    watchListId: number;
  };

  export type Mutation = {
    __typename?: "Mutation";

    deleteWatchList: Maybe<DeleteWatchList>;
  };

  export type DeleteWatchList = {
    __typename?: "DeleteWatchListPayload";

    clientMutationId: Maybe<string>;
  };
}

export namespace ResetPassword {
  export type Variables = {
    userId: number;
    token: string;
    newPassword: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    resetPassword: Maybe<ResetPassword>;
  };

  export type ResetPassword = {
    __typename?: "ResetPasswordPayload";

    user: Maybe<User>;
  };

  export type User = {
    __typename?: "User";

    username: string;
  };
}

export namespace SearchEventsByCity {
  export type Variables = {
    query: string;
    cityId: number;
    userId: number;
    greaterThan: BigInt;
    lessThan: BigInt;
    batchSize?: Maybe<number>;
    offset?: Maybe<number>;
  };

  export type Query = {
    __typename?: "Query";

    searchEventsByCity: SearchEventsByCity;
  };

  export type SearchEventsByCity = {
    __typename?: "EventsConnection";

    totalCount: number;

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "Event";

    id: string;

    name: Maybe<string>;

    startDate: BigInt;

    ticketproviderurl: Maybe<string>;

    ticketproviderid: Maybe<string>;

    venue: string;

    createdAt: Datetime;

    venueByVenue: Maybe<VenueByVenue>;

    artistToEvents: ArtistToEvents;

    watchLists: WatchLists;
  };

  export type VenueByVenue = {
    __typename?: "Venue";

    lat: Maybe<BigFloat>;

    lon: Maybe<BigFloat>;
  };

  export type ArtistToEvents = {
    __typename?: "ArtistToEventsConnection";

    nodes: _Nodes[];
  };

  export type _Nodes = {
    __typename?: "ArtistToEvent";

    artist: Maybe<Artist>;
  };

  export type Artist = {
    __typename?: "Artist";

    photo: Maybe<string>;
  };

  export type WatchLists = {
    __typename?: "WatchListsConnection";

    nodes: __Nodes[];
  };

  export type __Nodes = {
    __typename?: "WatchList";

    id: number;
  };
}

export namespace SearchEventsByRegion {
  export type Variables = {
    query: string;
    regionName: string;
    userId: number;
    greaterThan: BigInt;
    lessThan: BigInt;
    batchSize?: Maybe<number>;
    offset?: Maybe<number>;
  };

  export type Query = {
    __typename?: "Query";

    searchEventsByRegion: SearchEventsByRegion;
  };

  export type SearchEventsByRegion = {
    __typename?: "EventsConnection";

    totalCount: number;

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "Event";

    id: string;

    name: Maybe<string>;

    startDate: BigInt;

    ticketproviderurl: Maybe<string>;

    ticketproviderid: Maybe<string>;

    venue: string;

    createdAt: Datetime;

    venueByVenue: Maybe<VenueByVenue>;

    artistToEvents: ArtistToEvents;

    watchLists: WatchLists;
  };

  export type VenueByVenue = {
    __typename?: "Venue";

    lat: Maybe<BigFloat>;

    lon: Maybe<BigFloat>;
  };

  export type ArtistToEvents = {
    __typename?: "ArtistToEventsConnection";

    nodes: _Nodes[];
  };

  export type _Nodes = {
    __typename?: "ArtistToEvent";

    artist: Maybe<Artist>;
  };

  export type Artist = {
    __typename?: "Artist";

    photo: Maybe<string>;
  };

  export type WatchLists = {
    __typename?: "WatchListsConnection";

    nodes: __Nodes[];
  };

  export type __Nodes = {
    __typename?: "WatchList";

    id: number;
  };
}

export namespace UpdateAccount {
  export type Variables = {
    userId: number;
    profilePhoto?: Maybe<string>;
    notificationFrequency?: Maybe<Frequency>;
    pushNotification?: Maybe<boolean>;
    emailNotification?: Maybe<boolean>;
  };

  export type Mutation = {
    __typename?: "Mutation";

    updateUser: Maybe<UpdateUser>;
  };

  export type UpdateUser = {
    __typename?: "UpdateUserPayload";

    user: Maybe<User>;
  };

  export type User = {
    __typename?: "User";

    username: string;

    notificationFrequency: Frequency;

    profilePhoto: Maybe<string>;

    pushNotification: Maybe<boolean>;

    emailNotification: Maybe<boolean>;

    id: number;

    watchLists: WatchLists;
  };

  export type WatchLists = {
    __typename?: "WatchListsConnection";

    totalCount: number;
  };
}

export namespace UserByUsername {
  export type Variables = {
    username: string;
    userId: number;
  };

  export type Query = {
    __typename?: "Query";

    userByUsername: Maybe<UserByUsername>;
  };

  export type UserByUsername = {
    __typename?: "User";

    username: string;

    profilePhoto: Maybe<string>;

    watchLists: WatchLists;

    followLists: FollowLists;
  };

  export type WatchLists = {
    __typename?: "WatchListsConnection";

    totalCount: number;

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "WatchList";

    event: Maybe<Event>;
  };

  export type Event = {
    __typename?: "Event";

    id: string;

    name: Maybe<string>;

    startDate: BigInt;

    ticketproviderurl: Maybe<string>;

    ticketproviderid: Maybe<string>;

    venue: string;

    createdAt: Datetime;

    artistToEvents: ArtistToEvents;

    watchLists: _WatchLists;
  };

  export type ArtistToEvents = {
    __typename?: "ArtistToEventsConnection";

    nodes: _Nodes[];
  };

  export type _Nodes = {
    __typename?: "ArtistToEvent";

    artist: Maybe<Artist>;
  };

  export type Artist = {
    __typename?: "Artist";

    photo: Maybe<string>;
  };

  export type _WatchLists = {
    __typename?: "WatchListsConnection";

    nodes: __Nodes[];
  };

  export type __Nodes = {
    __typename?: "WatchList";

    id: number;
  };

  export type FollowLists = {
    __typename?: "FollowListsConnection";

    totalCount: number;

    nodes: ___Nodes[];
  };

  export type ___Nodes = {
    __typename?: "FollowList";

    id: number;

    artist: Maybe<_Artist>;

    venue: Maybe<Venue>;
  };

  export type _Artist = {
    __typename?: "Artist";

    name: string;

    photo: Maybe<string>;
  };

  export type Venue = {
    __typename?: "Venue";

    name: string;

    photo: Maybe<string>;
  };
}

export namespace VenueByName {
  export type Variables = {
    name: string;
    userId: number;
    currentDate: BigInt;
  };

  export type Query = {
    __typename?: "Query";

    venue: Maybe<Venue>;
  };

  export type Venue = {
    __typename?: "Venue";

    name: string;

    description: Maybe<string>;

    lat: Maybe<BigFloat>;

    lon: Maybe<BigFloat>;

    city: number;

    address: Maybe<string>;

    photo: Maybe<string>;

    logo: Maybe<string>;

    followLists: FollowLists;

    eventsByVenue: EventsByVenue;
  };

  export type FollowLists = {
    __typename?: "FollowListsConnection";

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "FollowList";

    id: number;
  };

  export type EventsByVenue = {
    __typename?: "EventsConnection";

    nodes: _Nodes[];
  };

  export type _Nodes = {
    __typename?: "Event";

    name: Maybe<string>;

    startDate: BigInt;

    ticketproviderurl: Maybe<string>;

    ticketproviderid: Maybe<string>;

    id: string;

    artistToEvents: ArtistToEvents;
  };

  export type ArtistToEvents = {
    __typename?: "ArtistToEventsConnection";

    nodes: __Nodes[];
  };

  export type __Nodes = {
    __typename?: "ArtistToEvent";

    artist: Maybe<Artist>;
  };

  export type Artist = {
    __typename?: "Artist";

    photo: Maybe<string>;
  };
}

export namespace VerifyUserEmail {
  export type Variables = {
    token: string;
  };

  export type Mutation = {
    __typename?: "Mutation";

    verifyUserEmail: Maybe<VerifyUserEmail>;
  };

  export type VerifyUserEmail = {
    __typename?: "VerifyUserEmailPayload";

    userEmail: Maybe<UserEmail>;
  };

  export type UserEmail = {
    __typename?: "UserEmail";

    isVerified: boolean;
  };
}

export namespace WatchedLocationByAccount {
  export type Variables = {
    userId: number;
  };

  export type Query = {
    __typename?: "Query";

    watchedToAccounts: Maybe<WatchedToAccounts>;
  };

  export type WatchedToAccounts = {
    __typename?: "WatchedToAccountsConnection";

    nodes: Nodes[];
  };

  export type Nodes = {
    __typename?: "WatchedToAccount";

    id: number;

    region: Maybe<string>;

    city: Maybe<City>;
  };

  export type City = {
    __typename?: "City";

    id: number;

    name: Maybe<string>;
  };
}
