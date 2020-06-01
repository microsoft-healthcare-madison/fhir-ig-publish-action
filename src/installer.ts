import * as core from '@actions/core';
import * as httpm from '@actions/http-client';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';
import * as path from 'path';
import * as igToolingInfo from './igToolingInfo';

const PUBLISH_TOOL_URL =
  'https://raw.githubusercontent.com/FHIR/latest-ig-publisher/master/tools.json';
let publisherVersion = '';
let publisherLink = '';

let tempDirectory = process.env['RUNNER_TEMP'] || '';

const IS_WINDOWS = process.platform === 'win32';

if (!tempDirectory) {
  let baseLocation;
  if (IS_WINDOWS) {
    // On windows use the USERPROFILE env variable
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export async function getPublisherJarInfo(): Promise<void> {
  const http = new httpm.HttpClient('fhir-ig-publish-action', undefined, {
    allowRetries: true,
    maxRetries: 3
  });

  core.debug('Getting tooling information from GitHub');

  const response = await http.get(PUBLISH_TOOL_URL);
  const statusCode = response.message.statusCode || 0;
  if (statusCode < 200 || statusCode > 299) {
    let body = '';
    try {
      body = await response.readBody();
    } catch (err) {
      core.debug(`Unable to read body: ${err.message}`);
    }
    const message = `Unexpected HTTP status code '${response.message.statusCode}' when retrieving versions from '${PUBLISH_TOOL_URL}'. ${body}`.trim();
    throw new Error(message);
  }

  const contents = await response.readBody();
  const igInfo: igToolingInfo.IGToolingInfo = JSON.parse(contents);

  if (!igInfo) {
    const message = `Failed to parse tooling info from: ${PUBLISH_TOOL_URL}: ${contents}`.trim();
    core.debug(message);
    throw new Error(message);
  }

  publisherVersion = igInfo.publisher.version;
  publisherLink = igInfo.publisher.link;

  if (!publisherVersion || !publisherLink) {
    const message = `Failed to parse tooling info from: ${PUBLISH_TOOL_URL}: ${contents}`.trim();
    core.debug(message);
    throw new Error(message);
  }
}

export async function getPublisher(jarName: string): Promise<void> {
  await getPublisherJarInfo();

  const publisherJar = path.join(tempDirectory, jarName);
  let toolPath = tc.find(jarName, publisherVersion);

  if (toolPath) {
    core.debug(`Tool found in cache ${toolPath}`);
  } else {
    core.debug('Downloading IG Publisher...');
    toolPath = await tc.downloadTool(publisherLink, publisherJar);

    if (!fs.existsSync(publisherJar)) {
      const message = `Could not find publisher after download: ${publisherJar}`;
      core.debug(message);
      throw new Error(message);
    }

    toolPath = await tc.cacheFile(
      toolPath,
      jarName,
      'FHIR IG Publisher',
      publisherVersion
    );
  }

  core.exportVariable('PUBLISHER_JAR', toolPath);
  core.setOutput('publisherVersion', publisherVersion);
}
