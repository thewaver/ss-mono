import { createSignal } from "solid-js";

import { Button, OverheadWheel, ProximityEffectUtils, access } from "@thewaver/ss-components";
import type { WheelController } from "@thewaver/ss-components";

import {
    PageWheelCenter,
    PageWheelPip,
    PageWheelSpin,
    PageWheelStack,
    PageWheelWedge,
} from "../../../../StyledComponents/WheelContent/WheelContent";
import { PRIZE_WHEEL_RING, pickPrizeIndex } from "../../Wheels.const";
import type { WheelExampleProps } from "../../Wheels.types";

type Props = WheelExampleProps;

export const OverheadExample = ({ wedges, ...otherProps }: Props) => {
    const getWedges = () => access(wedges);

    const [getController, setController] = createSignal<WheelController>();

    return (
        <PageWheelStack>
            <OverheadWheel
                {...otherProps}
                wedges={getWedges}
                ariaLabel={"Prize wheel"}
                computeLayout={PRIZE_WHEEL_RING}
                computeEffect={ProximityEffectUtils.glow}
                computeSpinTarget={() => pickPrizeIndex(getWedges().length)}
                computeWedgeLabel={(index) => `${getWedges()[index]}, ${index + 1} of ${getWedges().length}`}
                renderWedge={(getWedge, getState) => <PageWheelWedge state={getState}>{getWedge()}</PageWheelWedge>}
                onMount={setController}
            />

            <PageWheelPip side={"top"} />

            <PageWheelCenter>
                <Button
                    id={"overheadSpin"}
                    ariaLabel={"Spin the wheel"}
                    isDisabled={() => !getController()?.getIsSpinnable()}
                    renderContent={(getFlags) => (
                        <PageWheelSpin flags={getFlags} phase={() => getController()?.getPhase()} />
                    )}
                    onClick={() => {
                        getController()?.spin();
                    }}
                />
            </PageWheelCenter>
        </PageWheelStack>
    );
};
