import { Octokit } from 'octokit';
import { IJSONObject } from '@automatisch/types';

import { assignOwnerAndRepo } from '../utils';

export default class NewLabel {
  client?: Octokit;
  repoOwner?: string;
  repo?: string;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    if (connectionData.accessToken) {
      this.client = new Octokit({
        auth: connectionData.accessToken as string,
      });
    }

    assignOwnerAndRepo(this, parameters?.repo as string);
  }

  get options() {
    return {
      owner: this.repoOwner,
      repo: this.repo,
    };
  }

  async run() {
    // TODO: implement pagination on undated entires
    return await this.client.paginate(
      this.client.rest.issues.listLabelsForRepo,
      this.options
    );
  }

  async testRun() {
    const options = {
      ...this.options,
      per_page: 1,
    };

    return (await this.client.rest.issues.listLabelsForRepo(options)).data;
  }
}
