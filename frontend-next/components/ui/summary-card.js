import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SummaryCard({ title, value, footerText, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {footerText && (
          <p className="text-xs text-muted-foreground">{footerText}</p>
        )}
      </CardContent>
    </Card>
  );
}
