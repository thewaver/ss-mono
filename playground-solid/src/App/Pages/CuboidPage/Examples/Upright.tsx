import { For } from "solid-js";

import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-solid";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
import {
    SIX_FACES_KEPT_UPRIGHT_LABEL,
    TURN_FACE_ABOVE_TOWARDS_TEXT,
    TURN_FACE_BELOW_TOWARDS_TEXT,
    TURN_FACE_LEFT_TOWARDS_TEXT,
    TURN_FACE_RIGHT_TOWARDS_TEXT,
} from "@thewaver/ss-playground/App/Pages/CuboidPage/CuboidPage.const";
import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

import { PageMeasureBox } from "../../../PageComponents/MeasureBox/MeasureBox";
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
    const [, setYaw] = props.yaw;
    const [, setPitch] = props.pitch;
    const [getController, setController] = props.controller;

    const renderTurn = (id: string, label: string, glyph: string, turn: () => void) => (
        <Button
            id={id}
            ariaLabel={label}
            renderContent={(getFlags) => <PageControlButtonContent flags={getFlags} glyph={glyph} />}
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
                    isUpright={props.isUpright}
                    isDraggable={props.isDraggable}
                    ariaLabel={SIX_FACES_KEPT_UPRIGHT_LABEL}
                    computeFaceLabel={computeCuboidFaceLabel}
                    renderFace={(getFace, getState) => <PageCuboidFace face={getFace} state={getState} />}
                    onMount={setController}
                />
            </PageMeasureBox>

            <PageCuboidPad>
                <div />
                {renderTurn("uprightPitchUp", TURN_FACE_ABOVE_TOWARDS_TEXT, CONTROL_GLYPHS.up, () => {
                    setPitch((pitch) => pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("uprightYawLeft", TURN_FACE_LEFT_TOWARDS_TEXT, CONTROL_GLYPHS.left, () => {
                    setYaw((yaw) => yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("uprightYawRight", TURN_FACE_RIGHT_TOWARDS_TEXT, CONTROL_GLYPHS.right, () => {
                    setYaw((yaw) => yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("uprightPitchDown", TURN_FACE_BELOW_TOWARDS_TEXT, CONTROL_GLYPHS.down, () => {
                    setPitch((pitch) => pitch - QUARTER_TURN);
                })}
                <div />
            </PageCuboidPad>

            <PageCuboidRow>
                <For each={CUBOID_FACES}>
                    {(face) => (
                        <Button
                            id={`turnTo${computeCuboidFaceLabel(face)}`}
                            ariaLabel={`Turn to the ${face}`}
                            renderContent={(getFlags) => (
                                <PageControlButtonContent flags={getFlags}>
                                    {computeCuboidFaceLabel(face)}
                                </PageControlButtonContent>
                            )}
                            onClick={() => {
                                getController()?.turnTo(face);
                            }}
                        />
                    )}
                </For>
            </PageCuboidRow>
        </PageCuboidStack>
    );
};
