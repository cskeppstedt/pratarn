const envKeys = [
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_DEFAULT_REGION",
  "DISCORD_AUTH_TOKEN",
  "DISCORD_APPLICATION_ID",
  "IMGUR_CLIENT_ID",
  "LOG_LEVEL",
] as const;

type EnvKey = typeof envKeys[number];

export function readEnv(envKey: EnvKey): string | undefined {
  return process.env[envKey];
}

export function assertReadEnv(envKey: EnvKey): string {
  const value = readEnv(envKey);
  if (!value) {
    throw new Error(`No value for process.env.${envKey}`);
  }
  return value;
}
