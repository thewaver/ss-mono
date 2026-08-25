import type { DateValueWeekStart } from "@thewaver/ss-components";
import { DateValueUtils } from "@thewaver/ss-components";

export const LOCALE = "en-GB";
export const WEEKEND_DAYS = [0, 6];

export const TODAY = DateValueUtils.fromIso("2026-08-10")!;
export const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
export const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;

export const WEEK_START_LABELS: Record<DateValueWeekStart, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};
