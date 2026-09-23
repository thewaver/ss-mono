import { For, createSignal } from "solid-js";

import { Button, DrumWheel, access } from "@thewaver/ss-components";
import type { WheelController } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import { PageMeasureBox } from "../../../../PageComponents/MeasureBox/MeasureBox";
import { PageButtonContent } from "../../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageWheelBar,
    PageWheelCard,
    PageWheelMount,
    PageWheelPip,
} from "../../../../StyledComponents/WheelContent/WheelContent";
import { PRIZE_FETCH_DELAY_MS } from "../../Wheels.const";
import type { WheelReelsExampleProps } from "../../Wheels.types";

import * as styles from "../DrumWheelPage.css";

const WEDGE_SIZE: Size2d = { width: 110, height: 56 };
const REEL_COUNT = 3;
const STAGGER_MS = 600;
const NONE_LEFT = 0;
const REELS = Array.from({ length: REEL_COUNT }, (_unused, reel) => reel);

const fetchResult = (wedgeCount: number) =>
    new Promise<number[]>((resolve) => {
        setTimeout(() => resolve(REELS.map(() => Math.floor(Math.random() * wedgeCount))), PRIZE_FETCH_DELAY_MS);
    });

type Props = WheelReelsExampleProps;

export const ReelsExample = ({ wedges, spinDurationMs, onSpinStart, onAllStopped, ...otherProps }: Props) => {
    const getWedges = () => access(wedges);

    const [getControllers, setControllers] = createSignal<WheelController[]>([]);

    let result: Promise<number[]> = Promise.resolve([]);
    let stopped: number[] = [];
    let stillSpinning = NONE_LEFT;

    const getIsSpinnable = () => REELS.every((reel) => getControllers()[reel]?.getIsSpinnable() === true);

    const spinAll = () => {
        result = fetchResult(getWedges().length);
        stopped = [];
        stillSpinning = getControllers().filter((controller) => controller.spin()).length;

        onSpinStart();
    };

    const handleSpinEnd = (reel: number, index: number) => {
        if (stillSpinning === NONE_LEFT) return;

        stopped[reel] = index;
        stillSpinning -= 1;

        if (stillSpinning === NONE_LEFT) onAllStopped([...stopped]);
    };

    return (
        <>
            <PageMeasureBox>
                <PageWheelMount>
                    <div class={styles.reelRow}>
                        <For each={REELS}>
                            {(reel) => (
                                <DrumWheel
                                    {...otherProps}
                                    wedges={getWedges}
                                    axis={"column"}
                                    wedgeSize={() => WEDGE_SIZE}
                                    spinDurationMs={() => access(spinDurationMs) + reel * STAGGER_MS}
                                    ariaLabel={`Reel ${reel + 1} of ${REEL_COUNT}`}
                                    computeSpinTarget={() => result.then((indices) => indices[reel])}
                                    computeWedgeLabel={(index) =>
                                        `${getWedges()[index]}, ${index + 1} of ${getWedges().length}`
                                    }
                                    renderWedge={(getWedge, getState) => (
                                        <PageWheelCard state={getState}>{getWedge()}</PageWheelCard>
                                    )}
                                    renderWedgeBack={(_getWedge, getState) => <PageWheelCard state={getState} />}
                                    onSpinEnd={(index) => handleSpinEnd(reel, index)}
                                    onMount={(controller) =>
                                        setControllers((controllers) => {
                                            const next = [...controllers];

                                            next[reel] = controller;

                                            return next;
                                        })
                                    }
                                />
                            )}
                        </For>
                    </div>

                    <PageWheelPip side={"left"} />
                </PageWheelMount>
            </PageMeasureBox>

            <PageWheelBar>
                <Button
                    id={"reelsSpin"}
                    ariaLabel={"Spin all three reels"}
                    isDisabled={() => !getIsSpinnable()}
                    renderContent={(getFlags) => <PageButtonContent flags={getFlags}>Spin</PageButtonContent>}
                    onClick={() => {
                        spinAll();
                    }}
                />
            </PageWheelBar>
        </>
    );
};
