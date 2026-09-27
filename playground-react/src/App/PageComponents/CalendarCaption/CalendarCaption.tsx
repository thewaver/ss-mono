import { useEffect, useMemo, useRef, useState } from "react";

import type { DateValue } from "@thewaver/ss-components-react";
import { Button, DateValueUtils, FocusManagerUtils, useLatest } from "@thewaver/ss-components-react";
import { FunctionUtils } from "@thewaver/ss-utils";

import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageCalendarCaptionFields,
    PageCalendarHeader,
    PageCalendarTitle,
} from "../../StyledComponents/CalendarContent/CalendarContent";
import { PageNumberField, PageSelectField } from "../Field/Field";
import type { PageCalendarCaptionProps } from "./CalendarCaption.types";

const MONTH_STEP = 1;
const MONTH_FIELD_WIDTH = 122;
const YEAR_FIELD_WIDTH = 80;
const YEAR_SETTLE_MS = 300;
const TITLE_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
const PAST_ERA_TITLE_OPTIONS: Intl.DateTimeFormatOptions = { ...TITLE_OPTIONS, era: "short" };

export const PageCalendarCaption = (props: PageCalendarCaptionProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isRestoringFocus, setIsRestoringFocus] = useState(false);
    const [titleRef, setTitleRef] = useState<HTMLElement | null>(null);
    const [fieldsRef, setFieldsRef] = useState<HTMLDivElement | null>(null);

    const restorePointRef = useRef<DateValue>(undefined);
    const pendingYearRef = useRef<number>(undefined);

    const [month, setMonth] = props.monthState;

    const latestMonthState = useLatest(props.monthState);

    const monthNames = useMemo(() => DateValueUtils.getMonthNames(month, props.locale), [month, props.locale]);

    const monthValues = useMemo(
        () => Array.from({ length: DateValueUtils.getMonthsInYear(month) }, (_, index) => index + 1),
        [month],
    );

    const getTitle = () => {
        const eras = DateValueUtils.getEras(month, props.locale);
        const isPastEra = month.era !== eras[eras.length - 1].id;

        return DateValueUtils.format(month, isPastEra ? PAST_ERA_TITLE_OPTIONS : TITLE_OPTIONS, props.locale);
    };

    const jumpTo = (value: { year?: number; month?: number }) => {
        const [latestMonth, setLatestMonth] = latestMonthState.current;

        setLatestMonth(latestMonth.set({ ...value, day: 1 }));
    };

    const page = (direction: 1 | -1) => {
        setMonth(DateValueUtils.addMonths(month, direction * MONTH_STEP));
    };

    const [writeYear] = useState(() =>
        FunctionUtils.debounce((year: number) => {
            pendingYearRef.current = undefined;
            jumpTo({ year });
        }, YEAR_SETTLE_MS),
    );

    const queueYear = (year: number) => {
        if (!isEditing) return;

        pendingYearRef.current = year;
        writeYear(year);
    };

    const settleYear = () => {
        writeYear.cancel();

        if (pendingYearRef.current === undefined) return;

        jumpTo({ year: pendingYearRef.current });
        pendingYearRef.current = undefined;
    };

    const startEditing = () => {
        restorePointRef.current = month;
        setIsEditing(true);
    };

    const stopEditing = (restoreFocus: boolean) => {
        settleYear();
        setIsRestoringFocus(restoreFocus);
        setIsEditing(false);
    };

    const abandonEditing = () => {
        writeYear.cancel();
        pendingYearRef.current = undefined;

        setIsRestoringFocus(true);
        setIsEditing(false);

        if (restorePointRef.current) setMonth(restorePointRef.current);
    };

    useEffect(() => {
        if (isEditing) {
            FocusManagerUtils.getFirstFocusableChild(fieldsRef ?? undefined)?.focus();

            return;
        }

        if (!isRestoringFocus || !titleRef?.isConnected) return;

        setIsRestoringFocus(false);
        titleRef.focus();
    }, [isEditing, isRestoringFocus, titleRef, fieldsRef]);

    useEffect(() => writeYear.cancel, [writeYear]);

    return (
        <PageCalendarHeader>
            <Button
                id={`${props.itemKey}PreviousMonth`}
                ariaLabel={"Previous month"}
                renderContent={(flags) => <PageButtonContent flags={flags}>◀</PageButtonContent>}
                onClick={() => page(-1)}
            />

            {isEditing ? (
                <PageCalendarCaptionFields
                    ref={setFieldsRef}
                    onKeyDown={(e) => {
                        if (e.defaultPrevented) return;

                        if (e.key === "Enter") {
                            e.preventDefault();
                            stopEditing(true);
                        } else if (e.key === "Escape") {
                            e.preventDefault();
                            abandonEditing();
                        }
                    }}
                    onBlur={(e) => {
                        if (!isEditing) return;
                        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;

                        stopEditing(false);
                    }}
                >
                    <PageSelectField
                        value={month.month}
                        values={monthValues}
                        width={MONTH_FIELD_WIDTH}
                        ariaLabel={"Month"}
                        computeLabel={(value) => monthNames[value - 1]}
                        onChange={(value) => jumpTo({ month: value })}
                    />

                    <PageNumberField
                        value={month.year}
                        width={YEAR_FIELD_WIDTH}
                        ariaLabel={"Year"}
                        onInput={queueYear}
                    />
                </PageCalendarCaptionFields>
            ) : (
                <Button
                    ref={setTitleRef}
                    id={`${props.itemKey}MonthTitle`}
                    ariaLabel={`${getTitle()}, pick a month and year`}
                    renderContent={(flags) => <PageCalendarTitle flags={flags}>{getTitle()}</PageCalendarTitle>}
                    onClick={startEditing}
                />
            )}

            <Button
                id={`${props.itemKey}NextMonth`}
                ariaLabel={"Next month"}
                renderContent={(flags) => <PageButtonContent flags={flags}>▶</PageButtonContent>}
                onClick={() => page(1)}
            />
        </PageCalendarHeader>
    );
};
