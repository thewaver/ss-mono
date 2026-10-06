<script lang="ts">
    import { Button, Cuboid } from "@thewaver/ss-components-svelte";
    import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.svelte";
    import PageCuboidPad from "../../../StyledComponents/CuboidContent/PageCuboidPad.svelte";
    import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.svelte";
    import type { CuboidExampleProps } from "../CuboidPage.types";

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

    <PageCuboidPad>
        <div></div>
        {@render renderTurn("pitchUp", "Turn the top towards you", CONTROL_GLYPHS.up, () => {
            pitch = pitch + QUARTER_TURN;
        })}
        <div></div>

        {@render renderTurn("yawLeft", "Turn the left face towards you", CONTROL_GLYPHS.left, () => {
            yaw = yaw - QUARTER_TURN;
        })}
        <div></div>
        {@render renderTurn("yawRight", "Turn the right face towards you", CONTROL_GLYPHS.right, () => {
            yaw = yaw + QUARTER_TURN;
        })}

        <div></div>
        {@render renderTurn("pitchDown", "Turn the bottom towards you", CONTROL_GLYPHS.down, () => {
            pitch = pitch - QUARTER_TURN;
        })}
        <div></div>
    </PageCuboidPad>
</PageCuboidStack>
