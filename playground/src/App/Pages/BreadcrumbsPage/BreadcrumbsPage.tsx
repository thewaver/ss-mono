import { createMemo, createSignal } from "solid-js";

import type { Breadcrumb } from "@thewaver/ss-components";
import { Button } from "@thewaver/ss-components";

import { BreadcrumbKnobs } from "../../Knobs/Breadcrumbs.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import { TRAIL } from "./BreadcrumbsPage.const";
import type { BreadcrumbsExampleProps, CrumbValue } from "./BreadcrumbsPage.types";
import { BareExample } from "./Examples/Bare";
import { LinkComponentExample } from "./Examples/LinkComponent";
import { LinkedExample } from "./Examples/Linked";
import { TrailExample } from "./Examples/Trail";

const DEPTH_FIELD_WIDTH = 90;
const EXAMPLES_ROOT = "/src/App/Pages/BreadcrumbsPage/Examples";

export const BreadcrumbsPage = () => {
    const [getDepth, setDepth] = createSignal(BreadcrumbKnobs.STARTING_DEPTH);
    const [getIsDisabled, setIsDisabled] = createSignal(BreadcrumbKnobs.STARTING_IS_DISABLED);

    const [getPressed, setPressed] = createSignal<CrumbValue | undefined>(undefined);
    const [getLinkPressed, setLinkPressed] = createSignal<CrumbValue | undefined>(undefined);

    const getCrumbs = createMemo<Breadcrumb<CrumbValue>[]>(() =>
        TRAIL.slice(0, getDepth()).map((entry) => ({ value: entry.value, isDisabled: getIsDisabled() })),
    );

    const getLinkCrumbs = createMemo<Breadcrumb<CrumbValue>[]>(() =>
        TRAIL.slice(0, getDepth()).map((entry) => ({
            value: entry.value,
            href: `#breadcrumb-${entry.value}`,
            isDisabled: getIsDisabled(),
        })),
    );

    const navigate = (value: CrumbValue) => {
        setDepth(TRAIL.findIndex((entry) => entry.value === value) + 1);
    };

    const reset = () => {
        setDepth(BreadcrumbKnobs.STARTING_DEPTH);
        setPressed(undefined);
        setLinkPressed(undefined);
    };

    const getExamples = createMemo(() => {
        const commonProps: BreadcrumbsExampleProps = { crumbs: getCrumbs };

        return [
            {
                key: "default",
                name: "Default",
                readout: () =>
                    `pressed: ${getPressed() ?? "nothing yet"} — pressing a crumb moves the page there, so the trail behind it is the whole trail; Reset puts it back`,
                component: () => (
                    <TrailExample
                        {...commonProps}
                        onSelect={(value) => {
                            setPressed(value);
                            navigate(value);
                        }}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Trail.tsx`,
            },
            {
                key: "bare",
                name: "No separator",
                readout: () => "a trail with nothing between the crumbs, since the separator slot is optional",
                component: () => <BareExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Bare.tsx`,
            },
            {
                key: "linked",
                name: "Crumbs that are links",
                readout: () => `pressed: ${getLinkPressed() ?? "nothing yet"} — an href makes a crumb an anchor`,
                component: () => (
                    <LinkedExample
                        crumbs={getLinkCrumbs}
                        onSelect={(value) => {
                            setLinkPressed(value);
                            navigate(value);
                        }}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Linked.tsx`,
            },
            {
                key: "linkComponent",
                name: "Links through a component",
                readout: () => "the same links rendered by a consumer's own link component",
                component: () => <LinkComponentExample crumbs={getLinkCrumbs} />,
                path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"depth"}
                    label={"Depth"}
                    hint={"How many crumbs the trail holds. Past what fits, the middle ones collapse behind a menu."}
                >
                    <PageNumberField
                        value={getDepth}
                        min={() => BreadcrumbKnobs.MIN_DEPTH}
                        max={() => BreadcrumbKnobs.MAX_DEPTH}
                        step={() => BreadcrumbKnobs.DEPTH_STEP}
                        width={() => DEPTH_FIELD_WIDTH}
                        ariaLabel={"Depth"}
                        onInput={setDepth}
                    />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns every crumb off. A disabled crumb stays readable and keeps its tooltip."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    key={"trail"}
                    label={"Trail"}
                    hint={
                        "Puts the trail back to the crumb it started on, undoing wherever the examples have navigated to."
                    }
                >
                    <Button
                        renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
