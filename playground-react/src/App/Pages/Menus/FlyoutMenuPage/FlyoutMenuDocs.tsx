import { useState } from "react";

import { FLYOUT_MENU_DEFAULTS } from "@thewaver/ss-components-react";
import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

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
                        <PageProp itemKey={"hoverShowDelayMs"} {...FlyoutMenuKnobs.HOVER_SHOW_DELAY_MS_TEXT}>
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

                        <PageProp itemKey={"transitionDurationMs"} {...FlyoutMenuKnobs.TRANSITION_DURATION_MS_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.tooNarrowEveryEntry} />

            <PageDocsExample path={`${DOCS_ROOT}/Narrow.tsx`}>
                <NarrowDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
