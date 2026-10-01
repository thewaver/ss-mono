<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import { SATELLITE_DEFAULTS, SatelliteUtils, SatelliteStyles as styles } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import type { SatelliteDefs, SatelliteProps } from "./Satellite.types.js";

    const BEHIND_Z_INDEX = 0;
    const SUBJECT_Z_INDEX = 1;
    const FRONT_Z_INDEX = 2;
    const NOTHING = 0;
    const UNMEASURED = { width: 0, height: 0 };
    const UNPLACED = { x: 0, y: 0 };
    const NO_SATELLITES: SatelliteDefs[] = [];

    let props: SatelliteProps = $props();

    let subject = $state<HTMLDivElement>();
    let satelliteRefs = $state.raw<Array<HTMLElement | undefined>>([]);

    const satellites = $derived(props.satellites ?? NO_SATELLITES);
    const hasSatellites = $derived(satellites.length > NOTHING);

    const getSubjectSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => subject ?? undefined,
        () => !hasSatellites,
    );

    const getSatelliteSizes = ElementObserverSvelteUtils.createBorderBoxSizeListObserver(
        () => satellites.map((_unused, index) => satelliteRefs[index]),
        () => !hasSatellites,
    );

    const setSatelliteRef = (index: number, element: HTMLElement | undefined) =>
        untrack(() => {
            if (satelliteRefs[index] === element) return;

            const next = [...satelliteRefs];

            next[index] = element;
            satelliteRefs = next;
        });

    const attachSatellite =
        (index: number): Attachment<HTMLElement> =>
        (element) => {
            setSatelliteRef(index, element);

            return () => {
                if (untrack(() => satelliteRefs[index]) === element) setSatelliteRef(index, undefined);
            };
        };

    const layout = $derived(
        SatelliteUtils.computeLayout(
            getSubjectSize(),
            satellites.map((satellite, index) => ({
                size: getSatelliteSizes()[index] ?? UNMEASURED,
                placement: satellite.placement ?? SATELLITE_DEFAULTS.placement,
                offset: satellite.offset ?? SATELLITE_DEFAULTS.offset,
            })),
        ),
    );
</script>

{#if !hasSatellites}
    {@render props.children?.()}
{:else}
    <div
        class={styles.satelliteRoot}
        style:padding-left={`${layout.padding.paddingLeft}px`}
        style:padding-top={`${layout.padding.paddingTop}px`}
        style:padding-right={`${layout.padding.paddingRight}px`}
        style:padding-bottom={`${layout.padding.paddingBottom}px`}
    >
        <div bind:this={subject} class={styles.satelliteSubject} style:z-index={SUBJECT_Z_INDEX}>
            {@render props.children?.()}
        </div>

        {#each satellites as satellite, index (index)}
            {@const offset = layout.satelliteOffsets[index] ?? UNPLACED}
            <div
                {@attach attachSatellite(index)}
                class={styles.satelliteBody}
                style:left={`${offset.x}px`}
                style:top={`${offset.y}px`}
                style:z-index={(satellite.isBehindSubject ?? SATELLITE_DEFAULTS.isBehindSubject)
                    ? BEHIND_Z_INDEX
                    : FRONT_Z_INDEX}
            >
                {@render satellite.renderSatellite()}
            </div>
        {/each}
    </div>
{/if}
