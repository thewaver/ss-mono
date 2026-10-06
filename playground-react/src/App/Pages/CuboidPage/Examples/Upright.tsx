import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-react";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageControlButtonContent } from "../../../StyledComponents/ControlButtonContent/ControlButtonContent";
import {
    PageCuboidFace,
    PageCuboidPad,
    PageCuboidRow,
    PageCuboidStack,
} from "../../../StyledComponents/CuboidContent/CuboidContent";
import type { CuboidUprightExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

type Props = CuboidUprightExampleProps;

export const UprightExample = (props: Props) => {
    const [yaw, setYaw] = props.yaw;
    const [pitch, setPitch] = props.pitch;
    const [controller, setController] = props.controller;

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
                isUpright={props.isUpright}
                isDraggable={props.isDraggable}
                ariaLabel={"Six faces, kept upright"}
                computeFaceLabel={computeCuboidFaceLabel}
                renderFace={(face, state) => <PageCuboidFace face={face} state={state} />}
                onMount={setController}
            />

            <PageCuboidPad>
                <div />
                {renderTurn("uprightPitchUp", "Turn the face above towards you", CONTROL_GLYPHS.up, () => {
                    setPitch(pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("uprightYawLeft", "Turn the face on the left towards you", CONTROL_GLYPHS.left, () => {
                    setYaw(yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("uprightYawRight", "Turn the face on the right towards you", CONTROL_GLYPHS.right, () => {
                    setYaw(yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("uprightPitchDown", "Turn the face below towards you", CONTROL_GLYPHS.down, () => {
                    setPitch(pitch - QUARTER_TURN);
                })}
                <div />
            </PageCuboidPad>

            <PageCuboidRow>
                {CUBOID_FACES.map((face) => (
                    <Button
                        key={face}
                        id={`turnTo${computeCuboidFaceLabel(face)}`}
                        ariaLabel={`Turn to the ${face}`}
                        renderContent={(flags) => (
                            <PageControlButtonContent flags={flags}>
                                {computeCuboidFaceLabel(face)}
                            </PageControlButtonContent>
                        )}
                        onClick={() => {
                            controller?.turnTo(face);
                        }}
                    />
                ))}
            </PageCuboidRow>
        </PageCuboidStack>
    );
};
