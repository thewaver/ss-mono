import { useState } from "react";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TimeInputPage/TimeInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LabeledDocsExample } from "./Docs/Labeled";
import { LimitsDocsExample } from "./Docs/Limits";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SecondsDocsExample } from "./Docs/Seconds";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { TwelveHourDocsExample } from "./Docs/TwelveHour";

export const TimeInputDocs = () => {
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
                                "Its time can be selected and copied, but neither typing, pasting nor the arrow keys change it."
                            }
                            controls={"Sets TimeInputProps.isReadOnly"}
                        >
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={
                                "Marks the field invalid, for screen readers as well as for the painter. The field also marks itself while what it shows is not a time."
                            }
                            controls={"Sets TimeInputProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets TimeInputProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Twelve hours"}
                content={
                    "Set [prop]isTwelveHour[/prop] and the hours are written from 1 to 12, with the morning or afternoon decided by a control you draw in [prop]renderTrailing[/prop], which is handed the field's reading of it and a way to switch it. The value underneath stays a 24-hour time, as the line under the field shows."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/TwelveHour.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"isTwelveHour"}
                        label={"Twelve hour"}
                        hint={"Writes the hours from 1 to 12, with a morning and afternoon marker."}
                        controls={"Sets TimeInputProps.isTwelveHour"}
                    >
                        <PageCheckField value={isTwelveHour} ariaLabel={"Twelve hour"} onChange={setIsTwelveHour} />
                    </PageProp>
                )}
            >
                <TwelveHourDocsExample isTwelveHour={isTwelveHour} />
            </PageDocsExample>

            <PageDocsSection
                title={"To the second"}
                content={
                    "Set [prop]hasSeconds[/prop] and the field takes a third part, the seconds, which the arrow keys step like the others. Without it the value is a time to the minute."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Seconds.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"hasSeconds"}
                        label={"Seconds"}
                        hint={"Adds the seconds to the hours and minutes."}
                        controls={"Sets TimeInputProps.hasSeconds"}
                    >
                        <PageCheckField value={hasSeconds} ariaLabel={"Seconds"} onChange={setHasSeconds} />
                    </PageProp>
                )}
            >
                <SecondsDocsExample hasSeconds={hasSeconds} />
            </PageDocsExample>

            <PageDocsSection
                title={"Within opening hours"}
                content={
                    "A [prop]minValue[/prop] and a [prop]maxValue[/prop] keep the time in range. The arrow keys stop at them, and a typed time outside them is kept as typed until the field is left, then moved to the nearest of the two."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Limits.tsx`}>
                <LimitsDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the trailing content moves to the left, where reading ends, and the text lines up on the right. The time itself is still written hours first, since digits run left to right in either direction."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."
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
                                "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets TimeInputProps.isReachableWhenDisabled"}
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
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets TimeInputProps.isDisabled"}
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

            <PageDocsSection
                title={"Named by a Label"}
                content={
                    "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
