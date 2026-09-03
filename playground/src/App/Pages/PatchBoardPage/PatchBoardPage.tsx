import { createMemo, createSignal } from "solid-js";

import type { PatchBoardLink } from "@thewaver/ss-components";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PageCheckField, PageNumberField } from "../../StyledComponents/Field/Field";
import { ChainExample } from "./Examples/Chain";
import { MixerExample } from "./Examples/Mixer";
import { CHAIN_LINKS, CHAIN_NODES, MIXER_LINKS, MIXER_NODES } from "./PatchBoardPage.const";
import type { PatchBoardExampleProps } from "./PatchBoardPage.types";

import { MEASURE_BOX_PADDING } from "../../PageComponents/MeasureBox/MeasureBox.css";

const EXAMPLES_ROOT = "/src/App/Pages/PatchBoardPage/Examples";

const MIN_SOCKET_SIZE = 8;
const MAX_SOCKET_SIZE = 28;
const SOCKET_SIZE_STEP = 2;
const STARTING_SOCKET_SIZE = 14;
const WIDE_SPAN = 2;
const NOTHING_DONE = "nothing yet";

export const PatchBoardPage = () => {
    const [getSocketSize, setSocketSize] = createSignal(STARTING_SOCKET_SIZE);
    const [getIsLocked, setIsLocked] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getChainAction, setChainAction] = createSignal(NOTHING_DONE);
    const [getMixerAction, setMixerAction] = createSignal(NOTHING_DONE);

    const chainNodesSignal = createSignal(CHAIN_NODES);
    const chainLinksSignal = createSignal(CHAIN_LINKS);
    const mixerNodesSignal = createSignal(MIXER_NODES);
    const mixerLinksSignal = createSignal(MIXER_LINKS);

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
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
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
                    <PageMeasureBox padding={() => MEASURE_BOX_PADDING}>
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
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp key={"socketSize"} label={"Socket size (px)"}>
                    <PageNumberField
                        value={getSocketSize}
                        min={() => MIN_SOCKET_SIZE}
                        max={() => MAX_SOCKET_SIZE}
                        step={() => SOCKET_SIZE_STEP}
                        ariaLabel={"Socket size in pixels"}
                        onInput={setSocketSize}
                    />
                </PageProp>

                <PageProp key={"isLocked"} label={"Wiring locked"}>
                    <PageCheckField value={getIsLocked} ariaLabel={"Wiring locked"} onChange={setIsLocked} />
                </PageProp>

                <PageProp key={"isDisabled"} label={"Disabled"}>
                    <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </>
    );
};
