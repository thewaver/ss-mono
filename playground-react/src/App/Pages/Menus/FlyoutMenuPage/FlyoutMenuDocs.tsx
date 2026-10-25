import { useState } from "react";

import { FLYOUT_MENU_DEFAULTS } from "@thewaver/ss-components-react";
import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
import { DOCS_ROOT, FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../../PageComponents/DocsSection/DocsSection";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { NarrowDocsExample } from "./Docs/Narrow";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const FlyoutMenuDocs = () => {
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
    const [transitionDurationMs, setTransitionDurationMs] = useState(FLYOUT_MENU_DEFAULTS.transitionDurationMs);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"hoverShowDelayMs"}
                            label={"Hover delay (ms)"}
                            hint={"How long the pointer has to rest on an entry before its panel opens."}
                            controls={"Sets FlyoutMenuProps.hoverShowDelayMs"}
                        >
                            <PageNumberField
                                value={hoverShowDelayMs}
                                min={FlyoutMenuKnobs.MIN_DELAY_MS}
                                max={FlyoutMenuKnobs.MAX_DELAY_MS}
                                step={FlyoutMenuKnobs.DELAY_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Hover delay in milliseconds"}
                                onInput={setHoverShowDelayMs}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"transitionDurationMs"}
                            label={"Transition duration (ms)"}
                            hint={"How long the panel takes to fade, and to glide from one entry to the next."}
                            controls={"Sets FlyoutMenuProps.transitionDurationMs"}
                        >
                            <PageNumberField
                                value={transitionDurationMs}
                                min={FlyoutMenuKnobs.MIN_TRANSITION_MS}
                                max={FlyoutMenuKnobs.MAX_TRANSITION_MS}
                                step={FlyoutMenuKnobs.TRANSITION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample hoverShowDelayMs={hoverShowDelayMs} transitionDurationMs={transitionDurationMs} />
            </PageDocsExample>

            <PageDocsSection
                title={"Too narrow for every entry"}
                content={
                    "The bar measures itself, and the entries that do not fit collapse into a last one. Inside its panel each collapsed entry keeps its link and its toggle, and the toggle opens that entry's links in place. Give an entry a [prop]collapse[/prop] of never to keep it on the bar, or always to send it to the end whatever the room."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Narrow.tsx`}>
                <NarrowDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the entries run from the right, each toggle sits to the left of its link, and Tab walks them in that order. The panel takes the box's direction although it is drawn outside it: it hangs from the right edge of its entry and its links read from the right. A [prop]placement[/prop] you give is used as it stands."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
