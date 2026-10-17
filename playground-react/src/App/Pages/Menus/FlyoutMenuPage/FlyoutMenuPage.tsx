import { useMemo, useState } from "react";
import { useLocation } from "react-router";

import { FLYOUT_MENU_DEFAULTS, type FlyoutMenuEntryRecord } from "@thewaver/ss-components-react";
import { FlyoutMenuKnobs } from "@thewaver/ss-playground/App/Knobs/FlyoutMenus.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    FIELD_WIDTH,
    NOTHING_FOLLOWED,
    SHOP_ENTRIES,
} from "@thewaver/ss-playground/App/Pages/Menus/FlyoutMenuPage/FlyoutMenuPage.const";

import { PageExamples } from "../../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../../PageComponents/PropsPanel/PropsPanel";
import { NarrowExample } from "./Examples/Narrow";
import { ShopExample } from "./Examples/Shop";

export const FlyoutMenuPage = () => {
    const [hoverShowDelayMs, setHoverShowDelayMs] = useState(FLYOUT_MENU_DEFAULTS.hoverShowDelayMs);
    const [transitionDurationMs, setTransitionDurationMs] = useState(FLYOUT_MENU_DEFAULTS.transitionDurationMs);
    const location = useLocation();

    const hash = location.hash;

    const followed = hash ? `followed ${hash}` : NOTHING_FOLLOWED;

    const entries = useMemo(
        (): FlyoutMenuEntryRecord<string>[] =>
            SHOP_ENTRIES.map((entry) => ({
                ...entry,
                isCurrent: entry.href === hash,
                links: entry.links?.map((link) => ({ ...link, isCurrent: link.href === hash })),
            })),
        [hash],
    );

    const examples = [
        {
            key: "shop",
            name: EXAMPLE_NAMES.shop,
            span: 2,
            readout: () =>
                `${followed} — every entry is a link to its own page; hovering one with a panel opens it, the arrow beside it opens and closes it from the keyboard or a touch, and tabbing along the bar opens nothing`,
            component: () => (
                <ShopExample
                    entries={entries}
                    hoverShowDelayMs={hoverShowDelayMs}
                    transitionDurationMs={transitionDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Shop.tsx`,
        },
        {
            key: "narrow",
            name: EXAMPLE_NAMES.narrow,
            readout: () =>
                `${followed} — the entries that do not fit collapse into "More", where each keeps its link and its arrow, and the arrow opens its links in place`,
            component: () => (
                <NarrowExample
                    entries={entries}
                    hoverShowDelayMs={hoverShowDelayMs}
                    transitionDurationMs={transitionDurationMs}
                />
            ),
            path: `${EXAMPLES_ROOT}/Narrow.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"hoverShowDelayMs"}
                    label={"Hover delay (ms)"}
                    hint={"How long the pointer has to rest on an entry before its panel opens."}
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
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
