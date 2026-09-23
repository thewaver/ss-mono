import { createMemo } from "solid-js";

import { A, useLocation, useNavigate } from "@solidjs/router";
import { Tabs, access } from "@thewaver/ss-components";
import type { TabLinkProps } from "@thewaver/ss-components";

import { PageTabContent, PageTabFloater, PageTabGutter } from "../../StyledComponents/TabContent/TabContent";
import { PAGE_VIEW_KEYS, PAGE_VIEW_LABELS, toPageViewKey, toPageViewRoute } from "./ViewTabs.const";
import type { PageViewKey, PageViewTabsProps } from "./ViewTabs.types";

import * as styles from "./ViewTabs.css";

const TAB_GAP = 20;
const TAB_ORIENTATION = "horizontal";

const PageViewTabLink = (props: TabLinkProps) => <A {...props} data-view-tab={props.href} />;

export const PageViewTabs = (props: PageViewTabsProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const getBaseRoute = () => access(props.baseRoute);

    const getSelected = createMemo<PageViewKey>(() => toPageViewKey(location.pathname, getBaseRoute()));

    const getTabs = createMemo(() =>
        PAGE_VIEW_KEYS.map((key) => ({ value: key, href: toPageViewRoute(getBaseRoute(), key) })),
    );

    return (
        <div class={styles.viewTabs} data-view-tabs>
            <Tabs
                orientation={TAB_ORIENTATION}
                tabGap={() => TAB_GAP}
                ariaLabel={"Page views"}
                tabs={getTabs}
                selectedValue={getSelected}
                linkComponent={PageViewTabLink}
                renderGutter={() => <PageTabGutter orientation={TAB_ORIENTATION} />}
                renderFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                    <PageTabFloater
                        orientation={TAB_ORIENTATION}
                        visibilityTarget={getVisibilityTarget}
                        transitionDurationMs={getTransitionDurationMs}
                    />
                )}
                renderTab={(getTab, getFlags) => (
                    <PageTabContent
                        flags={getFlags}
                        orientation={TAB_ORIENTATION}
                        isSelected={() => getTab().value === getSelected()}
                    >
                        {PAGE_VIEW_LABELS[getTab().value]}
                    </PageTabContent>
                )}
                onSelectionChange={(key) => navigate(toPageViewRoute(getBaseRoute(), key))}
            />
        </div>
    );
};
