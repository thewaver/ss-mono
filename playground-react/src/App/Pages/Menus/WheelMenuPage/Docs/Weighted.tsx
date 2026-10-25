import { useId, useState } from "react";

import { WheelMenu } from "@thewaver/ss-components-react";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    BAND_WIDTH,
    HOLE_RADIUS,
    LAYOUT_SIZE,
    LEVEL_GAP,
    NOTHING_RUN,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    CLOSER_DEFS,
    PageWheelGradientDefs,
    WEIGHTED_ACTIONS,
    createWheelItemRenderer,
    renderWheelPopup,
} from "../WheelMenuPageReact.const";

export const WeightedDocsExample = () => {
    const gradientId = useId();

    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <div className={styles.stage}>
                <PageWheelGradientDefs gradientId={gradientId} />

                <WheelMenu
                    layoutSize={LAYOUT_SIZE}
                    items={WEIGHTED_ACTIONS}
                    ariaLabel={"Edit actions"}
                    holeRadius={HOLE_RADIUS}
                    bandWidth={BAND_WIDTH}
                    levelGap={LEVEL_GAP}
                    placement={{ x: "center", y: "center" }}
                    closerDefs={CLOSER_DEFS}
                    renderContent={(flags) => <PageMenuTriggerContent flags={flags}>Wheel</PageMenuTriggerContent>}
                    renderItem={createWheelItemRenderer(gradientId)}
                    renderPopup={renderWheelPopup}
                    onActivate={(action) => setLastRun(action.name)}
                />
            </div>

            <div className={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
        </>
    );
};
