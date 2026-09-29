import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

import { Tabs } from "@thewaver/ss-components-react";
import type { TabLinkProps } from "@thewaver/ss-components-react";
import {
    PAGE_VIEW_KEYS,
    PAGE_VIEW_LABELS,
    toPageViewKey,
    toPageViewRoute,
} from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.const";
import * as styles from "@thewaver/ss-playground/App/PageComponents/ViewTabs/ViewTabs.css";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../StyledComponents/TabContent/TabContent";
import { PageRouterLink } from "../RouterLink/RouterLink";
import type { PageViewKey, PageViewTabsProps } from "./ViewTabs.types";

const TAB_GAP = 20;
const TAB_ORIENTATION = "horizontal";
const EXAMPLES_VIEW: PageViewKey = "examples";

const PageViewTabLink = (props: TabLinkProps) => (
    <PageRouterLink {...props} replace={true} data-view-tab={props.href} />
);

export const PageViewTabs = (props: PageViewTabsProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const selected = toPageViewKey(location.pathname, props.baseRoute);

    const tabs = useMemo(
        () =>
            PAGE_VIEW_KEYS.filter((key) => props.hasExamples || key !== EXAMPLES_VIEW).map((key) => ({
                value: key,
                href: toPageViewRoute(props.baseRoute, key),
            })),
        [props.baseRoute, props.hasExamples],
    );

    return (
        <div className={styles.viewTabs} data-view-tabs="">
            <Tabs
                orientation={TAB_ORIENTATION}
                tabGap={TAB_GAP}
                ariaLabel={"Page views"}
                tabs={tabs}
                selectedValue={selected}
                linkComponent={PageViewTabLink}
                renderGutter={() => <PageTabGutter orientation={TAB_ORIENTATION} />}
                renderFloater={(visibilityTarget, transitionDurationMs) => (
                    <PageTabFloater
                        orientation={TAB_ORIENTATION}
                        visibilityTarget={visibilityTarget}
                        transitionDurationMs={transitionDurationMs}
                    />
                )}
                renderTab={(tab, flags) => (
                    <PageTabContent flags={flags} orientation={TAB_ORIENTATION} isSelected={tab.value === selected}>
                        {PAGE_VIEW_LABELS[tab.value]}
                    </PageTabContent>
                )}
                onSelectionChange={(key) => navigate(toPageViewRoute(props.baseRoute, key))}
            />
        </div>
    );
};
