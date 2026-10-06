import { For } from "solid-js";

import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-solid";
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
            <Cuboid
                yaw={props.yaw}
                pitch={props.pitch}
                size={props.size}
                transitionDurationMs={props.transitionDurationMs}
                isUpright={props.isUpright}
                isDraggable={props.isDraggable}
                ariaLabel={"Six faces, kept upright"}
                computeFaceLabel={computeCuboidFaceLabel}
                renderFace={(getFace, getState) => <PageCuboidFace face={getFace} state={getState} />}
                onMount={setController}
            />

            <PageCuboidPad>
                <div />
                {renderTurn("uprightPitchUp", "Turn the face above towards you", CONTROL_GLYPHS.up, () => {
                    setPitch((pitch) => pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("uprightYawLeft", "Turn the face on the left towards you", CONTROL_GLYPHS.left, () => {
                    setYaw((yaw) => yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("uprightYawRight", "Turn the face on the right towards you", CONTROL_GLYPHS.right, () => {
                    setYaw((yaw) => yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("uprightPitchDown", "Turn the face below towards you", CONTROL_GLYPHS.down, () => {
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
