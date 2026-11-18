<script lang="ts">
    import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-svelte";
    import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.svelte";
    import PageCuboidPad from "../../../StyledComponents/CuboidContent/PageCuboidPad.svelte";
    import PageCuboidRow from "../../../StyledComponents/CuboidContent/PageCuboidRow.svelte";
    import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.svelte";
    import type { CuboidUprightExampleProps } from "../CuboidPage.types";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import { SIX_FACES_KEPT_UPRIGHT_LABEL, TURN_FACE_ABOVE_TOWARDS_TEXT, TURN_FACE_LEFT_TOWARDS_TEXT, TURN_FACE_RIGHT_TOWARDS_TEXT, TURN_FACE_BELOW_TOWARDS_TEXT } from "@thewaver/ss-playground/App/Pages/CuboidPage/CuboidPage.const";

    const QUARTER_TURN = 1;

    type Props = CuboidUprightExampleProps;

    let { yaw = $bindable(), pitch = $bindable(), controller = $bindable(), ...props }: Props = $props();
</script>

{#snippet renderTurn(id: string, label: string, glyph: string, turn: () => void)}
    <Button {id} ariaLabel={label} onClick={turn}>
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} {glyph} />
        {/snippet}
    </Button>
{/snippet}

<PageCuboidStack>
    <PageMeasureBox>
        <Cuboid
            bind:yaw
            bind:pitch
            size={props.size}
            transitionDurationMs={props.transitionDurationMs}
            isUpright={props.isUpright}
            isDraggable={props.isDraggable}
            ariaLabel={SIX_FACES_KEPT_UPRIGHT_LABEL}
            computeFaceLabel={computeCuboidFaceLabel}
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderFace(face, state)}
                <PageCuboidFace {face} {state} />
            {/snippet}
        </Cuboid>
    </PageMeasureBox>

    <PageCuboidPad>
        <div></div>
        {@render renderTurn("uprightPitchUp", TURN_FACE_ABOVE_TOWARDS_TEXT, CONTROL_GLYPHS.up, () => {
            pitch = pitch + QUARTER_TURN;
        })}
        <div></div>

        {@render renderTurn("uprightYawLeft", TURN_FACE_LEFT_TOWARDS_TEXT, CONTROL_GLYPHS.left, () => {
            yaw = yaw - QUARTER_TURN;
        })}
        <div></div>
        {@render renderTurn("uprightYawRight", TURN_FACE_RIGHT_TOWARDS_TEXT, CONTROL_GLYPHS.right, () => {
            yaw = yaw + QUARTER_TURN;
        })}

        <div></div>
        {@render renderTurn("uprightPitchDown", TURN_FACE_BELOW_TOWARDS_TEXT, CONTROL_GLYPHS.down, () => {
            pitch = pitch - QUARTER_TURN;
        })}
        <div></div>
    </PageCuboidPad>

    <PageCuboidRow>
        {#each CUBOID_FACES as face (face)}
            <Button
                id={`turnTo${computeCuboidFaceLabel(face)}`}
                ariaLabel={`Turn to the ${face}`}
                onClick={() => {
                    controller?.turnTo(face);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags}>{computeCuboidFaceLabel(face)}</PageControlButtonContent>
                {/snippet}
            </Button>
        {/each}
    </PageCuboidRow>
</PageCuboidStack>
