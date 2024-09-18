#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { exportApidog } from './lib/export-apidog';
import {
  ApiDogExporterError,
  processDone,
  processError,
} from './lib/process-manager';

try {
  const argv = yargs(hideBin(process.argv)).command(
    '$0 <projectId> <target> <output>',
    'Get API doc',
    (yargs) => {
      yargs
        .positional('projectId', {
          describe: 'project id',
          type: 'string',
        })
        .positional('target', {
          describe: 'Document id or Shared doc url',
          type: 'string',
        })
        .positional('output', {
          describe: 'output file path',
          type: 'string',
        });
    },
  ).argv as unknown as {
    projectId: string;
    target: string;
    output: string;
  };

  if (!argv.projectId || !argv.target || !argv.output) {
    throw new ApiDogExporterError(
      'Both projectId, docId and output are required.',
    );
  }

  const formatDocId = (value: string) => {
    try {
      const url = new URL(value);
      const hostname = url.hostname.replace('www.', '');
      const isApiDog = hostname.startsWith('apidog.com');
      if (isApiDog) {
        return value.replace(/^http(.*)shared-/, '');
      }
      return value;
    } catch (error) {
      return value;
    }
  };
  const docId = formatDocId(argv.target);

  const { projectId, output } = argv;
  exportApidog(projectId, docId, output).then(processDone);
} catch (error) {
  if (error instanceof ApiDogExporterError) {
    processError(error);
  } else {
    throw error;
  }
}

// https://www.apidog.com/apidoc/shared-5c7fdc13-383f-468d-adab-c3c8d384a39f
