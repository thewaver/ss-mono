<script lang="ts">
    import type { CuboidFace } from "@thewaver/ss-components-svelte";
    import { Cuboid, CuboidUtils } from "@thewaver/ss-components-svelte";
    import { computeCuboidFaceLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { ObjectUtils } from "@thewaver/ss-utils";

    import PageCuboidFace from "../../../StyledComponents/CuboidContent/PageCuboidFace.svelte";
    import PageCuboidStack from "../../../StyledComponents/CuboidContent/PageCuboidStack.svelte";
    import type { CuboidWanderingExampleProps } from "../CuboidPage.types";

    const QUARTER_TURN = 1;

    const TURNS: [number, number][] = [
        [QUARTER_TURN, 0],
        [-QUARTER_TURN, 0],
        [0, QUARTER_TURN],
        [0, -QUARTER_TURN],
    ];

    type Props = CuboidWanderingExampleProps;

    let { yaw = $bindable(), pitch = $bindable(), ...props }: Props = $props();

    let previousFacing: CuboidFace | undefined;

    $effect(() => {
        const turnIntervalMs = props.turnIntervalMs;

        if (turnIntervalMs === undefined || turnIntervalMs <= 0) return;

        const turnToNeighbor = () => {
            const facing = CuboidUtils.getFacingFromTurns(yaw, pitch);
            const neighbors = TURNS.map(
                ([yawTurn, pitchTurn]) =>
                    [CuboidUtils.getFacingFromTurns(yaw + yawTurn, pitch + pitchTurn), yawTurn, pitchTurn] as const,
            ).filter(([turned]) => turned !== facing);
            const unvisited = neighbors.filter(([turned]) => turned !== previousFacing);
            const [[, yawTurn, pitchTurn]] = ObjectUtils.getRandomArrayValues(
                unvisited.length > 0 ? unvisited : neighbors,
            );

            previousFacing = facing;

            yaw = yaw + yawTurn;
            pitch = pitch + pitchTurn;
        };

        const timer = setInterval(turnToNeighbor, turnIntervalMs);

        return () => {
            clearInterval(timer);
        };
    });
</script>

<PageCuboidStack>
    <Cuboid
        bind:yaw
        bind:pitch
        size={props.size}
        transitionDurationMs={props.transitionDurationMs}
        ariaLabel={"Six faces, turning by themselves"}
        computeFaceLabel={computeCuboidFaceLabel}
    >
        {#snippet renderFace(face, state)}
            <PageCuboidFace {face} {state} />
        {/snippet}
    </Cuboid>
</PageCuboidStack>
