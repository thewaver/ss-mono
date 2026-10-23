import { createMemo, createSignal } from "solid-js";

import {
    AUTOMATIC_TABS,
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    HOVER_PILL_TABS,
    REACHABLE_TABS,
} from "@thewaver/ss-playground/App/Pages/TabsPage/TabsPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { AllDisabledExample } from "./Examples/AllDisabled";
import { CLEARABLE_TRANSITION_DURATION_MS, ClearableExample } from "./Examples/Clearable";
import { ColumnExample } from "./Examples/Column";
import { HoneycombExample } from "./Examples/Honeycomb";
import { LinkComponentExample } from "./Examples/LinkComponent";
import { LinksExample } from "./Examples/Links";
import { RightToLeftExample } from "./Examples/RightToLeft";
import { RowExample } from "./Examples/Row";
import { SwitchedDirectionExample } from "./Examples/SwitchedDirection";

export const TabsPage = () => {
    const [getRowValue, setRowValue] = createSignal("Render");
    const [getColumnValue, setColumnValue] = createSignal("Overview");
    const [getLinkValue, setLinkValue] = createSignal("Docs");
    const [getCustomLinkValue, setCustomLinkValue] = createSignal("Docs");
    const [getAutoValue, setAutoValue] = createSignal("Render");
    const [getReachableValue, setReachableValue] = createSignal("Render");
    const [getHoverPillValue, setHoverPillValue] = createSignal("Render");
    const [getRightToLeftValue, setRightToLeftValue] = createSignal("Render");
    const [getSwitchedDirectionValue, setSwitchedDirectionValue] = createSignal("Render");
    const [getDisabledValue, setDisabledValue] = createSignal("Draft");
    const [getClearableValue, setClearableValue] = createSignal<string | undefined>("One");
    const [getHoneycombValue, setHoneycombValue] = createSignal("Overview");

    const getExamples = createMemo(() => [
        {
            key: "row",
            span: 2,
            name: EXAMPLE_NAMES.row,
            readout: () => `selected: ${getRowValue()}`,
            component: () => <RowExample selectedValue={getRowValue} onSelectionChange={setRowValue} />,
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
        {
            key: "column",
            span: 2,
            name: EXAMPLE_NAMES.column,
            readout: () => `selected: ${getColumnValue()}`,
            component: () => <ColumnExample selectedValue={getColumnValue} onSelectionChange={setColumnValue} />,
            path: `${EXAMPLES_ROOT}/Column.tsx`,
        },
        {
            key: "automatic",
            span: 2,
            name: EXAMPLE_NAMES.automatic,
            readout: () =>
                `selected: ${getAutoValue()} — an arrow both moves the focus and takes the selection with it, which suits a panel that is already loaded`,
            component: () => (
                <RowExample
                    selectedValue={getAutoValue}
                    tabs={AUTOMATIC_TABS}
                    idPrefix={"automatic"}
                    hasAutoActivation={true}
                    onSelectionChange={setAutoValue}
                />
            ),
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
        {
            key: "hoverPill",
            span: 2,
            name: EXAMPLE_NAMES.hoverPill,
            readout: () =>
                `selected: ${getHoverPillValue()} — the underline stays on the selected tab while a second marker glides to whichever tab the pointer or the focus is on`,
            component: () => (
                <RowExample
                    selectedValue={getHoverPillValue}
                    tabs={HOVER_PILL_TABS}
                    idPrefix={"hoverPill"}
                    hasHoverPill={true}
                    onSelectionChange={setHoverPillValue}
                />
            ),
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
        {
            key: "reachable",
            span: 2,
            name: EXAMPLE_NAMES.reachable,
            readout: () =>
                `selected: ${getReachableValue()} — Metrics is disabled but stays in the arrow walk, so focus lands on it and a reader hears that it is unavailable; pressing it still selects nothing`,
            component: () => (
                <RowExample
                    selectedValue={getReachableValue}
                    tabs={REACHABLE_TABS}
                    idPrefix={"reachable"}
                    onSelectionChange={setReachableValue}
                />
            ),
            path: `${EXAMPLES_ROOT}/Row.tsx`,
        },
        {
            key: "rightToLeft",
            span: 2,
            name: EXAMPLE_NAMES.rightToLeft,
            readout: () =>
                `selected: ${getRightToLeftValue()} — the box around the tabs sets dir="rtl", so they run from the right and the left arrow moves on to the next tab`,
            component: () => (
                <RightToLeftExample selectedValue={getRightToLeftValue} onSelectionChange={setRightToLeftValue} />
            ),
            path: `${EXAMPLES_ROOT}/RightToLeft.tsx`,
        },
        {
            key: "switchedDirection",
            span: 2,
            name: EXAMPLE_NAMES.switchedDirection,
            readout: () =>
                `selected: ${getSwitchedDirectionValue()} — the example's settings switch the box around the tabs to dir="rtl" and back, and the arrows follow the row as it turns round`,
            component: () => (
                <SwitchedDirectionExample
                    selectedValue={getSwitchedDirectionValue}
                    onSelectionChange={setSwitchedDirectionValue}
                />
            ),
            path: `${EXAMPLES_ROOT}/SwitchedDirection.tsx`,
        },
        {
            key: "links",
            name: EXAMPLE_NAMES.links,
            readout: () => `selected: ${getLinkValue()} — every tab carries an href, so each one is an anchor`,
            component: () => <LinksExample selectedValue={getLinkValue} onSelectionChange={setLinkValue} />,
            path: `${EXAMPLES_ROOT}/Links.tsx`,
        },
        {
            key: "linkComponent",
            name: EXAMPLE_NAMES.linkComponent,
            readout: () =>
                `selected: ${getCustomLinkValue()} — the same tabs rendered by a consumer's own link component`,
            component: () => (
                <LinkComponentExample selectedValue={getCustomLinkValue} onSelectionChange={setCustomLinkValue} />
            ),
            path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
        },
        {
            key: "clearable",
            name: EXAMPLE_NAMES.clearable,
            readout: () =>
                `selected: ${getClearableValue() ?? "nothing"} — the floater plays itself out over ${CLEARABLE_TRANSITION_DURATION_MS}ms when the selection goes, and plays itself back in when one returns`,
            component: () => (
                <ClearableExample
                    selectedValue={getClearableValue}
                    onSelectionChange={setClearableValue}
                    onClear={() => setClearableValue(undefined)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Clearable.tsx`,
        },
        {
            key: "disabled",
            name: EXAMPLE_NAMES.disabled,
            readout: () => `selected: ${getDisabledValue()} — nothing can move it, so no tab holds the tab stop`,
            component: () => (
                <AllDisabledExample selectedValue={getDisabledValue} onSelectionChange={setDisabledValue} />
            ),
            path: `${EXAMPLES_ROOT}/AllDisabled.tsx`,
        },
        {
            key: "honeycomb",
            span: 2,
            name: EXAMPLE_NAMES.honeycomb,
            readout: () =>
                `selected: ${getHoneycombValue()} — the same tab list, placed by a layout that has no angle in it at all`,
            component: () => (
                <HoneycombExample selectedValue={getHoneycombValue} onSelectionChange={setHoneycombValue} />
            ),
            path: `${EXAMPLES_ROOT}/Honeycomb.tsx`,
        },
    ]);

    return <PageExamples items={getExamples} />;
};
