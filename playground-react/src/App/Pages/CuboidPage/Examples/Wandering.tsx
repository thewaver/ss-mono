import { useEffect, useRef } from "react";

import type { CuboidFace } from "@thewaver/ss-components-react";
import { Cuboid, CuboidUtils, useLatest } from "@thewaver/ss-components-react";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
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
    const latestProps = useLatest(props);
    const previousFacingRef = useRef<CuboidFace | undefined>(undefined);

    useEffect(() => {
        const turnIntervalMs = props.turnIntervalMs;

        if (turnIntervalMs === undefined || turnIntervalMs <= 0) return;

        const turnToNeighbor = () => {
            const [yaw, setYaw] = latestProps.current.yaw;
            const [pitch, setPitch] = latestProps.current.pitch;

            const facing = CuboidUtils.getFacingFromTurns(yaw, pitch);
            const neighbors = TURNS.map(
                ([yawTurn, pitchTurn]) =>
                    [CuboidUtils.getFacingFromTurns(yaw + yawTurn, pitch + pitchTurn), yawTurn, pitchTurn] as const,
            ).filter(([turned]) => turned !== facing);
            const unvisited = neighbors.filter(([turned]) => turned !== previousFacingRef.current);
            const [[, yawTurn, pitchTurn]] = ObjectUtils.getRandomArrayValues(
                unvisited.length > 0 ? unvisited : neighbors,
            );

            previousFacingRef.current = facing;

            setYaw(yaw + yawTurn);
            setPitch(pitch + pitchTurn);
        };

        const timer = setInterval(turnToNeighbor, turnIntervalMs);

        return () => {
            clearInterval(timer);
        };
    }, [props.turnIntervalMs, latestProps]);

    return (
        <PageCuboidStack>
            <Cuboid
                yaw={props.yaw}
                pitch={props.pitch}
                size={props.size}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Six faces, turning by themselves"}
                computeFaceLabel={computeCuboidFaceLabel}
                renderFace={(face, state) => <PageCuboidFace face={face} state={state} />}
            />
        </PageCuboidStack>
    );
};
