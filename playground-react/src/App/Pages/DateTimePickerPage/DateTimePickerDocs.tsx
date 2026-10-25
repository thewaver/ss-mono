import { useState } from "react";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { PairedDocsExample } from "./Docs/Paired";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { TwelveHourDocsExample } from "./Docs/TwelveHour";

export const DateTimePickerDocs = () => {
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isTwelveHour, setIsTwelveHour] = useState(true);
    const [hasSeconds, setHasSeconds] = useState(true);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"isReadOnly"}
                            label={"Read-only"}
                            hint={
                                "Its date and time can be selected and copied, but neither typing, pasting nor the arrow keys change them, and neither popup can be opened."
                            }
                            controls={"Sets DateTimePickerProps.isReadOnly"}
                        >
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={
                                "Marks both fields invalid, for screen readers as well as for the painter. Each field also marks itself while what it shows cannot be read."
                            }
                            controls={"Sets DateTimePickerProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the picker off: nothing can write to either field, neither popup can be opened, and the Tab key skips them all."
                            }
                            controls={"Sets DateTimePickerProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Twelve hours, to the second"}
                content={
                    "Set [prop]isTwelveHour[/prop] and the time field and the clock read the hours from 1 to 12, with the field's morning or afternoon control drawn in [prop]renderTimeTrailing[/prop]. Set [prop]hasSeconds[/prop] and both take the seconds too. The value's time stays a 24-hour one."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"isTwelveHour"}
                            label={"Twelve hour"}
                            hint={"Writes the hours from 1 to 12, with a morning and afternoon marker."}
                            controls={"Sets DateTimePickerProps.isTwelveHour"}
                        >
                            <PageCheckField value={isTwelveHour} ariaLabel={"Twelve hour"} onChange={setIsTwelveHour} />
                        </PageProp>

                        <PageProp
                            itemKey={"hasSeconds"}
                            label={"Seconds"}
                            hint={"Adds the seconds to the hours and minutes, in the field and in the clock."}
                            controls={"Sets DateTimePickerProps.hasSeconds"}
                        >
                            <PageCheckField value={hasSeconds} ariaLabel={"Seconds"} onChange={setHasSeconds} />
                        </PageProp>
                    </>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={isTwelveHour} hasSeconds={hasSeconds} />
            </PageDocsExample>

            <PageDocsSection
                title={"Two fields of your own"}
                content={
                    "The picker is built on a split you can use yourself: it takes the one value and hands back a date and a time, here for a plain DateInput and a TimeInput, and joins the two again on the way back. Clearing either field clears the value, and typing it again brings the other half back."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Paired.tsx`}>
                <PairedDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the date field sits on the right, where reading starts, and the time field on the left, each field's trigger moves to its left end, and each popup opens under its own field's right edge."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a picker [prop]tooltipDefs[/prop] and one tooltip shows over both fields while either is hovered or holds keyboard focus, read by screen readers as the description of whichever field is focused. A disabled picker shows no tooltip unless you also keep it reachable when disabled; its fields can then be focused to read why it is off, and typing still changes nothing."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled picker's tooltip available: the Tab key can stop on its fields and hovering them shows the tooltip. Without it a disabled picker shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets DateTimePickerProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the picker off: nothing can write to either field, neither popup can be opened, and the Tab key skips them all."
                            }
                            controls={"Sets DateTimePickerProps.isDisabled"}
                        >
                            <PageCheckField
                                value={isTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample isDisabled={isTooltipDisabled} isReachableWhenDisabled={isReachableWhenDisabled} />
            </PageDocsExample>
        </>
    );
};
