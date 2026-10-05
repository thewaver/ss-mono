import { useState } from "react";

import type { PatchBoardLink } from "@thewaver/ss-components-react";
import { MediaQueryMonitorReactUtils, PATCH_BOARD_DEFAULTS } from "@thewaver/ss-components-react";
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
import { MathUtils } from "@thewaver/ss-utils";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { ChainExample } from "./Examples/Chain";
import { MixerExample } from "./Examples/Mixer";
import { PanExample } from "./Examples/Pan";
import { RackExample } from "./Examples/Rack";
import { ZoomExample } from "./Examples/Zoom";
import type { PatchBoardExampleProps } from "./PatchBoardPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/PatchBoardPage/Examples";

const WIDE_SPAN = 2;
const PERCENT = 100;
const NOTHING_DONE = "nothing yet";

const getLinkWords = (link: PatchBoardLink) =>
    `${link.from.nodeKey} ${link.from.socketId} to ${link.to.nodeKey} ${link.to.socketId}`;

export const PatchBoardPage = () => {
    const [socketSize, setSocketSize] = useState(PATCH_BOARD_DEFAULTS.socketSize);
    const [isLocked, setIsLocked] = useState(PatchBoardKnobs.STARTING_IS_LOCKED);
    const [isDisabled, setIsDisabled] = useState(PatchBoardKnobs.STARTING_IS_DISABLED);
    const [chainAction, setChainAction] = useState(NOTHING_DONE);
    const [mixerAction, setMixerAction] = useState(NOTHING_DONE);
    const [rackAction, setRackAction] = useState(NOTHING_DONE);
    const [panAction, setPanAction] = useState(NOTHING_DONE);
    const [zoomAction, setZoomAction] = useState(NOTHING_DONE);
    const [zoom, setZoom] = useState(STARTING_ZOOM);

    const chainNodesState = useState(CHAIN_NODES);
    const chainLinksState = useState(CHAIN_LINKS);
    const mixerNodesState = useState(MIXER_NODES);
    const mixerLinksState = useState(MIXER_LINKS);
    const rackNodesState = useState(RACK_NODES);
    const rackLinksState = useState(RACK_LINKS);
    const panNodesState = useState(PAN_NODES);
    const panLinksState = useState(PAN_LINKS);
    const zoomNodesState = useState(CHAIN_NODES);
    const zoomLinksState = useState(CHAIN_LINKS);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const [isBeamPlaying, setIsBeamPlaying] = useState(!prefersReducedMotion);

    const commonProps: Omit<PatchBoardExampleProps, "nodes" | "links" | "onLink" | "onUnlink" | "onMove"> = {
        socketSize,
        isLocked,
        isDisabled,
        isBeamPlaying,
    };

    const examples = [
        {
            key: "chain",
            name: "Signal chain",
            span: WIDE_SPAN,
            readout: () =>
                `${chainLinksState[0].length} cables, last: ${chainAction} — the gate's second input is disabled, so a cable aimed at it is refused`,
            component: () => (
                <PageMeasureBox width={BOARD_WIDTH}>
                    <ChainExample
                        {...commonProps}
                        nodes={chainNodesState}
                        links={chainLinksState}
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
                `${mixerLinksState[0].length} cables, last: ${mixerAction} — a standing board, sockets on the top and bottom edges; only the desk may feed the amp, so a source aimed straight at it is refused`,
            component: () => (
                <PageMeasureBox width={BOARD_WIDTH}>
                    <MixerExample
                        {...commonProps}
                        nodes={mixerNodesState}
                        links={mixerLinksState}
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
                `${rackLinksState[0].length} cables, last: ${rackAction} — a node lands on the grid as it is dragged, and an arrow key takes it to the next grid point; a cable that would feed a signal back to where it came from, such as the reverb into the delay's feedback, is refused`,
            component: () => (
                <PageMeasureBox>
                    <RackExample
                        {...commonProps}
                        nodes={rackNodesState}
                        links={rackLinksState}
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
                `${panLinksState[0].length} cables, last: ${panAction} — the board is wider and taller than its window, so scroll to pan; a node carried with the arrow keys brings the window with it`,
            component: () => (
                <PageMeasureBox>
                    <PanExample
                        {...commonProps}
                        nodes={panNodesState}
                        links={panLinksState}
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
                `${zoomLinksState[0].length} cables at ${Math.round(zoom * PERCENT)}%, last: ${zoomAction} — the board is scaled with a CSS transform, and a drag still lands under the pointer`,
            component: () => (
                <ZoomExample
                    {...commonProps}
                    zoom={zoom}
                    nodes={zoomNodesState}
                    links={zoomLinksState}
                    onZoomChange={(next) => setZoom(MathUtils.clamp(next, MIN_ZOOM, MAX_ZOOM))}
                    onLink={(link) => setZoomAction(`connected ${getLinkWords(link)}`)}
                    onUnlink={(link) => setZoomAction(`unplugged ${getLinkWords(link)}`)}
                    onMove={(nodeKey) => setZoomAction(`moved ${nodeKey}`)}
                />
            ),
            path: `${EXAMPLES_ROOT}/Zoom.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"socketSize"}
                    label={"Socket size"}
                    hint={
                        "How large each socket is drawn, as a fraction of the board's width, so a wider board has larger sockets."
                    }
                >
                    <PageNumberField
                        value={socketSize}
                        min={PatchBoardKnobs.MIN_SOCKET_SIZE}
                        max={PatchBoardKnobs.MAX_SOCKET_SIZE}
                        step={PatchBoardKnobs.SOCKET_SIZE_STEP}
                        ariaLabel={"Socket size as a fraction of the board's width"}
                        onInput={setSocketSize}
                    />
                </PageProp>

                <PageProp
                    itemKey={"isLocked"}
                    label={"Wiring locked"}
                    hint={
                        "Freezes the wiring as it stands: the cables still show, but none can be dragged, made or pulled out."
                    }
                >
                    <PageCheckField value={isLocked} ariaLabel={"Wiring locked"} onChange={setIsLocked} />
                </PageProp>

                <PageProp
                    itemKey={"isDisabled"}
                    label={"Disabled"}
                    hint={"Turns the whole board off, so nothing on it responds to the pointer or the keyboard."}
                >
                    <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>

                <PageProp
                    itemKey={"isBeamPlaying"}
                    label={"Beams moving"}
                    hint={
                        "Whether a pulse runs along every plugged cable, from the output to the input it feeds. It starts stopped while the visitor has asked for reduced motion."
                    }
                >
                    <PageCheckField value={isBeamPlaying} ariaLabel={"Beams moving"} onChange={setIsBeamPlaying} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </>
    );
};
