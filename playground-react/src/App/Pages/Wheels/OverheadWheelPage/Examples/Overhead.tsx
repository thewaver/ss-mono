import { useState, useSyncExternalStore } from "react";

import { Button, OverheadWheel, ProximityEffectUtils } from "@thewaver/ss-components-react";
import type { WheelController } from "@thewaver/ss-components-react";
import { PRIZE_WHEEL_RING, pickPrizeIndex } from "@thewaver/ss-playground/App/Pages/Wheels/Wheels.const";

import {
    PageWheelCenter,
    PageWheelPip,
    PageWheelSpin,
    PageWheelStack,
    PageWheelWedge,
} from "../../../../StyledComponents/WheelContent/WheelContent";
import type { WheelExampleProps } from "../../Wheels.types";

const NO_SUBSCRIPTION = () => () => {};

type Props = WheelExampleProps;

export const OverheadExample = (props: Props) => {
    const { wedges, ...otherProps } = props;

    const [controller, setController] = useState<WheelController>();

    const isSpinnable = useSyncExternalStore(
        controller?.subscribe ?? NO_SUBSCRIPTION,
        () => controller?.getIsSpinnable() ?? false,
    );

    const phase = useSyncExternalStore(controller?.subscribe ?? NO_SUBSCRIPTION, () => controller?.getPhase());

    return (
        <PageWheelStack>
            <OverheadWheel
                {...otherProps}
                wedges={props.wedges}
                ariaLabel={"Prize wheel"}
                computeLayout={PRIZE_WHEEL_RING}
                computeEffect={ProximityEffectUtils.glow}
                computeSpinTarget={() => pickPrizeIndex(props.wedges.length)}
                computeWedgeLabel={(index) => `${props.wedges[index]}, ${index + 1} of ${props.wedges.length}`}
                renderWedge={(wedge, state) => <PageWheelWedge state={state}>{wedge}</PageWheelWedge>}
                onMount={setController}
            />

            <PageWheelPip side={"top"} />

            <PageWheelCenter>
                <Button
                    id={"overheadSpin"}
                    ariaLabel={"Spin the wheel"}
                    isDisabled={!isSpinnable}
                    renderContent={(flags) => <PageWheelSpin flags={flags} phase={phase} />}
                    onClick={() => {
                        controller?.spin();
                    }}
                />
            </PageWheelCenter>
        </PageWheelStack>
    );
};
