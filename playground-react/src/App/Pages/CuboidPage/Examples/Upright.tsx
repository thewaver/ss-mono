import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-react";
import { computeCuboidFaceLabel } from "@thewaver/ss-playground-core/App/PageComponents/Announcements/Announcements.const";

import { PageButtonContent } from "../../../StyledComponents/ButtonContent/ButtonContent";
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
    const [yaw, setYaw] = props.yawState;
    const [pitch, setPitch] = props.pitchState;
    const [controller, setController] = props.controllerState;

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
                isUpright={props.isUpright}
                isDraggable={props.isDraggable}
                ariaLabel={"Six faces, kept upright"}
                computeFaceLabel={computeCuboidFaceLabel}
                renderFace={(face, state) => <PageCuboidFace face={face} state={state} />}
                onMount={setController}
            />

            <PageCuboidPad>
                <div />
                {renderTurn("uprightPitchUp", "Turn the face above towards you", "↑", () => {
                    setPitch(pitch + QUARTER_TURN);
                })}
                <div />

                {renderTurn("uprightYawLeft", "Turn the face on the left towards you", "←", () => {
                    setYaw(yaw - QUARTER_TURN);
                })}
                <div />
                {renderTurn("uprightYawRight", "Turn the face on the right towards you", "→", () => {
                    setYaw(yaw + QUARTER_TURN);
                })}

                <div />
                {renderTurn("uprightPitchDown", "Turn the face below towards you", "↓", () => {
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
                            <PageButtonContent flags={flags}>{computeCuboidFaceLabel(face)}</PageButtonContent>
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
