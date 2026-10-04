import { Scroller, Tabs } from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/ScrollerPage/ScrollerPage.css";
import { FOCUS_RING_WIDTH } from "@thewaver/ss-playground/App/Theme.css";

import { PageScrollerButton } from "../../../PageComponents/ScrollerButton/ScrollerButton";
import { PageTabContent, PageTabFloater, PageTabGutter } from "../../../StyledComponents/TabContent/TabContent";
import type { ScrollerTabbedExampleProps } from "../ScrollerPage.types";

const SCROLLER_GAP = 10;
const TAB_GAP = 10;

type Props = ScrollerTabbedExampleProps;

export const TabbedExample = (props: Props) => {
    return (
        <div className={styles.demo}>
            <Scroller
                gap={SCROLLER_GAP}
                padding={FOCUS_RING_WIDTH}
                renderButton={(step, stepper) => <PageScrollerButton step={step} stepper={stepper} />}
            >
                <Tabs
                    orientation={"horizontal"}
                    tabGap={TAB_GAP}
                    ariaLabel={"Months"}
                    tabs={props.tabs}
                    selectedValue={props.selectedValue}
                    onSelectionChange={props.onSelectionChange}
                    renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                    renderSelectionFloater={(visibilityTarget, transitionDurationMs) => (
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
                            isSelected={tab.value === props.selectedValue}
                        >
                            {tab.value}
                        </PageTabContent>
                    )}
                />
            </Scroller>
        </div>
    );
};
