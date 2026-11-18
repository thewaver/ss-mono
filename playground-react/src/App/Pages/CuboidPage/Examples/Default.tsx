import { Button, Cuboid } from "@thewaver/ss-components-react";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    TURN_BOTTOM_TOWARDS_YOU_TEXT,
    TURN_LEFT_FACE_TOWARDS_TEXT,
    TURN_RIGHT_FACE_TOWARDS_TEXT,
    TURN_TOP_TOWARDS_YOU_TEXT,
} from "@thewaver/ss-playground/App/Pages/CuboidPage/CuboidPage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
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
            <PageMeasureBox>
                <Cuboid
                    yaw={props.yaw}
                    pitch={props.pitch}
                    size={props.size}
                    transitionDurationMs={props.transitionDurationMs}
                    ariaLabel={"Six faces"}
                    computeFaceLabel={computeCuboidFaceLabel}
                    renderFace={(face, state) => <PageCuboidFace face={face} state={state} />}
                />
            </PageMeasureBox>

            <PageCuboidPad>
                <div />
                {renderTurn("pitchUp", TURN_TOP_TOWARDS_YOU_TEXT, CONTROL_GLYPHS.up, () => {
                    setPitch(pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("yawLeft", TURN_LEFT_FACE_TOWARDS_TEXT, CONTROL_GLYPHS.left, () => {
                    setYaw(yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("yawRight", TURN_RIGHT_FACE_TOWARDS_TEXT, CONTROL_GLYPHS.right, () => {
                    setYaw(yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("pitchDown", TURN_BOTTOM_TOWARDS_YOU_TEXT, CONTROL_GLYPHS.down, () => {
                    setPitch(pitch - QUARTER_TURN);
                })}
                <div />
            </PageCuboidPad>
        </PageCuboidStack>
    );
};
