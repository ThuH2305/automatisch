import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import { URLSearchParams } from 'url';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import generateRequest from './generate-request';
import getCurrentUser from './get-current-user';
import getUserByUsername from './get-user-by-username';

type IGetUserTweetsOptions = {
  currentUser: boolean;
  userId?: string;
  lastInternalId?: string;
};

const getUserTweets = async (
  $: IGlobalVariable,
  options: IGetUserTweetsOptions
) => {
  let username: string;

  if (options.currentUser) {
    const currentUser = await getCurrentUser($);
    username = currentUser.username as string;
  } else {
    username = $.db.step.parameters.username as string;
  }

  const user = await getUserByUsername($, username);

  let response;

  const tweets: {
    data: IJSONObject[];
    error: IJSONObject | null;
  } = {
    data: [],
    error: null,
  };

  do {
    const params: IJSONObject = {
      since_id: options.lastInternalId,
      pagination_token: response?.data?.meta?.next_token,
    };

    const queryParams = new URLSearchParams(omitBy(params, isEmpty));

    const requestPath = `/2/users/${user.id}/tweets${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    response = await generateRequest($, {
      requestPath,
      method: 'GET',
    });

    if (response.integrationError) {
      tweets.error = response.integrationError;
      return tweets;
    }

    if (response.data.meta.result_count > 0) {
      response.data.data.forEach((tweet: IJSONObject) => {
        if (
          !options.lastInternalId ||
          Number(tweet.id) > Number(options.lastInternalId)
        ) {
          tweets.data.push(tweet);
        } else {
          return;
        }
      });
    }
  } while (response.data.meta.next_token && options.lastInternalId);

  return tweets;
};

export default getUserTweets;
