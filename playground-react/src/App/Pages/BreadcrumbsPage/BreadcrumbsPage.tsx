import { useMemo, useState } from "react";

import type { Breadcrumb } from "@thewaver/ss-components-react";
import { Button } from "@thewaver/ss-components-react";
import { BreadcrumbKnobs } from "@thewaver/ss-playground-core/App/Knobs/Breadcrumbs.const";
import type { CrumbValue } from "@thewaver/ss-playground-core/App/Pages/BreadcrumbsPage/BreadcrumbTrail.types";
import { TRAIL } from "@thewaver/ss-playground-core/App/Pages/BreadcrumbsPage/BreadcrumbsPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageButtonContent } from "../../StyledComponents/ButtonContent/ButtonContent";
import type { BreadcrumbsExampleProps } from "./BreadcrumbsPage.types";
import { BareExample } from "./Examples/Bare";
import { LinkComponentExample } from "./Examples/LinkComponent";
import { LinkedExample } from "./Examples/Linked";
import { TrailExample } from "./Examples/Trail";

const DEPTH_FIELD_WIDTH = 90;
const EXAMPLES_ROOT = "/src/App/Pages/BreadcrumbsPage/Examples";

export const BreadcrumbsPage = () => {
    const [depth, setDepth] = useState(BreadcrumbKnobs.STARTING_DEPTH);
    const [isDisabled, setIsDisabled] = useState(BreadcrumbKnobs.STARTING_IS_DISABLED);

    const [pressed, setPressed] = useState<CrumbValue | undefined>(undefined);
    const [linkPressed, setLinkPressed] = useState<CrumbValue | undefined>(undefined);

    const crumbs = useMemo<Breadcrumb<CrumbValue>[]>(
        () => TRAIL.slice(0, depth).map((entry) => ({ value: entry.value, isDisabled })),
        [depth, isDisabled],
    );

    const linkCrumbs = useMemo<Breadcrumb<CrumbValue>[]>(
        () =>
            TRAIL.slice(0, depth).map((entry) => ({
                value: entry.value,
                href: `#breadcrumb-${entry.value}`,
                isDisabled,
            })),
        [depth, isDisabled],
    );

    const navigate = (value: CrumbValue) => {
        setDepth(TRAIL.findIndex((entry) => entry.value === value) + 1);
    };

    const reset = () => {
        setDepth(BreadcrumbKnobs.STARTING_DEPTH);
        setPressed(undefined);
        setLinkPressed(undefined);
    };

    const commonProps: BreadcrumbsExampleProps = { crumbs };

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `pressed: ${pressed ?? "nothing yet"} — pressing a crumb moves the page there, so the trail behind it is the whole trail; Reset puts it back`,
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
            readout: () => `pressed: ${linkPressed ?? "nothing yet"} — an href makes a crumb an anchor`,
            component: () => (
                <LinkedExample
                    crumbs={linkCrumbs}
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
            component: () => <LinkComponentExample crumbs={linkCrumbs} />,
            path: `${EXAMPLES_ROOT}/LinkComponent.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"depth"}
                    label={"Depth"}
                    hint={"How many crumbs the trail holds. Past what fits, the middle ones collapse behind a menu."}
                >
                    <PageNumberField
                        value={depth}
                        min={BreadcrumbKnobs.MIN_DEPTH}
                        max={BreadcrumbKnobs.MAX_DEPTH}
                        step={BreadcrumbKnobs.DEPTH_STEP}
                        width={DEPTH_FIELD_WIDTH}
                        ariaLabel={"Depth"}
                        onInput={setDepth}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns every crumb off. A disabled crumb stays readable and keeps its tooltip."}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"trail"}
                    label={"Trail"}
                    hint={
                        "Puts the trail back to the crumb it started on, undoing wherever the examples have navigated to."
                    }
                >
                    <Button
                        renderContent={(flags) => <PageButtonContent flags={flags}>Reset</PageButtonContent>}
                        onClick={async () => {
                            reset();
                        }}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
