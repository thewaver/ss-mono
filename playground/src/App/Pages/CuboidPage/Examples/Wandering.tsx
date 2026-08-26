import { createEffect, onCleanup } from "solid-js";

import type { CuboidFace } from "@thewaver/ss-components";
import { Cuboid, CuboidUtils, access } from "@thewaver/ss-components";
import { ObjectUtils } from "@thewaver/ss-utils";

import { PageCuboidFace, PageCuboidStack } from "../../../StyledComponents/CuboidContent/CuboidContent";
import type { CuboidWanderingExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

const TURNS: [number, number][] = [
    [QUARTER_TURN, 0],
    [-QUARTER_TURN, 0],
    [0, QUARTER_TURN],
    [0, -QUARTER_TURN],
];

type Props = CuboidWanderingExampleProps;

export const WanderingExample = (props: Props) => {
    const [getYaw, setYaw] = props.yawSignal;
    const [getPitch, setPitch] = props.pitchSignal;

    let previousFacing: CuboidFace | undefined;

    const turnToNeighbour = () => {
        const facing = CuboidUtils.getFacing(getYaw(), getPitch());
        const neighbours = TURNS.map(
            ([yaw, pitch]) => [CuboidUtils.getFacing(getYaw() + yaw, getPitch() + pitch), yaw, pitch] as const,
        ).filter(([turned]) => turned !== facing);
        const unvisited = neighbours.filter(([turned]) => turned !== previousFacing);
        const [[, yawTurn, pitchTurn]] = ObjectUtils.getRandomArrayValues(
            unvisited.length > 0 ? unvisited : neighbours,
        );

        previousFacing = facing;

        setYaw((yaw) => yaw + yawTurn);
        setPitch((pitch) => pitch + pitchTurn);
    };

    createEffect(() => {
        const turnIntervalMs = access(props.turnIntervalMs);

        if (turnIntervalMs === undefined || turnIntervalMs <= 0) return;

        const timer = setInterval(turnToNeighbour, turnIntervalMs);

        onCleanup(() => {
            clearInterval(timer);
        });
    });

    return (
        <PageCuboidStack>
            <Cuboid
                yawSignal={props.yawSignal}
                pitchSignal={props.pitchSignal}
                size={props.size}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Six faces, turning by themselves"}
                renderFace={(getFace, getState) => <PageCuboidFace face={getFace} state={getState} />}
            />
        </PageCuboidStack>
    );
};
