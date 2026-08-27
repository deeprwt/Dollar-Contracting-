import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

const rows = [
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phone,
    href: siteConfig.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: siteConfig.emailHref,
  },
  {
    icon: MapPin,
    label: "Main Office",
    value: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.region}`,
  },
  {
    icon: MapPin,
    label: "Service Area",
    value: "Thunder Bay, Greenstone, Marathon, and surrounding communities",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: `${siteConfig.hours.weekdays} · ${siteConfig.hours.weekend}`,
  },
];

export function ContactInfo() {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold">Contact Information</h3>
        <div className="mt-5 space-y-4">
          {rows.map((r, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                <r.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {r.label}
                </p>
                {r.href ? (
                  <a href={r.href} className="text-sm font-medium hover:text-[var(--brand)] break-all">
                    {r.value}
                  </a>
                ) : (
                  <p className="text-sm font-medium">{r.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
