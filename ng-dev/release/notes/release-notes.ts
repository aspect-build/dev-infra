/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {render} from 'ejs';
import * as semver from 'semver';
import {CommitFromGitLog} from '../../commit-message/parse';

import {promptInput} from '../../utils/console';
import {GitClient} from '../../utils/git/git-client';
import {assertValidReleaseConfig, ReleaseNotesConfig} from '../config/index';
import {RenderContext} from './context';

import changelogTemplate from './templates/changelog';
import githubReleaseTemplate from './templates/github-release';
import {getCommitsForRangeWithDeduping} from './commits/get-commits-in-range';
import {getConfig} from '../../utils/config';

/** Release note generation. */
export class ReleaseNotes {
  static async forRange(version: semver.SemVer, baseRef: string, headRef: string) {
    const client = GitClient.get();
    const commits = getCommitsForRangeWithDeduping(client, baseRef, headRef);
    return new ReleaseNotes(version, commits);
  }

  /** An instance of GitClient. */
  private git = GitClient.get();
  /** The RenderContext to be used during rendering. */
  private renderContext: RenderContext | undefined;
  /** The title to use for the release. */
  private title: string | false | undefined;
  /** The configuration for release notes. */
  private config: ReleaseNotesConfig = this.getReleaseConfig().releaseNotes ?? {};

  protected constructor(public version: semver.SemVer, private commits: CommitFromGitLog[]) {}

  /** Retrieve the release note generated for a Github Release. */
  async getGithubReleaseEntry(): Promise<string> {
    return render(githubReleaseTemplate, await this.generateRenderContext(), {
      rmWhitespace: true,
    });
  }

  /** Retrieve the release note generated for a CHANGELOG entry. */
  async getChangelogEntry() {
    return render(changelogTemplate, await this.generateRenderContext(), {rmWhitespace: true});
  }

  /** Retrieve the number of commits included in the release notes after filtering and deduping. */
  async getCommitCountInReleaseNotes() {
    const context = await this.generateRenderContext();
    return context.commits.filter(context.includeInReleaseNotes()).length;
  }

  /**
   * Gets the URL fragment for the release notes. The URL fragment identifier
   * can be used to point to a specific changelog entry through an URL.
   */
  async getUrlFragmentForRelease() {
    return (await this.generateRenderContext()).urlFragmentForRelease;
  }

  /**
   * Prompt the user for a title for the release, if the project's configuration is defined to use a
   * title.
   */
  async promptForReleaseTitle() {
    if (this.title === undefined) {
      if (this.config.useReleaseTitle) {
        this.title = await promptInput('Please provide a title for the release:');
      } else {
        this.title = false;
      }
    }
    return this.title;
  }

  /** Build the render context data object for constructing the RenderContext instance. */
  private async generateRenderContext(): Promise<RenderContext> {
    if (!this.renderContext) {
      this.renderContext = new RenderContext({
        commits: this.commits,
        github: this.git.remoteConfig,
        version: this.version.format(),
        groupOrder: this.config.groupOrder,
        hiddenScopes: this.config.hiddenScopes,
        categorizeCommit: this.config.categorizeCommit,
        title: await this.promptForReleaseTitle(),
      });
    }
    return this.renderContext;
  }

  // This method is used for access to the utility functions while allowing them
  // to be overwritten in subclasses during testing.
  protected getReleaseConfig() {
    const config = getConfig();
    assertValidReleaseConfig(config);
    return config.release;
  }
}
