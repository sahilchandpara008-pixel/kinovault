-- The Meta dataset (Pixel) is now linked to the Veltora app in Events
-- Manager (app ID 1790101855436439), so server events go out as app events
-- for the Google Play package instead of website events.
update public.meta_settings
   set action_source = 'app',
       app_package   = 'com.veltora.app',
       updated_at    = now()
 where id = 1;
