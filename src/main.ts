import * as core from '@actions/core';
import * as installer from './installer';
import * as exec from '@actions/exec';

const PUBLISHER_JAR_NAME = 'org.hl7.fhir.publisher.jar';

async function run(): Promise<void> {
  try {
    await installer.getPublisher(PUBLISHER_JAR_NAME);
    if (process.env.PUBLISHER_JAR) {
      await exec.exec('java', [
        '-Xmx2G',
        '-jar',
        `${process.env.PUBLISHER_JAR}`,
        '-ig',
        'ig.ini'
      ]);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
