export const getEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
};

export const getEnvNumber = (key: string, fallback?: number): number => {
  const value = process.env[key];

  if (!value) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Environment variable ${key} is not set`);
  }

  return Number(value);
};
