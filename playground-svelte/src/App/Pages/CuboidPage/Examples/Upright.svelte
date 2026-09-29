<script lang="ts">
    import { Button, CUBOID_FACES, Cuboid } from "@thewaver/ss-components-svelte";
    import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.svelte";
    import PageCuboidPad from "../../../StyledComponents/CuboidContent/PageCuboidPad.svelte";
    import PageCuboidRow from "../../../StyledComponents/CuboidContent/PageCuboidRow.svelte";
    import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.svelte";
    import type { CuboidUprightExampleProps } from "../CuboidPage.types";

    const QUARTER_TURN = 1;

    type Props = CuboidUprightExampleProps;

    let { yaw = $bindable(), pitch = $bindable(), controller = $bindable(), ...props }: Props = $props();
</script>

{#snippet renderTurn(id: string, label: string, glyph: string, turn: () => void)}
    <Button {id} ariaLabel={label} onClick={turn}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>{glyph}</PageButtonContent>
        {/snippet}
    </Button>
{/snippet}

<PageCuboidStack>
    <Cuboid
        bind:yaw
        bind:pitch
        size={props.size}
        transitionDurationMs={props.transitionDurationMs}
        isUpright={props.isUpright}
        isDraggable={props.isDraggable}
        ariaLabel={"Six faces, kept upright"}
        computeFaceLabel={computeCuboidFaceLabel}
        onMount={(next) => {
            controller = next;
        }}
    >
        {#snippet renderFace(face, state)}
            <PageCuboidFace {face} {state} />
        {/snippet}
    </Cuboid>

    <PageCuboidPad>
        <div></div>
        {@render renderTurn("uprightPitchUp", "Turn the face above towards you", "↑", () => {
            pitch = pitch + QUARTER_TURN;
        })}
        <div></div>

        {@render renderTurn("uprightYawLeft", "Turn the face on the left towards you", "←", () => {
            yaw = yaw - QUARTER_TURN;
        })}
        <div></div>
        {@render renderTurn("uprightYawRight", "Turn the face on the right towards you", "→", () => {
            yaw = yaw + QUARTER_TURN;
        })}

        <div></div>
        {@render renderTurn("uprightPitchDown", "Turn the face below towards you", "↓", () => {
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
                    <PageButtonContent {flags}>{computeCuboidFaceLabel(face)}</PageButtonContent>
                {/snippet}
            </Button>
        {/each}
    </PageCuboidRow>
</PageCuboidStack>
