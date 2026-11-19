import { Badge, Card, LinkButton, PageHeader } from "@/components/ui";
import { requireOwner } from "@/lib/auth";

// General settings: every app-wide switch in one place, with a link to the
// page where it is changed. Nothing is edited here, so the rules stay in one
// spot each (Plans, Payments, Meta Pixel, Admins).
export default async function SettingsPage() {
  const { supabase, user } = await requireOwner();
  const [{ data: mode }, { data: pay }, { data: meta }, { data: play }, { data: admins }] = await Promise.all([
    supabase.from("app_mode").select("free_mode").eq("id", 1).maybeSingle(),
    supabase.from("payment_settings").select("upi_id, payee_name, enabled").eq("id", 1).maybeSingle(),
    supabase.from("meta_settings").select("pixel_id, enabled, apk_url").eq("id", 1).maybeSingle(),
    supabase.from("play_settings").select("package_name, enabled").eq("id", 1).maybeSingle(),
    supabase.rpc("admin_list_admins"),
  ]);

  const freeMode = Boolean(mode?.free_mode);
  const rows: { title: string; on: boolean; onText: string; offText: string; detail: string; href: string }[] = [
    {
      title: "Free mode",
      on: freeMode,
      onText: "On: plans hidden",
      offText: "Off: plans on sale",
      detail: "When on, the app is free and shows no plans or payments.",
      href: "/plans",
    },
    {
      title: "UPI payments",
      on: Boolean(pay?.enabled && pay?.upi_id),
      onText: "Accepting payments",
      offText: pay?.upi_id ? "Paused" : "UPI ID not set",
      detail: pay?.upi_id ? `Money goes to ${pay.upi_id}${pay.payee_name ? ` (${pay.payee_name})` : ""}.` : "Add your UPI ID before selling plans.",
      href: "/payments",
    },
    {
      title: "Meta tracking",
      on: Boolean(meta?.enabled && meta?.pixel_id),
      onText: "Sending events",
      offText: meta?.pixel_id ? "Off" : "Not connected",
      detail: meta?.pixel_id ? `Dataset ${meta.pixel_id}.` : "Connect your Pixel / dataset to measure ads.",
      href: "/meta",
    },
    {
      title: "Download page",
      on: Boolean(meta?.apk_url),
      onText: "APK link set",
      offText: "No APK link",
      detail: "The public /d page people reach from your ads.",
      href: "/meta",
    },
    {
      title: "Google Play reporting",
      on: Boolean(play?.enabled),
      onText: "On",
      offText: "Off",
      detail: play?.package_name ? `Reports Play-build payments for ${play.package_name}.` : "Reports Play-build payments to Google.",
      href: "/payments",
    },
  ];

  return (
    <>
      <PageHeader title="Settings" subtitle="The app-wide switches at a glance. Open a row to change it." />
      <Card className="p-0">
        <ul className="divide-y divide-gray-100">
          {rows.map((r) => (
            <li key={r.title} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-gray-900">{r.title}</h2>
                  <Badge tone={r.on ? "green" : "gray"}>{r.on ? r.onText : r.offText}</Badge>
                </div>
                <p className="mt-0.5 break-words text-sm text-gray-500">{r.detail}</p>
              </div>
              <LinkButton href={r.href} variant="secondary">
                Change
              </LinkButton>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <h2 className="font-semibold text-gray-900">Your account</h2>
        <p className="mt-1 break-words text-sm text-gray-500">
          Signed in as {user.email ?? "owner"} · Owner · {(admins ?? []).length} admin account
          {(admins ?? []).length === 1 ? "" : "s"} in total.
        </p>
        <div className="mt-3">
          <LinkButton href="/admins" variant="secondary">
            Manage admins
          </LinkButton>
        </div>
      </Card>
    </>
  );
}
