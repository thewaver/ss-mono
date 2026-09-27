import { describe, expect, it } from "vitest";

import { DateTimeValueUtils } from "../../../Abstracts/DateTimeValue/DateTimeValue.utils";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { DateTimePickerUtils } from "./DateTimePicker.utils";

const date = (iso: string) => DateValueUtils.fromIso(iso)!;

describe("DateTimePickerUtils", () => {
    const min = DateTimeValueUtils.of(date("2026-08-10"), { hour: 9, minute: 0 });

    it("stops the clock at the bound's time only on the bound's day", () => {
        expect(DateTimePickerUtils.computeMinTime(date("2026-08-10"), min)).toEqual({ hour: 9, minute: 0 });
        expect(DateTimePickerUtils.computeMinTime(date("2026-08-11"), min)).toEqual({ hour: 0, minute: 0, second: 0 });
        expect(DateTimePickerUtils.computeMaxTime(undefined, min)).toEqual({ hour: 23, minute: 59, second: 59 });
    });
});
