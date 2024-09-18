import * as fs from 'fs';
import * as path from 'path';

export const exportApidog = async (
  projectId: string,
  docId: string,
  output: string,
) => {
  const payload = {
    type: 'openapi',
    id: docId,
    version: '3.1',
    excludeExtension: true,
    excludeTagsWithFolder: true,
    projectId,
  };

  const res = await fetch(
    `https://apidog.com/api/v1/projects/${projectId}/shared-docs/${docId}/export-data`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'X-Client-Version': '2.2.30',
        'X-Project-Id': projectId,
        'Content-Type': 'application/json',
      },
    },
  );
  if (res.status !== 200) {
    throw new Error('Failed to export API doc');
  }
  const json = await res.json();
  // prepare output directory
  const dir = path.dirname(output);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(output, JSON.stringify(json, null, 2));
};
