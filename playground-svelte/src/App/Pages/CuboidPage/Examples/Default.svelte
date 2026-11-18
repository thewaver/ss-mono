<script lang="ts">
    import { Button, Cuboid } from "@thewaver/ss-components-svelte";
    import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.svelte";
    import PageCuboidPad from "../../../StyledComponents/CuboidContent/PageCuboidPad.svelte";
    import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.svelte";
    import type { CuboidExampleProps } from "../CuboidPage.types";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import { TURN_TOP_TOWARDS_YOU_TEXT, TURN_LEFT_FACE_TOWARDS_TEXT, TURN_RIGHT_FACE_TOWARDS_TEXT, TURN_BOTTOM_TOWARDS_YOU_TEXT } from "@thewaver/ss-playground/App/Pages/CuboidPage/CuboidPage.const";

    const QUARTER_TURN = 1;

    type Props = CuboidExampleProps;

    let { yaw = $bindable(), pitch = $bindable(), ...props }: Props = $props();
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
            ariaLabel={"Six faces"}
            computeFaceLabel={computeCuboidFaceLabel}
        >
            {#snippet renderFace(face, state)}
                <PageCuboidFace {face} {state} />
            {/snippet}
        </Cuboid>
    </PageMeasureBox>

    <PageCuboidPad>
        <div></div>
        {@render renderTurn("pitchUp", TURN_TOP_TOWARDS_YOU_TEXT, CONTROL_GLYPHS.up, () => {
            pitch = pitch + QUARTER_TURN;
        })}
        <div></div>

        {@render renderTurn("yawLeft", TURN_LEFT_FACE_TOWARDS_TEXT, CONTROL_GLYPHS.left, () => {
            yaw = yaw - QUARTER_TURN;
        })}
        <div></div>
        {@render renderTurn("yawRight", TURN_RIGHT_FACE_TOWARDS_TEXT, CONTROL_GLYPHS.right, () => {
            yaw = yaw + QUARTER_TURN;
        })}

        <div></div>
        {@render renderTurn("pitchDown", TURN_BOTTOM_TOWARDS_YOU_TEXT, CONTROL_GLYPHS.down, () => {
            pitch = pitch - QUARTER_TURN;
        })}
        <div></div>
    </PageCuboidPad>
</PageCuboidStack>
