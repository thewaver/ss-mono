import { createMemo, createSignal } from "solid-js";

import type { PatchBoardLink } from "@thewaver/ss-components";
import { PATCH_BOARD_DEFAULTS } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { ChainExample } from "./Examples/Chain";
import { MixerExample } from "./Examples/Mixer";
import { PanExample } from "./Examples/Pan";
import { RackExample } from "./Examples/Rack";
import { ZoomExample } from "./Examples/Zoom";
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
} from "./PatchBoardPage.const";
import type { PatchBoardExampleProps } from "./PatchBoardPage.types";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";

const EXAMPLES_ROOT = "/src/App/Pages/PatchBoardPage/Examples";

const MIN_SOCKET_SIZE = 0.02;
const MAX_SOCKET_SIZE = 0.06;
const SOCKET_SIZE_STEP = 0.005;
const WIDE_SPAN = 2;
const PERCENT = 100;
const MEASURED_BOARD_WIDTH = BOARD_WIDTH + MEASURE_BOX_PADDING * 2;
const NOTHING_DONE = "nothing yet";

export const PatchBoardPage = () => {
    const [getSocketSize, setSocketSize] = createSignal(PATCH_BOARD_DEFAULTS.socketSize);
    const [getIsLocked, setIsLocked] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getChainAction, setChainAction] = createSignal(NOTHING_DONE);
    const [getMixerAction, setMixerAction] = createSignal(NOTHING_DONE);
    const [getRackAction, setRackAction] = createSignal(NOTHING_DONE);
    const [getPanAction, setPanAction] = createSignal(NOTHING_DONE);
    const [getZoomAction, setZoomAction] = createSignal(NOTHING_DONE);
    const [getZoom, setZoom] = createSignal(STARTING_ZOOM);

    const chainNodesSignal = createSignal(CHAIN_NODES);
    const chainLinksSignal = createSignal(CHAIN_LINKS);
    const mixerNodesSignal = createSignal(MIXER_NODES);
    const mixerLinksSignal = createSignal(MIXER_LINKS);
    const rackNodesSignal = createSignal(RACK_NODES);
    const rackLinksSignal = createSignal(RACK_LINKS);
    const panNodesSignal = createSignal(PAN_NODES);
    const panLinksSignal = createSignal(PAN_LINKS);
    const zoomNodesSignal = createSignal(CHAIN_NODES);
    const zoomLinksSignal = createSignal(CHAIN_LINKS);

    const getLinkWords = (link: PatchBoardLink) =>
        `${link.from.nodeKey} ${link.from.socketId} to ${link.to.nodeKey} ${link.to.socketId}`;

    const getExamples = createMemo(() => {
        const commonProps: Omit<
            PatchBoardExampleProps,
            "nodesSignal" | "linksSignal" | "onLink" | "onUnlink" | "onMove"
        > = {
            socketSize: getSocketSize,
            isLocked: getIsLocked,
            isDisabled: getIsDisabled,
        };

        return [
            {
                key: "chain",
                name: "Signal chain",
                span: WIDE_SPAN,
                readout: () =>
                    `${chainLinksSignal[0]().length} cables, last: ${getChainAction()} — the gate's second input is disabled, so a cable aimed at it is refused`,
                component: () => (
                    <PageMeasureBox width={() => MEASURED_BOARD_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <ChainExample
                            {...commonProps}
                            nodesSignal={chainNodesSignal}
                            linksSignal={chainLinksSignal}
                            onLink={(link) => setChainAction(`connected ${getLinkWords(link)}`)}
                            onUnlink={(link) => setChainAction(`unplugged ${getLinkWords(link)}`)}
                            onMove={(nodeKey) => setChainAction(`moved ${nodeKey}`)}
                        />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Chain.tsx`,
            },
            {
                key: "mixer",
                name: "Mixing desk",
                span: WIDE_SPAN,
                readout: () =>
                    `${mixerLinksSignal[0]().length} cables, last: ${getMixerAction()} — a standing board, sockets on the top and bottom edges; only the desk may feed the amp, so a source aimed straight at it is refused`,
                component: () => (
                    <PageMeasureBox width={() => MEASURED_BOARD_WIDTH} padding={() => MEASURE_BOX_PADDING}>
                        <MixerExample
                            {...commonProps}
                            nodesSignal={mixerNodesSignal}
                            linksSignal={mixerLinksSignal}
                            onLink={(link) => setMixerAction(`connected ${getLinkWords(link)}`)}
                            onUnlink={(link) => setMixerAction(`unplugged ${getLinkWords(link)}`)}
                            onMove={(nodeKey) => setMixerAction(`moved ${nodeKey}`)}
                        />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Mixer.tsx`,
            },
            {
                key: "rack",
                name: "Effects rack",
                span: WIDE_SPAN,
                readout: () =>
                    `${rackLinksSignal[0]().length} cables, last: ${getRackAction()} — a node lands on the grid as it is dragged, and an arrow key takes it to the next grid point; a cable that would feed a signal back to where it came from, such as the reverb into the delay's feedback, is refused`,
                component: () => (
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
                        <RackExample
                            {...commonProps}
                            nodesSignal={rackNodesSignal}
                            linksSignal={rackLinksSignal}
                            onLink={(link) => setRackAction(`connected ${getLinkWords(link)}`)}
                            onUnlink={(link) => setRackAction(`unplugged ${getLinkWords(link)}`)}
                            onMove={(nodeKey) => setRackAction(`moved ${nodeKey}`)}
                        />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Rack.tsx`,
            },
            {
                key: "pan",
                name: "Panned board",
                span: WIDE_SPAN,
                readout: () =>
                    `${panLinksSignal[0]().length} cables, last: ${getPanAction()} — the board is wider and taller than its window, so scroll to pan; a node carried with the arrow keys brings the window with it`,
                component: () => (
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
                        <PanExample
                            {...commonProps}
                            nodesSignal={panNodesSignal}
                            linksSignal={panLinksSignal}
                            onLink={(link) => setPanAction(`connected ${getLinkWords(link)}`)}
                            onUnlink={(link) => setPanAction(`unplugged ${getLinkWords(link)}`)}
                            onMove={(nodeKey) => setPanAction(`moved ${nodeKey}`)}
                        />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Pan.tsx`,
            },
            {
                key: "zoom",
                name: "Zoomed board",
                span: WIDE_SPAN,
                readout: () =>
                    `${zoomLinksSignal[0]().length} cables at ${Math.round(getZoom() * PERCENT)}%, last: ${getZoomAction()} — the board is scaled with a CSS transform, and a drag still lands under the pointer`,
                component: () => (
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
                        <ZoomExample
                            {...commonProps}
                            zoom={getZoom}
                            nodesSignal={zoomNodesSignal}
                            linksSignal={zoomLinksSignal}
                            onZoomChange={(zoom) => setZoom(MathUtils.clamp(zoom, MIN_ZOOM, MAX_ZOOM))}
                            onLink={(link) => setZoomAction(`connected ${getLinkWords(link)}`)}
                            onUnlink={(link) => setZoomAction(`unplugged ${getLinkWords(link)}`)}
                            onMove={(nodeKey) => setZoomAction(`moved ${nodeKey}`)}
                        />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Zoom.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"socketSize"}
                    label={"Socket size"}
                    hint={
                        "How large each socket is drawn, as a fraction of the board's width, so a wider board has larger sockets."
                    }
                >
                    <PageNumberField
                        value={getSocketSize}
                        min={() => MIN_SOCKET_SIZE}
                        max={() => MAX_SOCKET_SIZE}
                        step={() => SOCKET_SIZE_STEP}
                        ariaLabel={"Socket size as a fraction of the board's width"}
                        onInput={setSocketSize}
                    />
                </PageProp>

                <PageProp
                    key={"isLocked"}
                    label={"Wiring locked"}
                    hint={
                        "Freezes the wiring as it stands: the cables still show, but none can be dragged, made or pulled out."
                    }
                >
                    <PageCheckField value={getIsLocked} ariaLabel={"Wiring locked"} onChange={setIsLocked} />
                </PageProp>

                <PageProp
                    key={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the whole board off, so nothing on it responds to the pointer or the keyboard."}
                >
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
