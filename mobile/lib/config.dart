// Build-time settings, passed with --dart-define.
class Config {
  static const supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://scefwcqacstzrfayjjsh.supabase.co',
  );

  // Publishable key: safe to ship in the app, access is enforced by the database.
  static const supabaseKey = String.fromEnvironment(
    'SUPABASE_KEY',
    defaultValue: 'sb_publishable_faYNo56tBddGrlCPsGEQcA_h0w5A0XJ',
  );

  // Set only in the ads APK build, e.g.
  // utm_source=meta&utm_medium=paid_social&utm_campaign=apk_download
  static const apkReferrer = String.fromEnvironment('APK_REFERRER');

  static const policyVersion = 'v2';
  static const appName = 'Veltora';
  static const supportEmail = 'info.veltora@gmail.com';
  static const website = 'https://veltora-app.vercel.app';
  static const maxUploadBytes = 50 * 1024 * 1024; // Supabase free plan limit

  static String publicUrl(String key) =>
      '$supabaseUrl/storage/v1/object/public/public/$key';
}
