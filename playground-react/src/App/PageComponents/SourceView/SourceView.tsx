import { useEffect, useMemo, useRef, useState } from "react";

import { Accordion, Scroller, Tabs, useViewportContext } from "@thewaver/ss-components-react";
import type { AccordionItem, Tab } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/PageComponents/SourceView/SourceView.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageAccordionHeader, PageAccordionPanel } from "../../StyledComponents/AccordionContent/AccordionContent";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../StyledComponents/TabContent/TabContent";
import { PageCodeBox } from "../CodeBox/CodeBox";
import { PageScrollerButton } from "../ScrollerButton/ScrollerButton";
import { PageTabPanel } from "../TabPanel/TabPanel";
import type { SourceGroup, SourceViewProps } from "./SourceView.types";
import { SourceViewUtils } from "./SourceView.utils";

const TAB_GAP = 10;
const SECTION_GAP = 5;
const MODAL_MARGIN_HEIGHT = 80;

const getTabId = (name: string) => `source-tab-${name}`;

const getPanelId = (name: string) => `source-panel-${name}`;

export const PageSourceView = (props: SourceViewProps) => {
    const viewportContext = useViewportContext();

    const loadTokenRef = useRef(0);

    const [groups, setGroups] = useState<SourceGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<SourceGroup>();

    const expandedState = useState<string[]>([]);
    const [, setExpandedNames] = expandedState;

    const selectGroup = (group: SourceGroup | undefined) => {
        setSelectedGroup(group);
        setExpandedNames(group?.expandedNames ?? []);
    };

    const tabs = useMemo(
        (): Tab<SourceGroup>[] =>
            groups.map((group) => ({
                value: group,
                id: getTabId(group.name),
                panelId: getPanelId(group.name),
            })),
        [groups],
    );

    const items = useMemo(
        (): AccordionItem<string>[] => (selectedGroup?.files ?? []).map((file) => ({ value: file.name })),
        [selectedGroup],
    );

    const getSource = (name: string) => selectedGroup?.files.find((file) => file.name === name)?.source ?? "";

    useEffect(() => {
        const token = ++loadTokenRef.current;

        void SourceViewUtils.loadGroups(props.path).then((loaded) => {
            if (token !== loadTokenRef.current) return;

            setGroups(loaded);
            selectGroup(loaded[0]);
        });
    }, [props.path]);

    if (!selectedGroup) return null;

    return (
        <div
            className={styles.sourceViewRoot}
            style={{ maxHeight: `${viewportContext.getSize().height - MODAL_MARGIN_HEIGHT}px` }}
        >
            <div className={styles.sourceViewTabs}>
                <Scroller
                    gap={TAB_GAP}
                    padding={FOCUS_RING_WIDTH}
                    renderButton={(step, stepper) => <PageScrollerButton step={step} stepper={stepper} />}
                >
                    <Tabs
                        orientation={"horizontal"}
                        tabGap={TAB_GAP}
                        ariaLabel={"Source files"}
                        tabs={tabs}
                        selectedValue={selectedGroup}
                        onSelectionChange={selectGroup}
                        renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                        renderFloater={(visibilityTarget, transitionDurationMs) => (
                            <PageTabFloater
                                orientation={"horizontal"}
                                visibilityTarget={visibilityTarget}
                                transitionDurationMs={transitionDurationMs}
                            />
                        )}
                        renderTab={(tab, flags) => (
                            <PageTabContent
                                flags={flags}
                                orientation={"horizontal"}
                                isSelected={tab.value === selectedGroup}
                            >
                                {tab.value.name}
                            </PageTabContent>
                        )}
                    />
                </Scroller>
            </div>

            <div className={styles.sourceViewPanel}>
                <PageTabPanel id={getPanelId(selectedGroup.name)} tabId={getTabId(selectedGroup.name)}>
                    <Accordion
                        items={items}
                        expandedState={expandedState}
                        gap={SECTION_GAP}
                        renderHeader={(item, flags) => (
                            <PageAccordionHeader flags={flags}>{item.value}</PageAccordionHeader>
                        )}
                        renderPanel={(item, visibilityTarget, transitionDurationMs) => (
                            <PageAccordionPanel
                                visibilityTarget={visibilityTarget}
                                transitionDurationMs={transitionDurationMs}
                            >
                                <PageCodeBox source={getSource(item.value)} />
                            </PageAccordionPanel>
                        )}
                    />
                </PageTabPanel>
            </div>
        </div>
    );
};
