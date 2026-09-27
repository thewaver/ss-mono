import { type ReactNode, useState } from "react";

import {
    type ArcDefs,
    type InteractionFlags,
    type MenuItemFlags,
    PlacementLayoutUtils,
    type ToolbarAction,
} from "@thewaver/ss-components";

import { type MenuItem, Toolbar } from "../../src";

const NOTHING_RUN = "nothing run yet";
const STARTING_BAR_WIDTH = 520;
const CHECKED_MARK = "✓";
const PALETTE_WIDTH = "390px";

const DEFAULT_ACTIONS: ToolbarAction<string>[] = [
    { value: "Bold" },
    { value: "Italic" },
    { value: "Underline" },
    { value: "Align left" },
    { value: "Align center" },
    { value: "Bullets" },
    { value: "Numbering" },
];

const REFUSING_ACTIONS: ToolbarAction<string>[] = [
    { value: "Undo" },
    { value: "Redo" },
    { value: "Comment" },
    { value: "Share", collapse: "never" },
    { value: "Print", collapse: "always" },
    { value: "Archive" },
    { value: "Rename", isDisabled: true },
];

const PRESSED_ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

const PALETTE_ACTIONS: ToolbarAction<string>[] = [
    { value: "Select" },
    { value: "Brush" },
    { value: "Erase" },
    { value: "Fill" },
    { value: "Text" },
    { value: "Shape" },
    { value: "Crop" },
    { value: "Zoom" },
];

const PALETTE_DEFS: ArcDefs = {
    curveHeightRatio: 1,
    spreadDegrees: 360,
    facingDegrees: 70,
    itemWidthRatio: 0.3542,
    itemHeightRatio: 0.4706,
};

const PALETTE_LAYOUT = PlacementLayoutUtils.createArc(PALETTE_DEFS);

const STORIES = { default: DEFAULT_ACTIONS, refusing: REFUSING_ACTIONS };

const renderOverflowItem = (item: MenuItem<string>, flags: InteractionFlags<MenuItemFlags>) => (
    <div style={{ display: "flex", gap: 8, padding: "4px 8px", background: flags.isHighlighted ? "#ddd" : undefined }}>
        {item.kind === "checkbox" && <span aria-hidden="true">{flags.isChecked ? CHECKED_MARK : ""}</span>}
        <span>{item.value}</span>
    </div>
);

const renderOverflowPopup = (renderItems: () => ReactNode, visibilityTarget: 0 | 1) => (
    <div style={{ padding: 4, border: "1px solid #888", background: "white", opacity: visibilityTarget }}>
        {renderItems()}
    </div>
);

const ACTION_STYLE = { display: "inline-block", padding: "4px 24px" };

const renderOverflowTrigger = () => <span style={ACTION_STYLE}>More</span>;

const renderAction = (action: ToolbarAction<string>) => <span style={ACTION_STYLE}>{action.value}</span>;

const WidthField = (props: { width: number; onChange: (width: number) => void }) => (
    <input
        type="number"
        data-testid="barWidth"
        aria-label="Bar width in pixels"
        value={props.width}
        onChange={(e) => props.onChange(Number(e.currentTarget.value))}
    />
);

export const Default = ({ variant = "default" }: { variant?: keyof typeof STORIES }) => {
    const [width, setWidth] = useState(STARTING_BAR_WIDTH);
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <WidthField width={width} onChange={setWidth} />
            <div data-testid="bar" style={{ width }}>
                <Toolbar
                    actions={STORIES[variant]}
                    ariaLabel={variant === "default" ? "Formatting" : "Document"}
                    overflowAriaLabel={"More actions"}
                    renderAction={renderAction}
                    renderOverflowTrigger={renderOverflowTrigger}
                    renderOverflowItem={renderOverflowItem}
                    renderOverflowPopup={renderOverflowPopup}
                    onActivate={setLastRun}
                />
            </div>
            <output data-readout="last">{`last run: ${lastRun}`}</output>
        </>
    );
};

export const Pressed = () => {
    const [width, setWidth] = useState(STARTING_BAR_WIDTH);
    const pressedValuesState = useState<string[]>([]);

    return (
        <>
            <WidthField width={width} onChange={setWidth} />
            <div data-testid="bar" style={{ width }}>
                <Toolbar
                    actions={PRESSED_ACTIONS}
                    ariaLabel={"Text style"}
                    overflowAriaLabel={"More text styles"}
                    pressedValuesState={pressedValuesState}
                    renderAction={(action, flags) => (
                        <span className={flags.isPressed ? "mark mark-pressed" : "mark"} style={ACTION_STYLE}>
                            {action.value}
                        </span>
                    )}
                    renderOverflowTrigger={renderOverflowTrigger}
                    renderOverflowItem={renderOverflowItem}
                    renderOverflowPopup={renderOverflowPopup}
                    onActivate={() => {}}
                />
            </div>
            <output data-readout="last">{`pressed: ${pressedValuesState[0].join(", ") || "nothing"}`}</output>
        </>
    );
};

export const Palette = () => {
    const [lastRun, setLastRun] = useState(NOTHING_RUN);

    return (
        <>
            <div data-testid="bar" style={{ width: PALETTE_WIDTH }}>
                <Toolbar
                    actions={PALETTE_ACTIONS}
                    ariaLabel={"Tools"}
                    overflowAriaLabel={"More tools"}
                    computeLayout={PALETTE_LAYOUT}
                    renderAction={renderAction}
                    renderOverflowTrigger={renderOverflowTrigger}
                    renderOverflowItem={renderOverflowItem}
                    renderOverflowPopup={renderOverflowPopup}
                    onActivate={setLastRun}
                />
            </div>
            <output data-readout="last">{`last run: ${lastRun}`}</output>
        </>
    );
};
