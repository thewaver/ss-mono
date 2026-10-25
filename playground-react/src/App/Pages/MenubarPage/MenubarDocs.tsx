import { useState } from "react";

import { MenubarKnobs } from "@thewaver/ss-playground/App/Knobs/Menubars.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { OverflowDocsExample } from "./Docs/Overflow";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const MenubarDocs = () => {
    const [barWidth, setBarWidth] = useState(MenubarKnobs.STARTING_NARROW_BAR_WIDTH);

    return (
        <>
            <PageDocsExample path={`${DOCS_ROOT}/Basic.tsx`}>
                <BasicDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"When the words do not fit"}
                content={
                    "The bar measures itself, and the words that do not fit move into an overflow menu at its end, each becoming a submenu of it that holds that word's own menu. One [prop]checked[/prop], [prop]renderItem[/prop] and [prop]renderPopup[/prop] serve every menu the bar opens, the overflow menu included, so a View option keeps its state wherever View is drawn."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Overflow.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"barWidth"}
                        label={"Bar width (px)"}
                        hint={
                            "How wide the bar is. Narrow it and the words that no longer fit move into the menu at its end; widen it and they come back."
                        }
                        controls={"Sets the width of the box the menubar fills"}
                    >
                        <PageNumberField
                            value={barWidth}
                            min={MenubarKnobs.MIN_BAR_WIDTH}
                            max={MenubarKnobs.MAX_BAR_WIDTH}
                            step={MenubarKnobs.BAR_WIDTH_STEP}
                            ariaLabel={"Bar width in pixels"}
                            onInput={setBarWidth}
                        />
                    </PageProp>
                )}
            >
                <OverflowDocsExample barWidth={barWidth} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the words run from the right, and the left arrow moves on to the next word. Each menu hangs from the right edge of its word, and its submenus open to the left, where the left arrow opens them."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>
        </>
    );
};
