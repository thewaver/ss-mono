import { createSignal, createUniqueId } from "solid-js";

import { WheelMenu, access } from "@thewaver/ss-components-solid";
import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
import {
    LAYOUT_SIZE,
    LEVEL_GAP,
    NOTHING_RUN,
} from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/Menus/WheelMenuPage/WheelMenuPage.css";

import { PageMenuTriggerContent } from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent";
import {
    ACTIONS,
    CLOSER_DEFS,
    PageWheelGradientDefs,
    createWheelItemRenderer,
    renderWheelPopup,
} from "../WheelMenuPageSolid.const";
import type { WheelMenuBasicDocsExampleProps } from "../WheelMenuPageSolid.types";

type Props = WheelMenuBasicDocsExampleProps;

export const BasicDocsExample = (props: Props) => {
    const gradientId = createUniqueId();

    const [getLastRun, setLastRun] = createSignal(NOTHING_RUN);

    return (
        <>
            <div class={styles.stage}>
                <PageWheelGradientDefs gradientId={gradientId} />

                <WheelMenu
                    layoutSize={LAYOUT_SIZE}
                    items={ACTIONS}
                    ariaLabel={"Edit actions"}
                    spreadDegrees={props.spreadDegrees}
                    holeRadius={props.holeRadius}
                    bandWidth={props.bandWidth}
                    layoutDefs={{ wedgeGapDegrees: access(props.wedgeGapDegrees) }}
                    levelGap={LEVEL_GAP}
                    placement={{ x: "center", y: "center" }}
                    closerDefs={CLOSER_DEFS}
                    renderContent={(getFlags) => (
                        <PageMenuTriggerContent flags={getFlags}>Wheel</PageMenuTriggerContent>
                    )}
                    renderItem={createWheelItemRenderer(gradientId)}
                    renderPopup={renderWheelPopup}
                    onActivate={(action) => setLastRun(action.name)}
                />
            </div>

            <div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${getLastRun()}`}</div>
        </>
    );
};
