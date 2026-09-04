import type { JSX } from "solid-js";
import { Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import COMPONENT_DEPENDENCIES from "virtual:component-dependencies";
import type { DependencyNames } from "virtual:component-dependencies";

import { A, Route, type RouteSectionProps, Router } from "@solidjs/router";
import { Collapsible, Tree, Viewport } from "@thewaver/ss-components";
import type { SignalPair, TreeNode } from "@thewaver/ss-components";
import { FunctionUtils, Size2d, StringUtils } from "@thewaver/ss-utils";

import { AccordionPage } from "./Pages/AccordionPage/AccordionPage";
import { BracketPage } from "./Pages/BracketPage/BracketPage";
import { BreadcrumbsPage } from "./Pages/BreadcrumbsPage/BreadcrumbsPage";
import { ButtonPage } from "./Pages/ButtonPage/ButtonPage";
import { CalendarPage } from "./Pages/CalendarPage/CalendarPage";
import { CarouselPage } from "./Pages/CarouselPage/CarouselPage";
import { CellAnimationPage } from "./Pages/CellAnimationPage/CellAnimationPage";
import { CheckboxPage } from "./Pages/CheckboxPage/CheckboxPage";
import { ColorAreaPage } from "./Pages/ColorAreaPage/ColorAreaPage";
import { ColorInputPage } from "./Pages/ColorInputPage/ColorInputPage";
import { CuboidPage } from "./Pages/CuboidPage/CuboidPage";
import { CurrencyInputPage } from "./Pages/CurrencyInputPage/CurrencyInputPage";
import { DatePickerPage } from "./Pages/DatePickerPage/DatePickerPage";
import { DateRangePickerPage } from "./Pages/DateRangePickerPage/DateRangePickerPage";
import { DateTimePickerPage } from "./Pages/DateTimePickerPage/DateTimePickerPage";
import { DrawerPage } from "./Pages/DrawerPage/DrawerPage";
import { FileInputPage } from "./Pages/FileInputPage/FileInputPage";
import { FlipCardPage } from "./Pages/FlipCardPage/FlipCardPage";
import { FormPage } from "./Pages/FormPage/FormPage";
import { FormationPage } from "./Pages/FormationPage/FormationPage";
import { ImageSwitcherPage } from "./Pages/ImageSwitcherPage/ImageSwitcherPage";
import { InteractionTrackerPage } from "./Pages/InteractionTrackerPage/InteractionTrackerPage";
import { LabelPage } from "./Pages/LabelPage/LabelPage";
import { MenuPage } from "./Pages/MenuPage/MenuPage";
import { ModalPage } from "./Pages/ModalPage/ModalPage";
import { MosaicPage } from "./Pages/MosaicPage/MosaicPage";
import { NumberInputPage } from "./Pages/NumberInputPage/NumberInputPage";
import { OdometerPage } from "./Pages/OdometerPage/OdometerPage";
import { PaginatorPage } from "./Pages/PaginatorPage/PaginatorPage";
import { PatchBoardPage } from "./Pages/PatchBoardPage/PatchBoardPage";
import { PointerTrackerPage } from "./Pages/PointerTrackerPage/PointerTrackerPage";
import { PreviewPage } from "./Pages/PreviewPage/PreviewPage";
import { ProgressPage } from "./Pages/ProgressPage/ProgressPage";
import { RadioPage } from "./Pages/RadioPage/RadioPage";
import { RangeCalendarPage } from "./Pages/RangeCalendarPage/RangeCalendarPage";
import { RangePage } from "./Pages/RangePage/RangePage";
import { RevealPage } from "./Pages/RevealPage/RevealPage";
import { RichTextPage } from "./Pages/RichTextPage/RichTextPage";
import { SVGFiltersPage } from "./Pages/SVGFiltersPage/SVGFiltersPage";
import { SatellitePage } from "./Pages/SatellitePage/SatellitePage";
import { ScanlineAnimationPage } from "./Pages/ScanLineAnimationPage/ScanLineAnimationPage";
import { ScrambleTextPage } from "./Pages/ScrambleTextPage/ScrambleTextPage";
import { ScratchCardPage } from "./Pages/ScratchCardPage/ScratchCardPage";
import { ScreenWiperPage } from "./Pages/ScreenWiperPage/ScreenWiperPage";
import { ScrollerPage } from "./Pages/ScrollerPage/ScrollerPage";
import { SelectPage } from "./Pages/SelectPage/SelectPage";
import { ShapePage } from "./Pages/ShapePage/ShapePage";
import { SlideButtonPage } from "./Pages/SlideButtonPage/SlideButtonPage";
import { SortableGridPage } from "./Pages/SortableGridPage/SortableGridPage";
import { SortablePage } from "./Pages/SortablePage/SortablePage";
import { SplitPanePage } from "./Pages/SplitPanePage/SplitPanePage";
import { SpotlightPage } from "./Pages/SpotlightPage/SpotlightPage";
import { StaircasePage } from "./Pages/StaircasePage/StaircasePage";
import { StepperPage } from "./Pages/StepperPage/StepperPage";
import { SurfacePage } from "./Pages/SurfacePage/SurfacePage";
import { TablePage } from "./Pages/TablePage/TablePage";
import { TabsPage } from "./Pages/TabsPage/TabsPage";
import { TagInputPage } from "./Pages/TagInputPage/TagInputPage";
import { TextAreaPage } from "./Pages/TextAreaPage/TextAreaPage";
import { TextInputPage } from "./Pages/TextInputPage/TextInputPage";
import { TileBoardPage } from "./Pages/TileBoardPage/TileBoardPage";
import { TimelinePage } from "./Pages/TimelinePage/TimelinePage";
import { ToastsPage } from "./Pages/ToastsPage/ToastsPage";
import { TogglePage } from "./Pages/TogglePage/TogglePage";
import { ToolbarPage } from "./Pages/ToolbarPage/ToolbarPage";
import { TrailPage } from "./Pages/TrailPage/TrailPage";
import { TreePage } from "./Pages/TreePage/TreePage";
import { TypewriterPage } from "./Pages/TypewriterPage/TypewriterPage";
import { ViewportPage } from "./Pages/ViewportPage/ViewportPage";
import { VirtualizerPage } from "./Pages/VirtualizerPage/VirtualizerPage";
import { WheelPage } from "./Pages/WheelPage/WheelPage";
import { PageTextField } from "./StyledComponents/Field/Field";
import { PageTreeNodeContent } from "./StyledComponents/TreeNodeContent/TreeNodeContent";

import * as styles from "./App.css";

type ComponentConfig = {
    name: string;
    description: string;
    component?: () => JSX.Element;
};

type MenuBranchConfig = {
    name: string;
    children: MenuNodeConfig[];
    hidden?: boolean;
};

type MenuNodeConfig = ComponentConfig | MenuBranchConfig;

const EmptyPage = () => <>{null}</>;

const getIsBranchConfig = (node: MenuNodeConfig): node is MenuBranchConfig => "children" in node;

const componentToRouteName = (name: string) => `/${StringUtils.camelToKebabCase(name)}`;

const SHOW_COMPOSITES = false;
const LIST_PAGELESS_COMPONENTS = false;
const SEARCH_FIELD_WIDTH = 320;

const MENU_CONFIGS: MenuBranchConfig[] = [
    {
        name: "Abstracts",
        children: [
            {
                name: "Floating layers",
                children: [
                    {
                        name: "Anchor",
                        description:
                            "Where a floating layer goes, as two independent choices — one across, one down — and a fallback that may only pick another candidate from its own family, so a list asked to sit to the right of a field can end up on its left but never above it. It also asks Elevation what the anchor is inside, which is what keeps a popup opened from within a raised layer in front of that layer rather than behind it.",
                    },
                    {
                        name: "Dismisser",
                        description:
                            "One stack for everything that closes on a press outside it, on focus leaving, or on Escape. The stack is what makes nesting work: a menu opened inside a dialog closes on Escape and the dialog stays, because only the top layer answers. Deciding whether a press landed inside walks up from the pressed element and follows aria-controls as well as the DOM, so pressing the button that owns an open popup is not a press outside it.",
                    },
                    {
                        name: "ElementFader",
                        description:
                            "What lets an element being removed finish leaving. It reports two things — whether the element should be in the document at all, and what its transition is heading towards — so a painter can start at nought, be moved to one a frame later, and stay mounted for the length of its own transition after it has been told to go. The frame it waits for has a timer behind it, because a tab in the background is never given one.",
                    },
                    {
                        name: "Elevation",
                        description:
                            "Which stacking level a floating layer has to beat. Every raised layer registers its element and its level; anything about to open asks what it is inside and is given the highest level containing it. Without it, a popup opened from inside a dialog appears behind the dialog — the one stacking fault that cannot be fixed with CSS from outside.",
                    },
                    {
                        name: "FocusManager",
                        description:
                            "What counts as focusable, and the two things done with the answer: keeping Tab inside a dialog by sending it from the last element back to the first, and putting focus where it was when a layer closes. Being reachable is a stricter test than matching the selector — anything inside an inert subtree, hidden from the accessibility tree, or with no boxes at all is skipped — so the trap never lands on something the eye cannot find.",
                    },
                ],
            },
            {
                name: "Lists and trees",
                children: [
                    {
                        name: "Flattener",
                        description:
                            "Turns a tree into the flat list of rows that are on screen, and hands each row what the markup needs: its depth, which number it is among its siblings, how many siblings there are, and whether it is open. One walk produces all of it, which is the point — counting a node's siblings separately for each row walks the same tree again for every row on screen. A select's option groups and a tree's branches are this walk with different questions asked of each node.",
                    },
                    {
                        name: "Navigator",
                        description:
                            "The arithmetic behind every arrow-key walk: the next position along a line, and the next cell in a grid. The grid walk neither wraps nor clamps — it answers with nothing when the step leaves the grid — because a table, a calendar and a tile board all need to hear that the step went off the edge, and each does something different with it.",
                    },
                    {
                        name: "Virtualizer",
                        description:
                            "A window over a list too long to mount: it reports which rows should exist right now, where each one starts, and how tall the whole thing would be. Rows can be measured after they mount rather than guessed, and named rows can be pinned so they stay mounted when scrolled away.",
                        component: () => <VirtualizerPage />,
                    },
                ],
            },
            {
                name: "Observing",
                children: [
                    {
                        name: "ElementObserver",
                        description:
                            "Measuring, in the four shapes the library actually needs: one element's box, a list of boxes at once, a height on its own, and a rectangle in viewport coordinates. The last is the odd one out — it re-reads every frame while the thing is visible, because there is no event for the element you are anchored to having moved.",
                    },
                    {
                        name: "FrameRateMonitor",
                        description:
                            "Counts frames and reports two numbers: the rate over the last second and the average since it started. It stops while the tab is in the background rather than reporting the near-nothing a hidden tab really runs at, and it can be told to ignore an opening stretch, since the frames spent mounting something are not the frames anyone wanted measured.",
                    },
                    {
                        name: "InteractionTracker",
                        description:
                            "Everything the library knows about a pointer on an element: the hover, focus and press flags a painter reads; a hold that stops a carousel while it is looked at; a drag reported as a ratio of the element's own box; and a swipe that reports travel while it lasts and a verdict when it ends.",
                        component: () => <InteractionTrackerPage />,
                    },
                    {
                        name: "MediaQueryMonitor",
                        description:
                            "A media query as a signal, with one listener per query however many components ask for it. Reduced motion is the query with a name of its own, since it is the one the library itself has to answer to.",
                    },
                    {
                        name: "PointerTracker",
                        description:
                            "Reports where the pointer is relative to one element: the offset from its centre, the angle, the distance, and the point where that same line leaves the element. Dividing the two distances gives one shape-aware number — below 1 inside, 1 on the edge, 2 a further element-radius away. It renders nothing at all; every example on this page is a consumer built on top of it.",
                        component: () => <PointerTrackerPage />,
                    },
                ],
            },
            {
                name: "SVG defs",
                children: [
                    {
                        name: "SVGAnimations",
                        description:
                            "The record behind a SMIL animation: a duration, and a list of patterns saying how many times each runs, how long it waits before starting, and which pattern comes next. A pattern naming itself as its own next step is unrolled into a pair that hand back and forth, because an animation pointing at itself has nothing to report an end to. It reports each iteration and the finish, so what happens next can be driven off the animation rather than off a timer beside it.",
                    },
                    {
                        name: "SVGFilters",
                        description:
                            "The builder behind every filter the library paints with: primitives are added one call at a time and the assembly decides what they see. Chained, each one is handed what the one before it produced; isolated, every one reads the original and the results are merged back over it. The region is the other half — a blur, a shadow or a displacement all reach outside the element's box, and the builder works out how far and reserves it.",
                        component: () => <SVGFiltersPage />,
                    },
                    {
                        name: "SVGGradients",
                        description:
                            "Linear and radial gradients written as a list of colours rather than as markup. A colour may name the stop it sits at or leave it to be spread evenly between the ones that do, and asking for bands rather than a blend emits each stop twice so the colours meet at a hard edge. Angle, origin, scale and offset belong to the gradient rather than to the colours, so the same list can be turned or squashed without being rewritten.",
                    },
                    {
                        name: "SVGPatterns",
                        description:
                            "Places a number of cells inside one tile and repeats the tile, which is the whole of what turns a shape and a count into a tiling. Where a cell sits and what it draws are the consumer's two functions; the named tilings themselves — hexagons, triangles, lozenges — are sample code rather than library code, so what stays here is the placement and the repeat any tiling of one's own would be built on.",
                    },
                ],
            },
            {
                name: "Text fields",
                children: [
                    {
                        name: "MaskedField",
                        description:
                            "The half that every field over a typed value shares: the text on screen, the digits behind it, and what happens when the two disagree. A value is committed only when the digits make one, what was typed is left alone when they do not, and the field is put back to the value on blur. A date, a time and an amount are this object with a different formatter.",
                    },
                    {
                        name: "TextSync",
                        description:
                            "Getting a controlled text field to behave. The browser owns what is in an input, so writing a value into one sends the caret to the end; this writes the value and puts the caret back, stands aside while a character is still being composed from several keystrokes, and is where a mask gets its turn to rewrite what was typed before anything downstream sees it.",
                    },
                    {
                        name: "Typeahead",
                        description:
                            "Type a few letters and land on the row that starts with them. The buffer is what makes it more than one keystroke: characters typed close together accumulate, the same character pressed again and again steps through the matches rather than hunting for a doubled letter, and the buffer empties itself after a pause. What it matches against is read off the rendered row, so a consumer painting their own row gets it without saying anything.",
                    },
                ],
            },
            {
                name: "Values",
                children: [
                    {
                        name: "CheckedState",
                        description:
                            "Three states rather than two, and the single rule that decides the third: with every member of a group agreeing, the group is what they agree on, and with them disagreeing it is mixed. A checkbox's indeterminate and a select group's header are the same value read in two places.",
                    },
                    {
                        name: "DateTimeValue",
                        description:
                            "A date and a time as one value, and the rule that a pair with a half missing is not a value at all. It is also the split: one signal in, two out for the two fields, rejoined on the way back, so nothing downstream ever holds two halves it has to keep in step.",
                    },
                    {
                        name: "DateValue",
                        description:
                            "The date the library works in, and it carries its own calendar system rather than assuming a Gregorian one. How many months this year has, how many days this month has, which era a year falls in, where the weeks break for a given first day — every one of those is asked of the value instead of worked out from it, which is what lets one month grid draw a Buddhist, Hebrew or Persian month without knowing anything about them.",
                    },
                ],
            },
            {
                name: "Barrel",
                description:
                    "A ring of faces turned to whatever angle it is handed: two of them are a card with a front and a back, twenty are the side of a drum. It owns the geometry and nothing else — every face is the same size, each one is told whether it is turned away so a screen reader is never read the back of a card nobody can see, and what moves the angle belongs to whatever is using it.",
            },
            {
                name: "Carrier",
                description:
                    "The one carry every pick-up-and-put-down control in the library shares. A zone says what it will accept, what a point inside it means, and whether a landing is allowed; the carry itself — what is held, where it came from, where it is aimed now — is a single stack holding at most one thing. That is what lets an item leave one list and arrive in a different control entirely, and it is why a drag, a tap to pick and a tap to place, and a keyboard pick-move-drop are three ways into the same machinery rather than three implementations of it.",
            },
            {
                name: "ColorExtractor",
                description:
                    "Reads colours back out of an image — the one dominant colour, or a palette of as many as are asked for — by loading it out of sight and sampling it. It samples a fraction of the pixels rather than all of them, and the fraction is the consumer's to set, so the cost is a knob rather than a fixed price. An image that fails to load is reported as a value rather than thrown.",
            },
            {
                name: "Cutout",
                description:
                    "A hole in an element, cut with a mask rather than drawn as four boxes around it. Two mask layers — one covering the whole element, one covering just the hole — are composited so the second subtracts from the first, and the hole can be a plain rectangle or any image handed in, which is what lets its edge be soft or rounded instead of a hard corner.",
            },
            {
                name: "LiveAnnouncer",
                description:
                    "The live region that belongs to no component. A message is appended to one of two hidden regions — polite and assertive — made on first use and taken away a second later, because a region still holding its text says nothing at all the next time the same text arrives. Anything that changes while the eye is elsewhere goes through here: an item landing in a list, a wheel coming to rest, a notification arriving.",
            },
            {
                name: "Rotator",
                description:
                    "The spin both wheels share: given a number of steps and a function that answers with the one to land on, it turns, overshoots and settles back, and will turn on its own until it is spun. How many turns a spin takes and how far it is thrown off true are a function the consumer can replace; where the wedges are and what they look like are the wheel's, not this.",
            },
            {
                name: "SignalMirror",
                description:
                    "A value held in one form on the outside and another on the inside, kept in step in both directions without the loop that normally follows. A picker holding a date while its field holds text is the shape it was built for; so is a component that takes an optional signal from the consumer and quietly falls back to one of its own when none is passed.",
            },
        ],
    },
    {
        name: "Exotics",
        children: [
            {
                name: "Arrangements",
                children: [
                    {
                        name: "Formation",
                        description:
                            "Places a set of items into an arrangement — a podium, a whorl of three, a zigzag — from a function that answers with a position per item. Every position is a fraction of the formation's own width, so the whole thing scales with the container and nothing is measured in JavaScript.",
                        component: () => <FormationPage />,
                    },
                    {
                        name: "Mosaic",
                        description:
                            "Packs differently sized things into the least room they will fit in. One side is taken from the parent and the other is whatever the arrangement costs, so a short item leaves no hole under it — the next item that fits rises into it. The two presets differ over who chooses the sizes: an element mosaic is given them, while an image mosaic scales every row to fill the fixed side exactly and asks only for the shape the finished mosaic should come out closest to. Both render items in the order they end up reading in rather than the order they were passed, so Tab and a screen reader follow the eye.",
                        component: () => <MosaicPage />,
                    },
                    {
                        name: "Satellite",
                        description:
                            "Anchors one element to another and grows its own box to cover both, so a badge hanging off a corner still takes part in the parent's layout instead of spilling out of it. The placement vocabulary is the one Anchor already uses for floating layers.",
                        component: () => <SatellitePage />,
                    },
                    {
                        name: "Staircase",
                        description:
                            "Stacks rows and insets each one by a function of its index, which makes a funnel, a spindle or a zigzag depending on the function. The direction knob hands the steps back to front rather than asking the function to know about direction.",
                        component: () => <StaircasePage />,
                    },
                ],
            },
            {
                name: "Boards",
                children: [
                    {
                        name: "Bracket",
                        description:
                            "A tree drawn in layers with elbow connectors between a node and the nodes that feed it — a knockout draw being the arrangement it was asked for, and an org chart or a skill tree the same component with a different tree. A node sits centred between the ones it feeds from, which propagates upward and is the whole of the layout; a node with one child sits level with it, which is what a bye looks like. The arrows walk a layer and step between layers, on one tab stop.",
                        component: () => <BracketPage />,
                    },
                    {
                        name: "PatchBoard",
                        description:
                            "Boxes a person places by hand, sockets on their edges, and cables dragged from one socket to another. The board owns the geometry and the wiring rules: a cable stays fixed to its socket while the box it hangs off is dragged, an input already carrying a cable refuses a second, a node cannot be wired to itself, and the consumer can refuse a pair on top of that. Everything a pointer does is also a tap and a keystroke — pick up, aim, drop, Escape to put back — so a graph can be wired without a mouse.",
                        component: () => <PatchBoardPage />,
                    },
                    {
                        name: "SortableGrid",
                        description:
                            "An inventory board: items cover a rectangle of cells rather than a place in a line, they stay exactly where they are put, and the shape of the space left over is what decides whether the next thing fits. It shares its carry with Sortable — the same drag, the same tap to pick and tap to place, the same keyboard pick-move-drop — with an aim that can be refused, so a landing over an occupied cell or off the edge is shown and then declined rather than silently corrected.",
                        component: () => <SortableGridPage />,
                    },
                    {
                        name: "TileBoard",
                        description:
                            "A board of tiles that interlock, and every built-in shape tessellates: the offset rows and short alternate row a hexagon or a lozenge needs, the half-tile overlap and turned-over neighbours a triangle needs, or neither for a square. The board owns the geometry and the keyboard — a transparent layer wearing the tile's own shape takes the pointer, so a press lands on the tile you can see rather than on its rectangle while a piece standing taller than its tile still hangs over the row above, and the arrows walk every tile whether it will take a press or not. What a tile looks like, and what it means, are the consumer's.",
                        component: () => <TileBoardPage />,
                    },
                    {
                        name: "Timeline",
                        description:
                            "Items with a start and an end, laid on a window over a range that can be zoomed and moved. The component owns the arithmetic — where a span lands as a share of the window, which lane it goes in when it overlaps its neighbours, and which round numbers the ticks fall on at the width it currently has — and the keyboard, where the arrows walk the items in time order and bring the window with them. It moves the window only when it is asked to: the wheel, the drag and the buttons that do the asking are the consumer's.",
                        component: () => <TimelinePage />,
                    },
                ],
            },
            {
                name: "Covers",
                children: [
                    {
                        name: "Reveal",
                        description:
                            "A cover with a hole cut where the pointer is. The cover is the consumer's — opaque, frosted, or something that reads what it is told — and the component hands it the mask that cuts the hole and whether a reveal is happening.",
                        component: () => <RevealPage />,
                    },
                    {
                        name: "ScratchCard",
                        description:
                            "A cover the pointer rubs off, exposing what is under it and reporting how much has gone. The cover is a grid of cells rather than a canvas, so what has been scratched is an exact count rather than a sampled estimate and the resolution is the consumer's; crossing a threshold takes the rest of it away. Pressing it with the keyboard reveals the lot, because a control that only answers to dragging cannot be operated without a pointer.",
                        component: () => <ScratchCardPage />,
                    },
                ],
            },
            {
                name: "Image animation",
                children: [
                    {
                        name: "CellAnimation",
                        description:
                            "Cuts an image into a grid and animates the cells on a stagger, where a cell's turn comes from a weight rather than from its index. The animations, weights and origins on this page are Playground samples — the component itself only asks for a function from timeline to result.",
                        component: () => <CellAnimationPage />,
                    },
                    {
                        name: "ScanlineAnimation",
                        description:
                            "The same staggering applied to horizontal lines instead of a grid, so an image can be swept, split or glitched a row at a time. The seven examples differ only in the function they hand it.",
                        component: () => <ScanlineAnimationPage />,
                    },
                    {
                        name: "ScreenWiper",
                        description:
                            "Covers and uncovers the screen with a tessellation of staggered cells. Each cell is one div clipped by CSS rather than an SVG shape, because several hundred independent transforms composite far better than one viewport-sized SVG.",
                        component: () => <ScreenWiperPage />,
                    },
                ],
            },
            {
                name: "Text",
                children: [
                    {
                        name: "Odometer",
                        description:
                            "A number where each digit is a column that turns to its new value, so a change reads as travel rather than a swap. The columns turn the way the number is going, so nine to zero keeps going forward instead of rewinding, and a column waits for every column to its right that is also carrying. It takes the text rather than the number, so a separator is a slot that never turns and the component owns no locale.",
                        component: () => <OdometerPage />,
                    },
                    {
                        name: "RichText",
                        description:
                            "Paints a plain string that carries bracketed tags — [b], [i], [s], [u], [li] — so text arriving from a server or a file can say which of its words are emphasised without bringing markup along. Nothing is handed to the browser as HTML: the string is parsed into a tree of runs and painted with classes the consumer supplies, and a tag it does not recognise is either left on screen exactly as typed or dropped, whichever the consumer asks for.",
                        component: () => <RichTextPage />,
                    },
                    {
                        name: "ScrambleText",
                        description:
                            "Text that arrives as noise and settles into itself, one position at a time. Each character sits over the one it is going to become, so nothing changes width and the line cannot rewrap while it churns; the spaces are left alone, which is what keeps the line breaks where they were. Which glyph the noise is drawn from and the order the positions settle in are both the consumer's, the second as a weight per character in the same 0..1 vocabulary the animation samples use.",
                        component: () => <ScrambleTextPage />,
                    },
                    {
                        name: "TypeWriter",
                        description:
                            "Reveals text one character at a time without flattening it first, so a bold run or a nested element still animates in place.",
                        component: () => <TypewriterPage />,
                    },
                ],
            },
            {
                name: "Turning",
                children: [
                    {
                        name: "Cuboid",
                        description:
                            "Six faces on a box that is only a cube when you make it one: width, height and depth are given separately, and each face is sized from the two extents it spans. Two counts of quarter turns drive it, one across and one up, so it always turns the way it was pushed rather than working out a route to a face.",
                        component: () => <CuboidPage />,
                    },
                    {
                        name: "FlipCard",
                        description:
                            "Two faces back to back on a barrel with no depth, turned by the side you ask it for. It renders no control of its own: what turns the card is the page's own button, driven through the signal the two share.",
                        component: () => <FlipCardPage />,
                    },
                    {
                        name: "Wheel",
                        description:
                            "A wheel of wedges that spins to a wedge the consumer names, seen from overhead or as a drum seen from the side. Both are presets over one unexported shell, and both take their rotation from the same abstract: spinning to an index, overshooting and settling back, and turning on its own until it is spun.",
                        component: () => <WheelPage />,
                    },
                ],
            },
            {
                name: "Shape",
                description:
                    "Draws a border and a fill around arbitrary children, from a point list rather than a CSS box. It only reaches for SVG when the paint needs it and stays a plain div when it does not.",
                component: () => <ShapePage />,
            },
            {
                name: "Trail",
                description:
                    "One element travelling a path the consumer draws, on a frame loop rather than a CSS animation, so where it is right now is a value anything can read. It reports the point and the direction of travel at every frame and can turn the traveller to face along it; the controller plays, pauses and seeks, which is what lets a slider put it anywhere on the path.",
                component: () => <TrailPage />,
            },
            {
                name: "Viewport",
                description:
                    "Scales everything inside it to one design size. It is terminal: anything measured, anchored or portalled within it works in the viewport's coordinates rather than the window's.",
                component: () => <ViewportPage />,
            },
        ],
    },
    {
        name: "Fundamentals",
        children: [
            {
                name: "Buttons",
                children: [
                    {
                        name: "Button",
                        description:
                            "The plain button, plus the two things it owns that a native one does not: a name that wins over whatever the painter draws, and a pointer report a repeating control can hold.",
                        component: () => <ButtonPage />,
                    },
                    {
                        name: "SlideButton",
                        description:
                            "A confirmation you drag rather than press. Holding it is the single-pointer route the standard asks for, so the gesture is never the only way through.",
                        component: () => <SlideButtonPage />,
                    },
                ],
            },
            {
                name: "Choices",
                children: [
                    {
                        name: "Checkbox",
                        description:
                            "One of three presets over a shared binary switch. It is the only one with a third state — indeterminate is a value here, not a styling trick.",
                        component: () => <CheckboxPage />,
                    },
                    {
                        name: "Radio",
                        description:
                            "The third preset over the shared binary switch, and the one whose group rather than whose item owns which is chosen.",
                        component: () => <RadioPage />,
                    },
                    {
                        name: "Select",
                        description:
                            "A list of options in a popup over one value or several. Filtering is the consumer's — autocomplete narrows what is shown, and the component never decides what counts as a match.",
                        component: () => <SelectPage />,
                    },
                    {
                        name: "Toggle",
                        description:
                            "A preset over the shared binary switch. What separates it from a checkbox is what it announces and when the change takes effect, not what it stores.",
                        component: () => <TogglePage />,
                    },
                ],
            },
            {
                name: "Colour",
                children: [
                    {
                        name: "ColorArea",
                        description:
                            "The saturation and brightness surface that replaces the operating system's colour dialog. It holds hue, saturation and value rather than hex, because eight bits per channel cannot carry hue at black — re-reading hex every frame would drift and then stick.",
                        component: () => <ColorAreaPage />,
                    },
                    {
                        name: "ColorInput",
                        description:
                            "A colour field where the browser owns the picker itself. The component owns the trigger and the value, and nothing about what the dialog looks like.",
                        component: () => <ColorInputPage />,
                    },
                ],
            },
            {
                name: "Dates and times",
                children: [
                    {
                        name: "Calendar",
                        description:
                            "A month grid over a date value that carries its own calendar system, so first day, last day and era are asked of the value rather than assumed to be Gregorian.",
                        component: () => <CalendarPage />,
                    },
                    {
                        name: "DatePicker",
                        description:
                            "A masked date field with a calendar in a popup. Only digits are typed — separators appear as you go, and the caret is computed rather than preserved.",
                        component: () => <DatePickerPage />,
                    },
                    {
                        name: "DateRangePicker",
                        description:
                            "Two date fields and a range calendar over a single { start, end } signal. The two fields are the component's own, derived from that one value rather than handed to the consumer as a pair to keep in step.",
                        component: () => <DateRangePickerPage />,
                    },
                    {
                        name: "DateTimePicker",
                        description:
                            "A date and a time as one value rather than two. The control pairs the date and time pickers over a single signal, split for the two fields and rejoined on the way back, so a consumer never holds two halves and never has to keep them in step. A pair with a half missing is not a value, the same rule the range calendar follows.",
                        component: () => <DateTimePickerPage />,
                    },
                    {
                        name: "RangeCalendar",
                        description:
                            "The same month grid over a span rather than a day. The value is one { start, end } signal, and the state while only the first end has been picked belongs to the component rather than to the consumer, so a half-entered range is never something a caller has to hold.",
                        component: () => <RangeCalendarPage />,
                    },
                ],
            },
            {
                name: "Disclosure",
                children: [
                    {
                        name: "Accordion",
                        description:
                            "A set of disclosure sections, each a heading that opens a region. A collapsed panel stays built and measured, which is what lets it animate to its own height rather than to a guess.",
                        component: () => <AccordionPage />,
                    },
                    {
                        name: "Preview",
                        description:
                            "Content shown down to a height you set, with a control that opens it the rest of the way. Unlike a disclosure, nothing is ever hidden — the opening lines are readable from the start, which is why the part still folded away stays in the accessibility tree rather than going inert.",
                        component: () => <PreviewPage />,
                    },
                ],
            },
            {
                name: "Fields",
                children: [
                    {
                        name: "CurrencyInput",
                        description:
                            "A money field, and deliberately not a number field with grouping switched on: the currency decides the symbol, which side it sits on and how many decimals there are, so the mask follows from the locale.",
                        component: () => <CurrencyInputPage />,
                    },
                    {
                        name: "FileInput",
                        description:
                            "A file field where the operating system owns the dialog. The component owns what activates it and what comes back.",
                        component: () => <FileInputPage />,
                    },
                    {
                        name: "NumberInput",
                        description:
                            "A number field with steppers that repeat while held, and the first field to take a codec — the thing that turns typed characters into a value and back.",
                        component: () => <NumberInputPage />,
                    },
                    {
                        name: "TagInput",
                        description:
                            "A field whose value is a list: type a word, press Enter, and it becomes a tag beside the caret. Backspace on an empty field steps back into the tags rather than deleting one outright.",
                        component: () => <TagInputPage />,
                    },
                    {
                        name: "TextArea",
                        description:
                            "The multi-line preset over the shared text field, including auto-sizing that follows its own content between a minimum and a maximum number of rows.",
                        component: () => <TextAreaPage />,
                    },
                    {
                        name: "TextInput",
                        description:
                            "The single-line preset over the shared text field. The input itself is a blank slate laid over the painter, so the focus ring lands exactly around what was painted.",
                        component: () => <TextInputPage />,
                    },
                ],
            },
            {
                name: "Lists and grids",
                children: [
                    {
                        name: "Sortable",
                        description:
                            "Lists whose items can be picked up and put down, in place or in a sibling list. Three ways in — a drag, a tap to pick and a tap to place, and a keyboard pick-move-drop — because a control operated only by dragging is one a good many people cannot operate at all. The library owns the carry, the landing place and the announcements; the item, the list's surface and the insertion marker are all painted by the consumer.",
                        component: () => <SortablePage />,
                    },
                    {
                        name: "Table",
                        description:
                            "A grid rather than a table: one tab stop for the whole thing, arrows walking cell to cell, and the row and column indices published so a screen reader can still count fifty thousand rows when only thirty of them exist. Sorting, selection, column widths and the scroll window are each a signal the consumer owns, and every cell is painted by the column that declared it.",
                        component: () => <TablePage />,
                    },
                    {
                        name: "Tree",
                        description:
                            "A disclosure tree with one keyboard walk over the rows that are actually visible. A node's children sit in a group box beside the node rather than inside it, which is what the role requires.",
                        component: () => <TreePage />,
                    },
                ],
            },
            {
                name: "Navigation",
                children: [
                    {
                        name: "Breadcrumbs",
                        description:
                            "A trail of links to where you are, as a navigation landmark holding an ordered list. The last crumb is the page itself, so it is not a link and says so.",
                        component: () => <BreadcrumbsPage />,
                    },
                    {
                        name: "Paginator",
                        description:
                            "A page-range control, and the arithmetic is the point: which page numbers are worth showing, where the gaps fall, and which pages each gap stands for. The consumer knows the address shape, so it computes an href from a page rather than authoring the list.",
                        component: () => <PaginatorPage />,
                    },
                    {
                        name: "Tabs",
                        description:
                            "A tab list built from records rather than from children, so the same list can be buttons, anchors, or a consumer's own link component. The panel is optional, and pairing it is the consumer's to wire.",
                        component: () => <TabsPage />,
                    },
                    {
                        name: "Toolbar",
                        description:
                            "A row of actions that measures itself and moves whatever does not fit into a menu at the end. The row is one tab stop with the arrows walking it, and an action that leaves the row leaves that walk with it. Each action is described once and painted twice — as a button in the row and as a row in the menu — and can refuse to collapse, or insist on it.",
                        component: () => <ToolbarPage />,
                    },
                ],
            },
            {
                name: "Overlays",
                children: [
                    {
                        name: "Drawer",
                        description:
                            "A modal that arrives from an edge. It is a preset rather than a mode, because a panel cannot become a centred dialog while it is open.",
                        component: () => <DrawerPage />,
                    },
                    {
                        name: "Menu",
                        description:
                            "A popup list of commands, with a popup per submenu level rather than one list that redraws. Focus moves between the levels, and a dismissal closes them from the innermost out.",
                        component: () => <MenuPage />,
                    },
                    {
                        name: "Modal",
                        description:
                            "A dialog that traps focus, joins one dismissal stack, and hands the overlay to the consumer to paint. Escape always closes it, and that is a conformance requirement rather than a courtesy.",
                        component: () => <ModalPage />,
                    },
                    {
                        name: "Spotlight",
                        description:
                            "Cuts a hole in an overlay around one element. Three presets rather than one mode prop, because a hint, a prompt and a guide can never become one another while open.",
                        component: () => <SpotlightPage />,
                    },
                    {
                        name: "Toasts",
                        description:
                            "A queue the consumer owns. The component shows what is in it and reports when one is finished; nothing is added or dropped behind the consumer's back.",
                        component: () => <ToastsPage />,
                    },
                ],
            },
            {
                name: "Panes and strips",
                children: [
                    {
                        name: "Carousel",
                        description:
                            "One slide at a time, wrapping at both ends, and the only component here that moves without being asked. That is what makes the stop control and the holds a conformance requirement rather than a nicety: it pauses under the pointer, while anything inside it holds focus, and while the tab is in the background.",
                        component: () => <CarouselPage />,
                    },
                    {
                        name: "ImageSwitcher",
                        description:
                            "Cross-fades between image sources, loading the next one out of sight first so a slow or missing file never leaves a hole where the old picture was.",
                        component: () => <ImageSwitcherPage />,
                    },
                    {
                        name: "Scroller",
                        description:
                            "A strip too wide for its box, paged by a previous and a next button instead of a scrollbar. It holds whatever it is given without rendering or typing it, it never claims the arrow keys — whatever is inside may already own them — and when a child is focused it scrolls just far enough to show that child whole.",
                        component: () => <ScrollerPage />,
                    },
                    {
                        name: "SplitPane",
                        description:
                            "Resizable panes over a CSS grid: the ratios are fr shares and a pane's bounds are a clamp, so a window resize is the browser's arithmetic rather than the component's. When the minimums cannot all fit, it overflows, exactly as grid does.",
                        component: () => <SplitPanePage />,
                    },
                ],
            },
            {
                name: "Progress",
                children: [
                    {
                        name: "Progress",
                        description:
                            "The one Fundamental with no interaction in it: state in, paint out. The painter is handed a ratio as well as the raw value, so clamping is never repeated at the call site.",
                        component: () => <ProgressPage />,
                    },
                    {
                        name: "Stepper",
                        description:
                            "A progress strip whose per-step states are the consumer's to invent — the library owns only which step is current, and insists that whatever a state means reaches the step's name as words rather than as paint alone.",
                        component: () => <StepperPage />,
                    },
                ],
            },
            {
                name: "Form",
                description:
                    "Association and announcement, and nothing else. The library generates the ids and wires a control to its message; whether a value is valid is the consumer's to decide and to report.",
                component: () => <FormPage />,
            },
            {
                name: "Label",
                description:
                    "A caption that wraps its control rather than pointing at it by id, so nothing has to be kept unique or in sync. It paints nothing at all, cursor included.",
                component: () => <LabelPage />,
            },
            {
                name: "Range",
                description:
                    "A slider with one or two thumbs, on either axis. The drag arrives as a ratio along the track rather than as pixels.",
                component: () => <RangePage />,
            },
        ],
    },
    {
        name: "Composites",
        hidden: !SHOW_COMPOSITES,
        children: [
            {
                name: "Surface",
                description:
                    "A box that takes the SVG path only when its fill or stroke needs one, and stays a plain div with inline radii when it does not.",
                component: () => <SurfacePage />,
            },
        ],
    },
];

const flattenConfigs = (nodes: MenuNodeConfig[]): ComponentConfig[] =>
    nodes.flatMap((node) => (getIsBranchConfig(node) ? flattenConfigs(node.children) : [node]));

const toTreeNode = (node: MenuNodeConfig): TreeNode<MenuNodeConfig> =>
    getIsBranchConfig(node)
        ? { value: node, children: node.children.map(toTreeNode) }
        : { value: node, href: componentToRouteName(node.name) };

const collectAncestors = (
    nodes: MenuNodeConfig[],
    trail: MenuBranchConfig[],
    into: Map<MenuNodeConfig, MenuBranchConfig[]>,
) => {
    for (const node of nodes) {
        into.set(node, trail);

        if (getIsBranchConfig(node)) collectAncestors(node.children, [...trail, node], into);
    }
};

const filterTreeNode = (
    node: TreeNode<MenuNodeConfig>,
    getIsKept: (config: ComponentConfig) => boolean,
): TreeNode<MenuNodeConfig> | undefined => {
    if (!node.children) return getIsKept(node.value as ComponentConfig) ? node : undefined;

    const children = node.children
        .map((child) => filterTreeNode(child, getIsKept))
        .filter((child): child is TreeNode<MenuNodeConfig> => child !== undefined);

    return children.length > 0 ? { ...node, children } : undefined;
};

const collectBranchValues = (nodes: TreeNode<MenuNodeConfig>[]): MenuNodeConfig[] =>
    nodes.flatMap((node) => (node.children ? [node.value, ...collectBranchValues(node.children)] : []));

const VISIBLE_MENU_CONFIGS = MENU_CONFIGS.filter((category) => !category.hidden);

const MENU_NODES = VISIBLE_MENU_CONFIGS.map(toTreeNode);

const COMPONENT_CONFIGS = flattenConfigs(MENU_CONFIGS);

const ANCESTORS_BY_CONFIG = new Map<MenuNodeConfig, MenuBranchConfig[]>();

collectAncestors(VISIBLE_MENU_CONFIGS, [], ANCESTORS_BY_CONFIG);

const COMPONENT_CONFIGS_BY_ROUTE = Object.fromEntries(
    COMPONENT_CONFIGS.map((config) => [componentToRouteName(config.name), config]),
);

const ROUTES_BY_KEY = new Map(COMPONENT_CONFIGS.map((config) => [config.name.toLowerCase(), config.name]));

const listNames = (names: string[]) =>
    LIST_PAGELESS_COMPONENTS ? names : names.filter((name) => ROUTES_BY_KEY.has(name.toLowerCase()));

const listDependencyNames = (names: DependencyNames): DependencyNames => ({
    abstracts: listNames(names.abstracts),
    components: listNames(names.components),
});

const DEPENDENCIES_BY_KEY = new Map(
    Object.entries(COMPONENT_DEPENDENCIES).map(([name, dependencies]) => [
        name.toLowerCase(),
        { uses: listDependencyNames(dependencies.uses), usedBy: listDependencyNames(dependencies.usedBy) },
    ]),
);

const DEPENDENCY_SECTIONS = [
    { key: "uses" as const, label: "Uses" },
    { key: "usedBy" as const, label: "Used by" },
];

const DEPENDENCY_GROUPS = [
    { key: "abstracts" as const, label: "Abstracts", singular: "Abstract" },
    { key: "components" as const, label: "Components", singular: "Component" },
];

const EMPTY_DEPENDENCY_NAMES: DependencyNames = { abstracts: [], components: [] };

const computeDependencySummary = (names: DependencyNames) =>
    DEPENDENCY_GROUPS.filter((group) => names[group.key].length > 0)
        .map((group) => `${names[group.key].length} ${names[group.key].length === 1 ? group.singular : group.label}`)
        .join(" and ");

const PageDependencies = (props: { name: string }) => {
    const [getExpandedSections, setExpandedSections] = createSignal<string[]>([]);

    const getDependencies = () => DEPENDENCIES_BY_KEY.get(props.name.toLowerCase());

    createEffect(
        on(
            () => props.name,
            () => setExpandedSections([]),
        ),
    );

    return (
        <div class={styles.pageDependencies}>
            <Index each={DEPENDENCY_SECTIONS}>
                {(getSection) => {
                    const getSectionNames = () => getDependencies()?.[getSection().key] ?? EMPTY_DEPENDENCY_NAMES;

                    const expandedSignal: SignalPair<boolean> = [
                        () => getExpandedSections().includes(getSection().key),
                        (next) =>
                            setExpandedSections((previous) =>
                                next
                                    ? [...previous, getSection().key]
                                    : previous.filter((key) => key !== getSection().key),
                            ),
                    ];

                    return (
                        <Show when={getSectionNames().abstracts.length || getSectionNames().components.length}>
                            <span class={styles.dependencySectionLabel}>{getSection().label}</span>

                            <div class={styles.dependencyDisclosure}>
                                <Collapsible
                                    expandedSignal={expandedSignal}
                                    sizing={"fill"}
                                    isPanelBuiltOnExpand={true}
                                    renderTrigger={(getFlags) => (
                                        <div
                                            class={styles.dependencySummary}
                                            classList={{
                                                [styles.isExpanded]: getFlags().isExpanded,
                                                [styles.isHovered]: getFlags().isHovered,
                                            }}
                                        >
                                            <span>{computeDependencySummary(getSectionNames())}</span>

                                            <span class={styles.dependencySummaryMarker} aria-hidden="true">
                                                {"\u25B6"}
                                            </span>
                                        </div>
                                    )}
                                    renderPanel={(getVisibilityTarget, getTransitionDurationMs) => (
                                        <div
                                            class={styles.dependencyGroups}
                                            style={{
                                                opacity: getVisibilityTarget(),
                                                transition: `opacity ${getTransitionDurationMs()}ms`,
                                            }}
                                        >
                                            <Index each={DEPENDENCY_GROUPS}>
                                                {(getGroup) => (
                                                    <Show when={getSectionNames()[getGroup().key].length}>
                                                        <div class={styles.dependencyGroup}>
                                                            <span class={styles.dependencyLabel}>
                                                                {getGroup().label}
                                                            </span>

                                                            <Index each={getSectionNames()[getGroup().key]}>
                                                                {(getName) => {
                                                                    const getPageName = () =>
                                                                        ROUTES_BY_KEY.get(getName().toLowerCase());

                                                                    return (
                                                                        <Show
                                                                            when={getPageName()}
                                                                            fallback={
                                                                                <span class={styles.dependencyName}>
                                                                                    {getName()}
                                                                                </span>
                                                                            }
                                                                        >
                                                                            {(getFound) => (
                                                                                <A
                                                                                    class={styles.dependencyLink}
                                                                                    href={componentToRouteName(
                                                                                        getFound(),
                                                                                    )}
                                                                                >
                                                                                    {getName()}
                                                                                </A>
                                                                            )}
                                                                        </Show>
                                                                    );
                                                                }}
                                                            </Index>
                                                        </div>
                                                    </Show>
                                                )}
                                            </Index>
                                        </div>
                                    )}
                                />
                            </div>
                        </Show>
                    );
                }}
            </Index>
        </div>
    );
};

export function AppContent(props: RouteSectionProps) {
    const [getSelectedConfig, setSelectedConfig] = createSignal<ComponentConfig>();
    const [getSearchTerm, setSearchTerm] = createSignal("");
    const [getBrowseExpanded, setBrowseExpanded] = createSignal<MenuNodeConfig[]>(VISIBLE_MENU_CONFIGS);
    const [getSearchExpanded, setSearchExpanded] = createSignal<MenuNodeConfig[]>([]);

    const getIsSearching = createMemo(() => getSearchTerm().trim().length > 0);

    const getVisibleNodes = createMemo(() => {
        if (!getIsSearching()) return MENU_NODES;

        const searchTerm = getSearchTerm().trim().toLocaleLowerCase();
        const selectedConfig = getSelectedConfig();

        return MENU_NODES.map((node) =>
            filterTreeNode(
                node,
                (config) => config === selectedConfig || config.name.toLocaleLowerCase().includes(searchTerm),
            ),
        ).filter((node): node is TreeNode<MenuNodeConfig> => node !== undefined);
    });

    createEffect(() => {
        if (!getIsSearching()) return;

        const branches = collectBranchValues(getVisibleNodes());

        setSearchExpanded(() => branches);
    });

    createEffect(() => {
        const pathName = props.location.pathname;
        const config = COMPONENT_CONFIGS_BY_ROUTE[pathName];

        setSelectedConfig(() => config);

        if (!config) return;

        const ancestors = ANCESTORS_BY_CONFIG.get(config) ?? [];

        setBrowseExpanded((previous) => [...previous, ...ancestors.filter((ancestor) => !previous.includes(ancestor))]);
    });

    const expandedSignal: SignalPair<MenuNodeConfig[]> = [
        () => (getIsSearching() ? getSearchExpanded() : getBrowseExpanded()),
        (next) => (getIsSearching() ? setSearchExpanded(() => next) : setBrowseExpanded(() => next)),
    ];

    const selectedSignal: SignalPair<MenuNodeConfig | undefined> = [getSelectedConfig, () => undefined];

    return (
        <div class={styles.appContent}>
            <nav class={styles.leftMenu} aria-label={"Library"}>
                <div class={styles.searchContainer}>
                    <PageTextField
                        value={getSearchTerm}
                        width={() => SEARCH_FIELD_WIDTH}
                        placeholder={"Search"}
                        ariaLabel={"Search components"}
                        onInput={setSearchTerm}
                    />
                </div>

                <div class={styles.menuTree}>
                    <Tree
                        nodes={getVisibleNodes}
                        valueSignal={selectedSignal}
                        expandedSignal={expandedSignal}
                        ariaLabel={"Library"}
                        linkComponent={A}
                        computeCustomText={(node) => node.value.name}
                        renderNode={(getNode, getRenderProps) => (
                            <PageTreeNodeContent
                                renderProps={getRenderProps}
                                detail={() => {
                                    const node = getNode().value;

                                    return getIsBranchConfig(node) ? `${flattenConfigs(node.children).length}` : "";
                                }}
                            >
                                {getNode().value.name}
                            </PageTreeNodeContent>
                        )}
                    />
                </div>
            </nav>

            <main class={styles.pageColumn}>
                <Show when={getSelectedConfig()} fallback={props.children}>
                    {(getConfig) => (
                        <div class={styles.pageBody}>
                            <div class={styles.pageHeader}>
                                <h1 class={styles.pageTitle}>{getConfig().name}</h1>
                                <div class={styles.pageDescription}>{getConfig().description}</div>

                                <PageDependencies name={getConfig().name} />
                            </div>

                            {props.children}
                        </div>
                    )}
                </Show>
            </main>
        </div>
    );
}

const SIZE_ANCHOR = window.screen.height;

const getWindowInnerSize = () => ({ width: window.innerWidth, height: window.innerHeight });

export function App() {
    const [getWindowSize, setWindowSize] = createSignal<Size2d>(getWindowInnerSize());

    const getViewportSize = createMemo(() => {
        const windowSize = getWindowSize();
        const ratio = windowSize.width / windowSize.height;
        const next =
            ratio >= 1
                ? { width: Math.round(SIZE_ANCHOR * ratio), height: SIZE_ANCHOR }
                : { width: SIZE_ANCHOR, height: Math.round(SIZE_ANCHOR / ratio) };

        return next;
    });

    const throttleResize = FunctionUtils.trailingThrottle(() => setWindowSize(getWindowInnerSize()), 10);

    onMount(() => {
        onCleanup(() => {
            window.removeEventListener("resize", throttleResize);
        });

        window.addEventListener("resize", throttleResize);
    });

    return (
        <div id="app" class={styles.appRoot}>
            <Router>
                <Route
                    path="/"
                    component={(props: RouteSectionProps) => (
                        <Viewport size={getViewportSize}>
                            <AppContent {...props} />
                        </Viewport>
                    )}
                >
                    <Route path="/" component={EmptyPage} />
                    {COMPONENT_CONFIGS.map((config) => (
                        <Route path={componentToRouteName(config.name)} component={config.component ?? EmptyPage} />
                    ))}
                </Route>
            </Router>
        </div>
    );
}
