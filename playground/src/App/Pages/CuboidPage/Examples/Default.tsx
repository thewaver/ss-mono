import { Button, Cuboid } from "@thewaver/ss-components";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageCuboidFace, PageCuboidPad, PageCuboidStack } from "../../../StyledComponents/CuboidContent/CuboidContent";
import type { CuboidExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

type Props = CuboidExampleProps;

export const DefaultExample = (props: Props) => {
    const [, setYaw] = props.yawSignal;
    const [, setPitch] = props.pitchSignal;

    const renderTurn = (id: string, label: string, glyph: string, turn: () => void) => (
        <Button
            id={id}
            ariaLabel={label}
            renderContent={(getFlags) => <PageButtonContent flags={getFlags}>{glyph}</PageButtonContent>}
            onClick={turn}
        />
    );

    return (
        <PageCuboidStack>
            <Cuboid
                yawSignal={props.yawSignal}
                pitchSignal={props.pitchSignal}
                size={props.size}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Six faces"}
                renderFace={(getFace, getState) => <PageCuboidFace face={getFace} state={getState} />}
            />

            <PageCuboidPad>
                <div />
                {renderTurn("pitchUp", "Turn the top towards you", "\u2191", () => {
                    setPitch((pitch) => pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("yawLeft", "Turn the left face towards you", "\u2190", () => {
                    setYaw((yaw) => yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("yawRight", "Turn the right face towards you", "\u2192", () => {
                    setYaw((yaw) => yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("pitchDown", "Turn the bottom towards you", "\u2193", () => {
                    setPitch((pitch) => pitch - QUARTER_TURN);
                })}
                <div />
            </PageCuboidPad>
        </PageCuboidStack>
    );
};
