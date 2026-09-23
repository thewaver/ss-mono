import { For } from "solid-js";

import type { CuboidFace } from "@thewaver/ss-components";
import { Button, Cuboid } from "@thewaver/ss-components";

import { computeCuboidFaceLabel } from "../../../PageComponents/Announcements/Announcements.const";
import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
import {
    PageCuboidFace,
    PageCuboidPad,
    PageCuboidRow,
    PageCuboidStack,
} from "../../../StyledComponents/CuboidContent/CuboidContent";
import type { CuboidUprightExampleProps } from "../CuboidPage.types";

const QUARTER_TURN = 1;

const FACES: CuboidFace[] = ["front", "right", "back", "left", "top", "bottom"];

type Props = CuboidUprightExampleProps;

export const UprightExample = (props: Props) => {
    const [, setYaw] = props.yawSignal;
    const [, setPitch] = props.pitchSignal;
    const [getController, setController] = props.controllerSignal;

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
                isUpright={props.isUpright}
                isDraggable={props.isDraggable}
                ariaLabel={"Six faces, kept upright"}
                computeFaceLabel={computeCuboidFaceLabel}
                renderFace={(getFace, getState) => <PageCuboidFace face={getFace} state={getState} />}
                onMount={setController}
            />

            <PageCuboidPad>
                <div />
                {renderTurn("uprightPitchUp", "Turn the face above towards you", "↑", () => {
                    setPitch((pitch) => pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("uprightYawLeft", "Turn the face on the left towards you", "←", () => {
                    setYaw((yaw) => yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("uprightYawRight", "Turn the face on the right towards you", "→", () => {
                    setYaw((yaw) => yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("uprightPitchDown", "Turn the face below towards you", "↓", () => {
                    setPitch((pitch) => pitch - QUARTER_TURN);
                })}
                <div />
            </PageCuboidPad>

            <PageCuboidRow>
                <For each={FACES}>
                    {(face) => (
                        <Button
                            id={`turnTo${computeCuboidFaceLabel(face)}`}
                            ariaLabel={`Turn to the ${face}`}
                            renderContent={(getFlags) => (
                                <PageButtonContent flags={getFlags}>{computeCuboidFaceLabel(face)}</PageButtonContent>
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
