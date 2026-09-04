import type { JSX } from "solid-js";
import { Index, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import COMPONENT_DEPENDENCIES from "virtual:component-dependencies";

import { A, Route, type RouteSectionProps, Router } from "@solidjs/router";
import { TabPanel, Tabs, Viewport } from "@thewaver/ss-components";
import type { Tab } from "@thewaver/ss-components";
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
import { ToastsPage } from "./Pages/ToastsPage/ToastsPage";
import { TogglePage } from "./Pages/TogglePage/TogglePage";
import { ToolbarPage } from "./Pages/ToolbarPage/ToolbarPage";
import { TimelinePage } from "./Pages/TimelinePage/TimelinePage";
import { TrailPage } from "./Pages/TrailPage/TrailPage";
import { TreePage } from "./Pages/TreePage/TreePage";
import { TypewriterPage } from "./Pages/TypewriterPage/TypewriterPage";
import { ViewportPage } from "./Pages/ViewportPage/ViewportPage";
import { VirtualizerPage } from "./Pages/VirtualizerPage/VirtualizerPage";
import { WheelPage } from "./Pages/WheelPage/WheelPage";
import { PageTextField } from "./StyledComponents/Field/Field";

import * as styles from "./App.css";

type ComponentConfig = {
    name: string;
    description: string;
    component: () => JSX.Element;
};

type CategoryConfig = {
    name: string;
    components: ComponentConfig[];
    hidden?: boolean;
};

const componentToRouteName = (name: string) => `/${StringUtils.camelToKebabCase(name)}`;

const componentToTabId = (name: string) => `menu-tab-${StringUtils.camelToKebabCase(name)}`;

const componentToPanelId = (name: string) => `menu-panel-${StringUtils.camelToKebabCase(name)}`;

const SHOW_COMPOSITES = false;
const SEARCH_FIELD_WIDTH = 200;

const CATEGORY_CONFIGS: CategoryConfig[] = [
    {
        name: "Abstracts",
        components: [
            {
                name: "InteractionTracker",
                description:
                    "Everything the library knows about a pointer on an element: the hover, focus and press flags a painter reads; a hold that stops a carousel while it is looked at; a drag reported as a ratio of the element's own box; and a swipe that reports travel while it lasts and a verdict when it ends.",
                component: () => <InteractionTrackerPage />,
            },
            {
                name: "PointerTracker",
                description:
                    "Reports where the pointer is relative to one element: the offset from its centre, the angle, the distance, and the point where that same line leaves the element. Dividing the two distances gives one shape-aware number — below 1 inside, 1 on the edge, 2 a further element-radius away. It renders nothing at all; every example on this page is a consumer built on top of it.",
                component: () => <PointerTrackerPage />,
            },
            {
                name: "SVGFilters",
                description:
                    "The builder behind every filter the library paints with: primitives are added one call at a time and the assembly decides what they see. Chained, each one is handed what the one before it produced; isolated, every one reads the original and the results are merged back over it. The region is the other half — a blur, a shadow or a displacement all reach outside the element's box, and the builder works out how far and reserves it.",
                component: () => <SVGFiltersPage />,
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
        name: "Exotics",
        components: [
            {
                name: "Bracket",
                description:
                    "A tree drawn in layers with elbow connectors between a node and the nodes that feed it — a knockout draw being the arrangement it was asked for, and an org chart or a skill tree the same component with a different tree. A node sits centred between the ones it feeds from, which propagates upward and is the whole of the layout; a node with one child sits level with it, which is what a bye looks like. The arrows walk a layer and step between layers, on one tab stop.",
                component: () => <BracketPage />,
            },
            {
                name: "CellAnimation",
                description:
                    "Cuts an image into a grid and animates the cells on a stagger, where a cell's turn comes from a weight rather than from its index. The animations, weights and origins on this page are Playground samples — the component itself only asks for a function from timeline to result.",
                component: () => <CellAnimationPage />,
            },
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
                name: "Odometer",
                description:
                    "A number where each digit is a column that turns to its new value, so a change reads as travel rather than a swap. The columns turn the way the number is going, so nine to zero keeps going forward instead of rewinding, and a column waits for every column to its right that is also carrying. It takes the text rather than the number, so a separator is a slot that never turns and the component owns no locale.",
                component: () => <OdometerPage />,
            },
            {
                name: "PatchBoard",
                description:
                    "Boxes a person places by hand, sockets on their edges, and cables dragged from one socket to another. The board owns the geometry and the wiring rules: a cable stays fixed to its socket while the box it hangs off is dragged, an input already carrying a cable refuses a second, a node cannot be wired to itself, and the consumer can refuse a pair on top of that. Everything a pointer does is also a tap and a keystroke — pick up, aim, drop, Escape to put back — so a graph can be wired without a mouse.",
                component: () => <PatchBoardPage />,
            },
            {
                name: "Reveal",
                description:
                    "A cover with a hole cut where the pointer is. The cover is the consumer's — opaque, frosted, or something that reads what it is told — and the component hands it the mask that cuts the hole and whether a reveal is happening.",
                component: () => <RevealPage />,
            },
            {
                name: "RichText",
                description:
                    "Paints a plain string that carries bracketed tags — [b], [i], [s], [u], [li] — so text arriving from a server or a file can say which of its words are emphasised without bringing markup along. Nothing is handed to the browser as HTML: the string is parsed into a tree of runs and painted with classes the consumer supplies, and a tag it does not recognise is either left on screen exactly as typed or dropped, whichever the consumer asks for.",
                component: () => <RichTextPage />,
            },
            {
                name: "Satellite",
                description:
                    "Anchors one element to another and grows its own box to cover both, so a badge hanging off a corner still takes part in the parent's layout instead of spilling out of it. The placement vocabulary is the one Anchor already uses for floating layers.",
                component: () => <SatellitePage />,
            },
            {
                name: "ScanlineAnimation",
                description:
                    "The same staggering applied to horizontal lines instead of a grid, so an image can be swept, split or glitched a row at a time. The seven examples differ only in the function they hand it.",
                component: () => <ScanlineAnimationPage />,
            },
            {
                name: "ScrambleText",
                description:
                    "Text that arrives as noise and settles into itself, one position at a time. Each character sits over the one it is going to become, so nothing changes width and the line cannot rewrap while it churns; the spaces are left alone, which is what keeps the line breaks where they were. Which glyph the noise is drawn from and the order the positions settle in are both the consumer's, the second as a weight per character in the same 0..1 vocabulary the animation samples use.",
                component: () => <ScrambleTextPage />,
            },
            {
                name: "ScratchCard",
                description:
                    "A cover the pointer rubs off, exposing what is under it and reporting how much has gone. The cover is a grid of cells rather than a canvas, so what has been scratched is an exact count rather than a sampled estimate and the resolution is the consumer's; crossing a threshold takes the rest of it away. Pressing it with the keyboard reveals the lot, because a control that only answers to dragging cannot be operated without a pointer.",
                component: () => <ScratchCardPage />,
            },
            {
                name: "ScreenWiper",
                description:
                    "Covers and uncovers the screen with a tessellation of staggered cells. Each cell is one div clipped by CSS rather than an SVG shape, because several hundred independent transforms composite far better than one viewport-sized SVG.",
                component: () => <ScreenWiperPage />,
            },
            {
                name: "Shape",
                description:
                    "Draws a border and a fill around arbitrary children, from a point list rather than a CSS box. It only reaches for SVG when the paint needs it and stays a plain div when it does not.",
                component: () => <ShapePage />,
            },
            {
                name: "SortableGrid",
                description:
                    "An inventory board: items cover a rectangle of cells rather than a place in a line, they stay exactly where they are put, and the shape of the space left over is what decides whether the next thing fits. It shares its carry with Sortable — the same drag, the same tap to pick and tap to place, the same keyboard pick-move-drop — with an aim that can be refused, so a landing over an occupied cell or off the edge is shown and then declined rather than silently corrected.",
                component: () => <SortableGridPage />,
            },
            {
                name: "Staircase",
                description:
                    "Stacks rows and insets each one by a function of its index, which makes a funnel, a spindle or a zigzag depending on the function. The direction knob hands the steps back to front rather than asking the function to know about direction.",
                component: () => <StaircasePage />,
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
            {
                name: "Trail",
                description:
                    "One element travelling a path the consumer draws, on a frame loop rather than a CSS animation, so where it is right now is a value anything can read. It reports the point and the direction of travel at every frame and can turn the traveller to face along it; the controller plays, pauses and seeks, which is what lets a slider put it anywhere on the path.",
                component: () => <TrailPage />,
            },
            {
                name: "TypeWriter",
                description:
                    "Reveals text one character at a time without flattening it first, so a bold run or a nested element still animates in place.",
                component: () => <TypewriterPage />,
            },
            {
                name: "Viewport",
                description:
                    "Scales everything inside it to one design size. It is terminal: anything measured, anchored or portalled within it works in the viewport's coordinates rather than the window's.",
                component: () => <ViewportPage />,
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
        name: "Fundamentals",
        components: [
            {
                name: "Accordion",
                description:
                    "A set of disclosure sections, each a heading that opens a region. A collapsed panel stays built and measured, which is what lets it animate to its own height rather than to a guess.",
                component: () => <AccordionPage />,
            },
            {
                name: "Breadcrumbs",
                description:
                    "A trail of links to where you are, as a navigation landmark holding an ordered list. The last crumb is the page itself, so it is not a link and says so.",
                component: () => <BreadcrumbsPage />,
            },
            {
                name: "Button",
                description:
                    "The plain button, plus the two things it owns that a native one does not: a name that wins over whatever the painter draws, and a pointer report a repeating control can hold.",
                component: () => <ButtonPage />,
            },
            {
                name: "Calendar",
                description:
                    "A month grid over a date value that carries its own calendar system, so first day, last day and era are asked of the value rather than assumed to be Gregorian.",
                component: () => <CalendarPage />,
            },
            {
                name: "Carousel",
                description:
                    "One slide at a time, wrapping at both ends, and the only component here that moves without being asked. That is what makes the stop control and the holds a conformance requirement rather than a nicety: it pauses under the pointer, while anything inside it holds focus, and while the tab is in the background.",
                component: () => <CarouselPage />,
            },
            {
                name: "Checkbox",
                description:
                    "One of three presets over a shared binary switch. It is the only one with a third state — indeterminate is a value here, not a styling trick.",
                component: () => <CheckboxPage />,
            },
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
            {
                name: "CurrencyInput",
                description:
                    "A money field, and deliberately not a number field with grouping switched on: the currency decides the symbol, which side it sits on and how many decimals there are, so the mask follows from the locale.",
                component: () => <CurrencyInputPage />,
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
                name: "Drawer",
                description:
                    "A modal that arrives from an edge. It is a preset rather than a mode, because a panel cannot become a centred dialog while it is open.",
                component: () => <DrawerPage />,
            },
            {
                name: "FileInput",
                description:
                    "A file field where the operating system owns the dialog. The component owns what activates it and what comes back.",
                component: () => <FileInputPage />,
            },
            {
                name: "Form",
                description:
                    "Association and announcement, and nothing else. The library generates the ids and wires a control to its message; whether a value is valid is the consumer's to decide and to report.",
                component: () => <FormPage />,
            },
            {
                name: "ImageSwitcher",
                description:
                    "Cross-fades between image sources, loading the next one out of sight first so a slow or missing file never leaves a hole where the old picture was.",
                component: () => <ImageSwitcherPage />,
            },
            {
                name: "Label",
                description:
                    "A caption that wraps its control rather than pointing at it by id, so nothing has to be kept unique or in sync. It paints nothing at all, cursor included.",
                component: () => <LabelPage />,
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
                name: "NumberInput",
                description:
                    "A number field with steppers that repeat while held, and the first field to take a codec — the thing that turns typed characters into a value and back.",
                component: () => <NumberInputPage />,
            },
            {
                name: "Paginator",
                description:
                    "A page-range control, and the arithmetic is the point: which page numbers are worth showing, where the gaps fall, and which pages each gap stands for. The consumer knows the address shape, so it computes an href from a page rather than authoring the list.",
                component: () => <PaginatorPage />,
            },
            {
                name: "Preview",
                description:
                    "Content shown down to a height you set, with a control that opens it the rest of the way. Unlike a disclosure, nothing is ever hidden — the opening lines are readable from the start, which is why the part still folded away stays in the accessibility tree rather than going inert.",
                component: () => <PreviewPage />,
            },
            {
                name: "Progress",
                description:
                    "The one Fundamental with no interaction in it: state in, paint out. The painter is handed a ratio as well as the raw value, so clamping is never repeated at the call site.",
                component: () => <ProgressPage />,
            },
            {
                name: "Radio",
                description:
                    "The third preset over the shared binary switch, and the one whose group rather than whose item owns which is chosen.",
                component: () => <RadioPage />,
            },
            {
                name: "Range",
                description:
                    "A slider with one or two thumbs, on either axis. The drag arrives as a ratio along the track rather than as pixels.",
                component: () => <RangePage />,
            },
            {
                name: "RangeCalendar",
                description:
                    "The same month grid over a span rather than a day. The value is one { start, end } signal, and the state while only the first end has been picked belongs to the component rather than to the consumer, so a half-entered range is never something a caller has to hold.",
                component: () => <RangeCalendarPage />,
            },
            {
                name: "Scroller",
                description:
                    "A strip too wide for its box, paged by a previous and a next button instead of a scrollbar. It holds whatever it is given without rendering or typing it, it never claims the arrow keys — whatever is inside may already own them — and when a child is focused it scrolls just far enough to show that child whole.",
                component: () => <ScrollerPage />,
            },
            {
                name: "Select",
                description:
                    "A list of options in a popup over one value or several. Filtering is the consumer's — autocomplete narrows what is shown, and the component never decides what counts as a match.",
                component: () => <SelectPage />,
            },
            {
                name: "SlideButton",
                description:
                    "A confirmation you drag rather than press. Holding it is the single-pointer route the standard asks for, so the gesture is never the only way through.",
                component: () => <SlideButtonPage />,
            },
            {
                name: "Spotlight",
                description:
                    "Cuts a hole in an overlay around one element. Three presets rather than one mode prop, because a hint, a prompt and a guide can never become one another while open.",
                component: () => <SpotlightPage />,
            },
            {
                name: "SplitPane",
                description:
                    "Resizable panes over a CSS grid: the ratios are fr shares and a pane's bounds are a clamp, so a window resize is the browser's arithmetic rather than the component's. When the minimums cannot all fit, it overflows, exactly as grid does.",
                component: () => <SplitPanePage />,
            },
            {
                name: "Stepper",
                description:
                    "A progress strip whose per-step states are the consumer's to invent — the library owns only which step is current, and insists that whatever a state means reaches the step's name as words rather than as paint alone.",
                component: () => <StepperPage />,
            },
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
                name: "Tabs",
                description:
                    "A tab list built from records rather than from children, so the same list can be buttons, anchors, or a consumer's own link component. The panel is optional, and pairing it is the consumer's to wire.",
                component: () => <TabsPage />,
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
            {
                name: "Toasts",
                description:
                    "A queue the consumer owns. The component shows what is in it and reports when one is finished; nothing is added or dropped behind the consumer's back.",
                component: () => <ToastsPage />,
            },
            {
                name: "Toggle",
                description:
                    "A preset over the shared binary switch. What separates it from a checkbox is what it announces and when the change takes effect, not what it stores.",
                component: () => <TogglePage />,
            },
            {
                name: "Toolbar",
                description:
                    "A row of actions that measures itself and moves whatever does not fit into a menu at the end. The row is one tab stop with the arrows walking it, and an action that leaves the row leaves that walk with it. Each action is described once and painted twice — as a button in the row and as a row in the menu — and can refuse to collapse, or insist on it.",
                component: () => <ToolbarPage />,
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
        name: "Composites",
        hidden: !SHOW_COMPOSITES,
        components: [
            {
                name: "Surface",
                description:
                    "A box that takes the SVG path only when its fill or stroke needs one, and stays a plain div with inline radii when it does not.",
                component: () => <SurfacePage />,
            },
        ],
    },
];

type MenuCategory = {
    name: string;
    hidden?: boolean;
    tabs: Tab<ComponentConfig>[];
};

const MENU_CATEGORIES: MenuCategory[] = CATEGORY_CONFIGS.map((category) => ({
    name: category.name,
    hidden: category.hidden,
    tabs: category.components.map((component) => ({
        value: component,
        href: componentToRouteName(component.name),
        id: componentToTabId(component.name),
        panelId: componentToPanelId(component.name),
    })),
}));

const COMPONENT_CONFIGS = CATEGORY_CONFIGS.flatMap((category) => category.components);

const COMPONENT_CONFIGS_BY_ROUTE = Object.fromEntries(
    COMPONENT_CONFIGS.map((config) => [componentToRouteName(config.name), config]),
);

const DEPENDENCIES_BY_KEY = new Map(
    Object.entries(COMPONENT_DEPENDENCIES).map(([name, dependencies]) => [name.toLowerCase(), dependencies]),
);

const ROUTES_BY_KEY = new Map(COMPONENT_CONFIGS.map((config) => [config.name.toLowerCase(), config.name]));

const DEPENDENCY_GROUPS = [
    { key: "abstracts" as const, label: "Abstracts" },
    { key: "components" as const, label: "Components" },
];

const PageDependencies = (props: { name: string }) => {
    const getDependencies = () => DEPENDENCIES_BY_KEY.get(props.name.toLowerCase());

    return (
        <div class={styles.tabPageDependencies}>
            <Index each={DEPENDENCY_GROUPS}>
                {(getGroup) => (
                    <Show when={getDependencies()?.[getGroup().key].length}>
                        <div class={styles.dependencyGroup}>
                            <span class={styles.dependencyLabel}>{getGroup().label}</span>

                            <Index each={getDependencies()?.[getGroup().key] ?? []}>
                                {(getName) => {
                                    const getPageName = () => ROUTES_BY_KEY.get(getName().toLowerCase());

                                    return (
                                        <Show
                                            when={getPageName()}
                                            fallback={<span class={styles.dependencyName}>{getName()}</span>}
                                        >
                                            {(getFound) => (
                                                <A
                                                    class={styles.dependencyName}
                                                    href={componentToRouteName(getFound())}
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
    );
};

export function AppContent(props: RouteSectionProps) {
    const [getSelectedConfig, setSelectedConfig] = createSignal<ComponentConfig>();
    const [getSearchTerm, setSearchTerm] = createSignal("");

    const getVisibleCategories = createMemo(() => {
        const selectedConfig = getSelectedConfig();
        const searchTerm = getSearchTerm().toLocaleLowerCase();

        return MENU_CATEGORIES.filter((category) => !category.hidden)
            .map((category) => ({
                name: category.name,
                tabs: searchTerm
                    ? category.tabs.filter(
                          (tab) =>
                              tab.value === selectedConfig || tab.value.name.toLocaleLowerCase().includes(searchTerm),
                      )
                    : category.tabs,
            }))
            .filter((category) => category.tabs.length > 0);
    });

    createEffect(() => {
        const pathName = props.location.pathname;

        setSelectedConfig(() => COMPONENT_CONFIGS_BY_ROUTE[pathName]);
    });

    return (
        <div class={styles.appContent}>
            <div class={styles.leftMenu}>
                <div class={styles.searchContainer}>
                    <PageTextField
                        value={getSearchTerm}
                        width={() => SEARCH_FIELD_WIDTH}
                        placeholder={"Search"}
                        ariaLabel={"Search components"}
                        onInput={setSearchTerm}
                    />
                </div>

                <Index each={getVisibleCategories()}>
                    {(getCategory) => (
                        <div class={styles.menuSection}>
                            <h2 class={styles.menuCategory}>{getCategory().name}</h2>

                            <Tabs
                                dir={"column"}
                                ariaLabel={() => getCategory().name}
                                tabs={() => getCategory().tabs}
                                selectedValue={getSelectedConfig}
                                onSelectionChange={(config) => setSelectedConfig(() => config)}
                                linkComponent={A}
                                renderFloater={(getVisibilityTarget, getTransitionDurationMs) => (
                                    <div
                                        class={styles.tabFloater}
                                        classList={{ [styles.isVisible]: getVisibilityTarget() === 1 }}
                                        style={{ "transition-duration": `${getTransitionDurationMs()}ms` }}
                                    />
                                )}
                                renderTab={(getTab) => (
                                    <div
                                        class={styles.tabItem}
                                        classList={{ [styles.isSelected]: getTab().value === getSelectedConfig() }}
                                    >
                                        {getTab().value.name}
                                    </div>
                                )}
                            />
                        </div>
                    )}
                </Index>
            </div>

            <div class={styles.tabPage}>
                <Show when={getSelectedConfig()} fallback={props.children}>
                    {(getConfig) => (
                        <TabPanel
                            id={() => componentToPanelId(getConfig().name)}
                            tabId={() => componentToTabId(getConfig().name)}
                        >
                            <div class={styles.tabPanelBody}>
                                <div class={styles.tabPageHeader}>
                                    <div class={styles.tabPageTitle}>{getConfig().name}</div>
                                    <div class={styles.tabPageDescription}>{getConfig().description}</div>

                                    <PageDependencies name={getConfig().name} />
                                </div>

                                {props.children}
                            </div>
                        </TabPanel>
                    )}
                </Show>
            </div>
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
                    <Route path="/" component={() => <>{null}</>} />
                    {COMPONENT_CONFIGS.map((config) => (
                        <Route path={componentToRouteName(config.name)} component={config.component} />
                    ))}
                </Route>
            </Router>
        </div>
    );
}
