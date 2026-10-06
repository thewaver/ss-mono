import { Button, Cuboid } from "@thewaver/ss-components-react";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import { PageCuboidFace, PageCuboidPad, PageCuboidStack } from "../../../StyledComponents/CuboidContent/CuboidContent";
import type { CuboidExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

type Props = CuboidExampleProps;

export const DefaultExample = (props: Props) => {
    const [yaw, setYaw] = props.yaw;
    const [pitch, setPitch] = props.pitch;

    const renderTurn = (id: string, label: string, glyph: string, turn: () => void) => (
        <Button
            id={id}
            ariaLabel={label}
            renderContent={(flags) => <PageControlButtonContent flags={flags} glyph={glyph} />}
            onClick={turn}
        />
    );

    return (
        <PageCuboidStack>
            <Cuboid
                yaw={props.yaw}
                pitch={props.pitch}
                size={props.size}
                transitionDurationMs={props.transitionDurationMs}
                ariaLabel={"Six faces"}
                computeFaceLabel={computeCuboidFaceLabel}
                renderFace={(face, state) => <PageCuboidFace face={face} state={state} />}
            />

            <PageCuboidPad>
                <div />
                {renderTurn("pitchUp", "Turn the top towards you", CONTROL_GLYPHS.up, () => {
                    setPitch(pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("yawLeft", "Turn the left face towards you", CONTROL_GLYPHS.left, () => {
                    setYaw(yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("yawRight", "Turn the right face towards you", CONTROL_GLYPHS.right, () => {
                    setYaw(yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("pitchDown", "Turn the bottom towards you", CONTROL_GLYPHS.down, () => {
                    setPitch(pitch - QUARTER_TURN);
                })}
                <div />
            </PageCuboidPad>
        </PageCuboidStack>
    );
};
