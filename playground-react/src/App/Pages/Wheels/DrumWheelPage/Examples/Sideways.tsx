import { useState, useSyncExternalStore } from "react";

import { Button, DrumWheel } from "@thewaver/ss-components-react";
import type { WheelController } from "@thewaver/ss-components-react";
import { PRIZE_DRUM_TURNING_SIDEWAYS_LABEL } from "@thewaver/ss-playground/App/Pages/Wheels/DrumWheelPage/DrumWheelPage.const";
import { pickPrizeIndex } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";
import type { Size2d } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageControlButtonContent } from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import {
    PageWheelBar,
    PageWheelCard,
    PageWheelMount,
    PageWheelPip,
} from "../../../../StyledComponents/WheelContent/WheelContent";
import type { WheelExampleProps } from "../../Wheels.types";

const WEDGE_SIZE: Size2d = { width: 160, height: 64 };
const NO_SUBSCRIPTION = () => () => {};

type Props = WheelExampleProps;

export const SidewaysExample = (props: Props) => {
    const { wedges, ...otherProps } = props;

    const [controller, setController] = useState<WheelController>();

    const isSpinnable = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getIsSpinnable() ?? false,
    );

    return (
        <>
            <PageMeasureBox>
                <PageWheelMount>
                    <DrumWheel
                        {...otherProps}
                        wedges={props.wedges}
                        axis={"row"}
                        wedgeSize={WEDGE_SIZE}
                        ariaLabel={PRIZE_DRUM_TURNING_SIDEWAYS_LABEL}
                        computeSpinTarget={() => pickPrizeIndex(props.wedges.length)}
                        computeWedgeLabel={(index) => `${props.wedges[index]}, ${index + 1} of ${props.wedges.length}`}
                        renderWedge={(wedge, state) => <PageWheelCard state={state}>{wedge}</PageWheelCard>}
                        renderWedgeBack={(_wedge, state) => <PageWheelCard state={state} />}
                        onMount={setController}
                    />

                    <PageWheelPip side={"top"} />
                </PageWheelMount>
            </PageMeasureBox>

            <PageWheelBar>
                <Button
                    id={"sidewaysSpin"}
                    ariaLabel={"Spin the wheel"}
                    isDisabled={!isSpinnable}
                    renderContent={(flags) => <PageControlButtonContent flags={flags}>Spin</PageControlButtonContent>}
                    onClick={() => {
                        controller?.spin();
                    }}
                />
            </PageWheelBar>
        </>
    );
};
