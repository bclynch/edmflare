export const fromEmail = '"EDM Flare " <mail@edmflare.com>';
export const awsRegion = 'us-east-1';
export const projectName = 'EDM Flare';
export const companyName = projectName; // For copyright ownership
export const emailLegalText =
  // Envvar here so we can override on the demo website
  process.env.LEGAL_TEXT || '© EDM Flare';
