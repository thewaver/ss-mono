import { Scroller, Tabs, access } from "@thewaver/ss-components-solid";
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
        <div class={styles.demo}>
            <Scroller
                gap={() => SCROLLER_GAP}
                padding={() => FOCUS_RING_WIDTH}
                renderButton={(getStep, stepper) => <PageScrollerButton step={getStep} stepper={stepper} />}
            >
                <Tabs
                    orientation={"horizontal"}
                    tabGap={() => TAB_GAP}
                    ariaLabel={"Months"}
                    tabs={props.tabs}
                    selectedValue={props.selectedValue}
                    onSelectionChange={props.onSelectionChange}
                    renderGutter={() => <PageTabGutter orientation={"horizontal"} />}
                    renderSelectionFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                        <PageTabFloater
                            orientation={"horizontal"}
                            visibilityTarget={getVisibilityTarget}
                            transitionDurationMs={getTransitionDurationMs}
                        />
                    )}
                    renderTab={(getTab, getFlags) => (
                        <PageTabContent
                            flags={getFlags}
                            orientation={"horizontal"}
                            isSelected={() => getTab().value === access(props.selectedValue)}
                        >
                            {getTab().value}
                        </PageTabContent>
                    )}
                />
            </Scroller>
        </div>
    );
};
