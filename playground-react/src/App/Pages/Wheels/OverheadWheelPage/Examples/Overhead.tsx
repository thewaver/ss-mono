import { useState, useSyncExternalStore } from "react";

import { Button, OverheadWheel, ProximityEffectUtils } from "@thewaver/ss-components-react";
import type { WheelController } from "@thewaver/ss-components-react";
import { PRIZE_WHEEL_RING, pickPrizeIndex } from "@thewaver/ss-playground-core/App/Pages/Wheels/Wheels.const";

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

export const OverheadExample = ({ wedges, ...otherProps }: Props) => {
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
                wedges={wedges}
                ariaLabel={"Prize wheel"}
                computeLayout={PRIZE_WHEEL_RING}
                computeEffect={ProximityEffectUtils.glow}
                computeSpinTarget={() => pickPrizeIndex(wedges.length)}
                computeWedgeLabel={(index) => `${wedges[index]}, ${index + 1} of ${wedges.length}`}
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
