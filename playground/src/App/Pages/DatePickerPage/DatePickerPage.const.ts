import { DateValueUtils } from "@thewaver/ss-components";
import type { ClockSteps } from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

export const FIELD_WIDTH = 220;
export const LOCALE = "en-GB";

export const TODAY = DateValueUtils.fromIso("2026-08-10")!;
export const MIN_DATE = DateValueUtils.fromIso("2026-08-05")!;
export const MAX_DATE = DateValueUtils.fromIso("2026-08-20")!;
export const CAESAR = DateValueUtils.fromIso("-000043-03-15")!;

export const OPENING_TIME: TimeValue = { hour: 9, minute: 0 };
export const CLOSING_TIME: TimeValue = { hour: 17, minute: 30 };

export const BOOKING_STEPS: ClockSteps = { minute: 15 };
