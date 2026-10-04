<script lang="ts">
    import type { PatchBoardLink, PatchBoardNode } from "@thewaver/ss-components-svelte";
    import { PATCH_BOARD_DEFAULTS } from "@thewaver/ss-components-svelte";
    import { PatchBoardKnobs } from "@thewaver/ss-playground/App/Knobs/PatchBoards.const";
    import {
        BOARD_WIDTH,
        CHAIN_LINKS,
        CHAIN_NODES,
        MAX_ZOOM,
        MIN_ZOOM,
        MIXER_LINKS,
        MIXER_NODES,
        PAN_LINKS,
        PAN_NODES,
        RACK_LINKS,
        RACK_NODES,
        STARTING_ZOOM,
    } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchBoardPage.const";
    import type { PatchDevice } from "@thewaver/ss-playground/App/Pages/PatchBoardPage/PatchDevice.types";
    import { MathUtils } from "@thewaver/ss-utils";

    import type { ExampleDefs } from "../../PageComponents/Examples/Examples.types";
    import PageExamples from "../../PageComponents/Examples/PageExamples.svelte";
    import PageCheckField from "../../PageComponents/Field/PageCheckField.svelte";
    import PageNumberField from "../../PageComponents/Field/PageNumberField.svelte";
    import PageMeasureBox from "../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageProp from "../../PageComponents/Prop/Prop.svelte";
    import PagePropsPanel from "../../PageComponents/PropsPanel/PagePropsPanel.svelte";
    import BeamsExample from "./Examples/Beams.svelte";
    import ChainExample from "./Examples/Chain.svelte";
    import MixerExample from "./Examples/Mixer.svelte";
    import PanExample from "./Examples/Pan.svelte";
    import RackExample from "./Examples/Rack.svelte";
    import ZoomExample from "./Examples/Zoom.svelte";
    import type { PatchBoardExampleProps } from "./PatchBoardPage.types";

    const EXAMPLES_ROOT = "/src/App/Pages/PatchBoardPage/Examples";

    const WIDE_SPAN = 2;
    const PERCENT = 100;
    const NOTHING_DONE = "nothing yet";

    const getLinkWords = (link: PatchBoardLink) =>
        `${link.from.nodeKey} ${link.from.socketId} to ${link.to.nodeKey} ${link.to.socketId}`;

    let socketSize = $state(PATCH_BOARD_DEFAULTS.socketSize);
    let isLocked = $state(PatchBoardKnobs.STARTING_IS_LOCKED);
    let isDisabled = $state(PatchBoardKnobs.STARTING_IS_DISABLED);
    let chainAction = $state(NOTHING_DONE);
    let mixerAction = $state(NOTHING_DONE);
    let rackAction = $state(NOTHING_DONE);
    let panAction = $state(NOTHING_DONE);
    let zoomAction = $state(NOTHING_DONE);
    let beamsAction = $state(NOTHING_DONE);
    let zoom = $state(STARTING_ZOOM);

    let chainNodes = $state.raw<PatchBoardNode<PatchDevice>[]>(CHAIN_NODES);
    let chainLinks = $state.raw<PatchBoardLink[]>(CHAIN_LINKS);
    let mixerNodes = $state.raw<PatchBoardNode<PatchDevice>[]>(MIXER_NODES);
    let mixerLinks = $state.raw<PatchBoardLink[]>(MIXER_LINKS);
    let rackNodes = $state.raw<PatchBoardNode<PatchDevice>[]>(RACK_NODES);
    let rackLinks = $state.raw<PatchBoardLink[]>(RACK_LINKS);
    let panNodes = $state.raw<PatchBoardNode<PatchDevice>[]>(PAN_NODES);
    let panLinks = $state.raw<PatchBoardLink[]>(PAN_LINKS);
    let zoomNodes = $state.raw<PatchBoardNode<PatchDevice>[]>(CHAIN_NODES);
    let zoomLinks = $state.raw<PatchBoardLink[]>(CHAIN_LINKS);
    let beamsNodes = $state.raw<PatchBoardNode<PatchDevice>[]>(CHAIN_NODES);
    let beamsLinks = $state.raw<PatchBoardLink[]>(CHAIN_LINKS);

    const commonProps: Omit<PatchBoardExampleProps, "nodes" | "links" | "onLink" | "onUnlink" | "onMove"> =
        $derived({ socketSize, isLocked, isDisabled });

    const examples: ExampleDefs[] = [
        {
            key: "chain",
            name: "Signal chain",
            span: WIDE_SPAN,
            readout: () =>
                `${chainLinks.length} cables, last: ${chainAction} — the gate's second input is disabled, so a cable aimed at it is refused`,
            component: chainExample,
            path: `${EXAMPLES_ROOT}/Chain.svelte`,
        },
        {
            key: "mixer",
            name: "Mixing desk",
            span: WIDE_SPAN,
            readout: () =>
                `${mixerLinks.length} cables, last: ${mixerAction} — a standing board, sockets on the top and bottom edges; only the desk may feed the amp, so a source aimed straight at it is refused`,
            component: mixerExample,
            path: `${EXAMPLES_ROOT}/Mixer.svelte`,
        },
        {
            key: "rack",
            name: "Effects rack",
            span: WIDE_SPAN,
            readout: () =>
                `${rackLinks.length} cables, last: ${rackAction} — a node lands on the grid as it is dragged, and an arrow key takes it to the next grid point; a cable that would feed a signal back to where it came from, such as the reverb into the delay's feedback, is refused`,
            component: rackExample,
            path: `${EXAMPLES_ROOT}/Rack.svelte`,
        },
        {
            key: "pan",
            name: "Panned board",
            span: WIDE_SPAN,
            readout: () =>
                `${panLinks.length} cables, last: ${panAction} — the board is wider and taller than its window, so scroll to pan; a node carried with the arrow keys brings the window with it`,
            component: panExample,
            path: `${EXAMPLES_ROOT}/Pan.svelte`,
        },
        {
            key: "zoom",
            name: "Zoomed board",
            span: WIDE_SPAN,
            readout: () =>
                `${zoomLinks.length} cables at ${Math.round(zoom * PERCENT)}%, last: ${zoomAction} — the board is scaled with a CSS transform, and a drag still lands under the pointer`,
            component: zoomExample,
            path: `${EXAMPLES_ROOT}/Zoom.svelte`,
        },
        {
            key: "beams",
            name: "The signal running along its cables",
            span: WIDE_SPAN,
            readout: () =>
                `${beamsLinks.length} cables, last: ${beamsAction} — a pulse runs along every plugged cable from the output to the input it feeds, taking the same time on a long cable as on a short one; Pause stops it`,
            component: beamsExample,
            path: `${EXAMPLES_ROOT}/Beams.svelte`,
        },
    ];
</script>

{#snippet chainExample()}
    <PageMeasureBox width={BOARD_WIDTH}>
        <ChainExample
            {...commonProps}
            bind:nodes={chainNodes}
            bind:links={chainLinks}
            onLink={(link) => (chainAction = `connected ${getLinkWords(link)}`)}
            onUnlink={(link) => (chainAction = `unplugged ${getLinkWords(link)}`)}
            onMove={(nodeKey) => (chainAction = `moved ${nodeKey}`)}
        />
    </PageMeasureBox>
{/snippet}

{#snippet mixerExample()}
    <PageMeasureBox width={BOARD_WIDTH}>
        <MixerExample
            {...commonProps}
            bind:nodes={mixerNodes}
            bind:links={mixerLinks}
            onLink={(link) => (mixerAction = `connected ${getLinkWords(link)}`)}
            onUnlink={(link) => (mixerAction = `unplugged ${getLinkWords(link)}`)}
            onMove={(nodeKey) => (mixerAction = `moved ${nodeKey}`)}
        />
    </PageMeasureBox>
{/snippet}

{#snippet rackExample()}
    <PageMeasureBox>
        <RackExample
            {...commonProps}
            bind:nodes={rackNodes}
            bind:links={rackLinks}
            onLink={(link) => (rackAction = `connected ${getLinkWords(link)}`)}
            onUnlink={(link) => (rackAction = `unplugged ${getLinkWords(link)}`)}
            onMove={(nodeKey) => (rackAction = `moved ${nodeKey}`)}
        />
    </PageMeasureBox>
{/snippet}

{#snippet panExample()}
    <PageMeasureBox>
        <PanExample
            {...commonProps}
            bind:nodes={panNodes}
            bind:links={panLinks}
            onLink={(link) => (panAction = `connected ${getLinkWords(link)}`)}
            onUnlink={(link) => (panAction = `unplugged ${getLinkWords(link)}`)}
            onMove={(nodeKey) => (panAction = `moved ${nodeKey}`)}
        />
    </PageMeasureBox>
{/snippet}

{#snippet zoomExample()}
    <ZoomExample
        {...commonProps}
        {zoom}
        bind:nodes={zoomNodes}
        bind:links={zoomLinks}
        onZoomChange={(next) => (zoom = MathUtils.clamp(next, MIN_ZOOM, MAX_ZOOM))}
        onLink={(link) => (zoomAction = `connected ${getLinkWords(link)}`)}
        onUnlink={(link) => (zoomAction = `unplugged ${getLinkWords(link)}`)}
        onMove={(nodeKey) => (zoomAction = `moved ${nodeKey}`)}
    />
{/snippet}

{#snippet beamsExample()}
    <PageMeasureBox width={BOARD_WIDTH}>
        <BeamsExample
            {...commonProps}
            bind:nodes={beamsNodes}
            bind:links={beamsLinks}
            onLink={(link) => (beamsAction = `connected ${getLinkWords(link)}`)}
            onUnlink={(link) => (beamsAction = `unplugged ${getLinkWords(link)}`)}
            onMove={(nodeKey) => (beamsAction = `moved ${nodeKey}`)}
        />
    </PageMeasureBox>
{/snippet}

<PagePropsPanel scope={"global"}>
    <PageProp
        itemKey={"socketSize"}
        label={"Socket size"}
        hint={"How large each socket is drawn, as a fraction of the board's width, so a wider board has larger sockets."}
    >
        <PageNumberField
            value={socketSize}
            min={PatchBoardKnobs.MIN_SOCKET_SIZE}
            max={PatchBoardKnobs.MAX_SOCKET_SIZE}
            step={PatchBoardKnobs.SOCKET_SIZE_STEP}
            ariaLabel={"Socket size as a fraction of the board's width"}
            onInput={(value) => {
                socketSize = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isLocked"}
        label={"Wiring locked"}
        hint={"Freezes the wiring as it stands: the cables still show, but none can be dragged, made or pulled out."}
    >
        <PageCheckField
            value={isLocked}
            ariaLabel={"Wiring locked"}
            onChange={(value) => {
                isLocked = value;
            }}
        />
    </PageProp>

    <PageProp
        itemKey={"isDisabled"}
        label={"Disabled"}
        hint={"Turns the whole board off, so nothing on it responds to the pointer or the keyboard."}
    >
        <PageCheckField
            value={isDisabled}
            ariaLabel={"Disabled"}
            onChange={(value) => {
                isDisabled = value;
            }}
        />
    </PageProp>
</PagePropsPanel>

<PageExamples items={examples} layout={"flow"} />
