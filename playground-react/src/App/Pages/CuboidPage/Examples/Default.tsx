import { Button, Cuboid } from "@thewaver/ss-components-react";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import { PageCuboidFace, PageCuboidPad, PageCuboidStack } from "../../../StyledComponents/CuboidContent/CuboidContent";
import type { CuboidExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

type Props = CuboidExampleProps;

export const DefaultExample = (props: Props) => {
    const [yaw, setYaw] = props.yawState;
    const [pitch, setPitch] = props.pitchState;

    const renderTurn = (id: string, label: string, glyph: string, turn: () => void) => (
        <Button
            id={id}
            ariaLabel={label}
            renderContent={(flags) => <PageButtonContent flags={flags}>{glyph}</PageButtonContent>}
            onClick={turn}
        />
    );

    return (
        <PageCuboidStack>
            <Cuboid
                yawState={props.yawState}
                pitchState={props.pitchState}
                size={props.size}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Six faces"}
                computeFaceLabel={computeCuboidFaceLabel}
                renderFace={(face, state) => <PageCuboidFace face={face} state={state} />}
            />

            <PageCuboidPad>
                <div />
                {renderTurn("pitchUp", "Turn the top towards you", "↑", () => {
                    setPitch(pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("yawLeft", "Turn the left face towards you", "←", () => {
                    setYaw(yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("yawRight", "Turn the right face towards you", "→", () => {
                    setYaw(yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("pitchDown", "Turn the bottom towards you", "↓", () => {
                    setPitch(pitch - QUARTER_TURN);
                })}
                <div />
            </PageCuboidPad>
        </PageCuboidStack>
    );
};
