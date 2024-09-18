export class ApiDogExporterError extends Error {}

export const processDone = () => {
  process.exit(0);
};

export const processError = (error: ApiDogExporterError) => {
  console.error(error.message);
  process.exit(1);
};
