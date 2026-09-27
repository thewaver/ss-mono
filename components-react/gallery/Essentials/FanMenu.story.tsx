import { type ReactNode, useState } from "react";

import type { ArcDefs, InteractionFlags, MenuItemFlags } from "@thewaver/ss-components";

import { FanMenu, type MenuItem } from "../../src";

type Action = { name: string; shortcut?: string };

const NOTHING_RUN = "nothing run yet";
const BACK_MARK = "‹";
const SUBMENU_MARK = "›";
const LAYOUT_DEFS: ArcDefs = { curveHeightRatio: 1, itemWidthRatio: 0.5, itemHeightRatio: 0.2381 };
const CENTER_PLACEMENT = { x: "center", y: "center" } as const;

const NESTED_ACTIONS: MenuItem<Action>[] = [
    {
        value: { name: "New" },
        items: [
            { value: { name: "Project" } },
            {
                value: { name: "From template" },
                items: [{ value: { name: "Blank" } }, { value: { name: "Dashboard" } }, { value: { name: "Report" } }],
            },
            { value: { name: "Import" } },
        ],
    },
    { value: { name: "Open", shortcut: "Ctrl+O" } },
    {
        value: { name: "Share" },
        items: [{ value: { name: "Copy link", shortcut: "Ctrl+L" } }, { value: { name: "Email" } }],
    },
    { value: { name: "Delete", shortcut: "Del" } },
];

const renderCard = (item: MenuItem<Action>, flags: InteractionFlags<MenuItemFlags>) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            width: "100%",
            height: "100%",
            borderRadius: 8,
            background: flags.isHighlighted ? "#99c" : flags.isBack ? "#ddf" : "#eee",
            boxSizing: "border-box",
        }}
    >
        {flags.isBack && <span aria-hidden="true">{BACK_MARK}</span>}
        <span>{item.value.name}</span>
        {item.value.shortcut && !flags.isBack && <span>{item.value.shortcut}</span>}
        {flags.hasSubmenu && <span aria-hidden="true">{SUBMENU_MARK}</span>}
    </div>
);

const renderPopup = (renderItems: () => ReactNode, visibilityTarget: 0 | 1, transitionDurationMs: number) => (
    <div style={{ opacity: visibilityTarget, transition: `opacity ${transitionDurationMs}ms` }}>{renderItems()}</div>
);

export const Submenus = () => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <div style={{ display: "grid", placeItems: "center", minHeight: 340 }}>
            <FanMenu
                id="trigger"
                layoutSize={"192px"}
                layoutDefs={LAYOUT_DEFS}
                items={NESTED_ACTIONS}
                ariaLabel={"Edit actions"}
                placement={CENTER_PLACEMENT}
                renderContent={() => <span>Fan</span>}
                renderItem={renderCard}
                renderPopup={renderPopup}
                onActivate={(action) => setLastRun(action.name)}
            />
            <output data-readout="last">{lastRun}</output>
        </div>
    );
};
