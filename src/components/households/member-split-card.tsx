import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  formatHouseholdCurrency,
  formatSharePercent,
  formatSignedHouseholdCurrency,
  formatSignedSharePercent,
  readDeviation,
} from "@/lib/households/format";
import type { HouseholdExpenseSplitMember } from "@/types/households";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

const DEVIATION_BADGE: Record<ReturnType<typeof readDeviation>, { label: string; variant: "secondary" | "warning" }> = {
  "on-target": { label: "On target", variant: "secondary" },
  above: { label: "Above expected", variant: "warning" },
  below: { label: "Below expected", variant: "warning" },
};

function MetricRow({
  label,
  value,
  share,
  shareLabel,
}: {
  label: string;
  value: number | null;
  share: number | null;
  shareLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-label text-muted-foreground">{label}</span>
        <span className="text-number-md font-semibold">{value === null ? "No data" : formatHouseholdCurrency(value)}</span>
      </div>
      {value === null || share === null ? (
        <div className="h-2 w-full rounded-pill bg-muted" aria-hidden="true" />
      ) : (
        <div className="flex items-center gap-2">
          <Progress value={share * 100} max={100} label={shareLabel} className="flex-1" />
          <span className="text-label text-muted-foreground">{formatSharePercent(share)}</span>
        </div>
      )}
    </div>
  );
}

export function MemberSplitCard({ member }: { member: HouseholdExpenseSplitMember }) {
  const deviationReading = member.deviationShare === null ? null : readDeviation(member.deviationShare);
  const badge = deviationReading ? DEVIATION_BADGE[deviationReading] : null;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar alt={member.name} fallback={initials(member.name)} />
          <span className="font-medium">{member.name}</span>
        </div>
        {member.hasIncompleteData && <Badge variant="secondary">Incomplete data</Badge>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <MetricRow
          label="Income"
          value={member.income}
          share={member.incomeShare}
          shareLabel={`${member.name}'s income, ${member.incomeShare === null ? "no data" : formatSharePercent(member.incomeShare)} of household total`}
        />
        <MetricRow
          label="Household expenses"
          value={member.householdExpense}
          share={member.householdExpenseShare}
          shareLabel={`${member.name}'s household expenses, ${member.householdExpenseShare === null ? "no data" : formatSharePercent(member.householdExpenseShare)} of household total`}
        />

        <div className="flex items-center justify-between">
          <span className="text-label text-muted-foreground">Expected</span>
          <span className="text-number-md font-semibold">
            {member.expectedHouseholdExpense === null ? "No data" : formatHouseholdCurrency(member.expectedHouseholdExpense)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-label text-muted-foreground">Deviation</span>
          {member.deviation === null || member.deviationShare === null ? (
            <span className="text-number-md font-semibold">No data</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-number-md font-semibold">
                {formatSignedHouseholdCurrency(member.deviation)} ({formatSignedSharePercent(member.deviationShare)})
              </span>
              {badge && <Badge variant={badge.variant}>{badge.label}</Badge>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
