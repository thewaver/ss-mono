import type { JSX } from "solid-js";
import { Index, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import COMPONENT_DEPENDENCIES from "virtual:component-dependencies";
import type { DependencyNames } from "virtual:component-dependencies";

import { A, Navigate, Route, type RouteSectionProps, Router } from "@solidjs/router";
import { Checkbox, Collapsible, Label, Tree, ViewportWrapper } from "@thewaver/ss-components";
import type { SignalPair, TreeNode } from "@thewaver/ss-components";
import { FunctionUtils, Size2d, StringUtils } from "@thewaver/ss-utils";

import { PageDocsView } from "./PageComponents/DocsView/DocsView";
import { PageViewTabs } from "./PageComponents/ViewTabs/ViewTabs";
import { toBaseRoute, toPageViewRoute } from "./PageComponents/ViewTabs/ViewTabs.const";
import { AccordionPage } from "./Pages/Accordions/AccordionPage/AccordionPage";
import { CollapsiblePage } from "./Pages/Accordions/CollapsiblePage/CollapsiblePage";
import { AudioSwitcherPage } from "./Pages/AudioSwitcherPage/AudioSwitcherPage";
import { BracketPage } from "./Pages/BracketPage/BracketPage";
import { BreadcrumbsPage } from "./Pages/BreadcrumbsPage/BreadcrumbsPage";
import { ButtonPage } from "./Pages/ButtonPage/ButtonPage";
import { CalendarPage } from "./Pages/CalendarPage/CalendarPage";
import { CardStackPage } from "./Pages/CardStackPage/CardStackPage";
import { DrumCarouselPage } from "./Pages/Carousels/DrumCarouselPage/DrumCarouselPage";
import { TrackCarouselPage } from "./Pages/Carousels/TrackCarouselPage/TrackCarouselPage";
import { CellAnimationPage } from "./Pages/CellAnimationPage/CellAnimationPage";
import { CheckboxGroupPage } from "./Pages/CheckboxGroupPage/CheckboxGroupPage";
import { CheckboxPage } from "./Pages/CheckboxPage/CheckboxPage";
import { CirclePackingPage } from "./Pages/CirclePackingPage/CirclePackingPage";
import { ClockPage } from "./Pages/ClockPage/ClockPage";
import { ColorAreaPage } from "./Pages/ColorAreaPage/ColorAreaPage";
import { ColorInputPage } from "./Pages/ColorInputPage/ColorInputPage";
import { CornersPage } from "./Pages/CornersPage/CornersPage";
import { CuboidPage } from "./Pages/CuboidPage/CuboidPage";
import { CurrencyInputPage } from "./Pages/CurrencyInputPage/CurrencyInputPage";
import { DateInputPage } from "./Pages/DateInputPage/DateInputPage";
import { DatePickerPage } from "./Pages/DatePickerPage/DatePickerPage";
import { DateRangePickerPage } from "./Pages/DateRangePickerPage/DateRangePickerPage";
import { DateTimePickerPage } from "./Pages/DateTimePickerPage/DateTimePickerPage";
import { DiePage } from "./Pages/DiePage/DiePage";
import { DrawerPage } from "./Pages/DrawerPage/DrawerPage";
import { EdgeFaderPage } from "./Pages/EdgeFaderPage/EdgeFaderPage";
import { FileInputPage } from "./Pages/FileInputPage/FileInputPage";
import { FlipCardPage } from "./Pages/FlipCardPage/FlipCardPage";
import { FormFieldPage } from "./Pages/FormFieldPage/FormFieldPage";
import { FormPage } from "./Pages/FormPage/FormPage";
import { FormSectionPage } from "./Pages/FormSectionPage/FormSectionPage";
import { FormationPage } from "./Pages/FormationPage/FormationPage";
import { GlassSurfacePage } from "./Pages/GlassSurfacePage/GlassSurfacePage";
import { HoverCardPage } from "./Pages/HoverCardPage/HoverCardPage";
import { IciclePage } from "./Pages/IciclePage/IciclePage";
import { ImageSwitcherPage } from "./Pages/ImageSwitcherPage/ImageSwitcherPage";
import { LabelPage } from "./Pages/LabelPage/LabelPage";
import { ListboxPage } from "./Pages/ListboxPage/ListboxPage";
import { MenubarPage } from "./Pages/MenubarPage/MenubarPage";
import { FanMenuPage } from "./Pages/Menus/FanMenuPage/FanMenuPage";
import { MenuPage } from "./Pages/Menus/MenuPage/MenuPage";
import { WheelMenuPage } from "./Pages/Menus/WheelMenuPage/WheelMenuPage";
import { ModalPage } from "./Pages/ModalPage/ModalPage";
import { ElementMosaicPage } from "./Pages/Mosaics/ElementMosaicPage/ElementMosaicPage";
import { ImageMosaicPage } from "./Pages/Mosaics/ImageMosaicPage/ImageMosaicPage";
import { MultiSelectPage } from "./Pages/MultiSelectPage/MultiSelectPage";
import { NumberInputPage } from "./Pages/NumberInputPage/NumberInputPage";
import { OdometerPage } from "./Pages/OdometerPage/OdometerPage";
import { PaginatorPage } from "./Pages/PaginatorPage/PaginatorPage";
import { ParticleSpawnerPage } from "./Pages/ParticleSpawnerPage/ParticleSpawnerPage";
import { PatchBoardPage } from "./Pages/PatchBoardPage/PatchBoardPage";
import { LightCatcherPage } from "./Pages/PointerEffects/LightCatcherPage/LightCatcherPage";
import { ShadowCasterPage } from "./Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage";
import { TilterPage } from "./Pages/PointerEffects/TilterPage/TilterPage";
import { PreviewPage } from "./Pages/PreviewPage/PreviewPage";
import { ProgressPage } from "./Pages/ProgressPage/ProgressPage";
import { RadioPage } from "./Pages/RadioPage/RadioPage";
import { RangeCalendarPage } from "./Pages/RangeCalendarPage/RangeCalendarPage";
import { RangePage } from "./Pages/RangePage/RangePage";
import { RevealPage } from "./Pages/Reveals/RevealPage/RevealPage";
import { ScratchCardPage } from "./Pages/Reveals/ScratchCardPage/ScratchCardPage";
import { RichTextPage } from "./Pages/RichTextPage/RichTextPage";
import { SVGFiltersPage } from "./Pages/SVGFiltersPage/SVGFiltersPage";
import { TimedGradientsPage } from "./Pages/SVGGradients/TimedGradientsPage/TimedGradientsPage";
import { TrackedGradientsPage } from "./Pages/SVGGradients/TrackedGradientsPage/TrackedGradientsPage";
import { SVGPatternsPage } from "./Pages/SVGPatternsPage/SVGPatternsPage";
import { SatellitePage } from "./Pages/SatellitePage/SatellitePage";
import { ScanlineAnimationPage } from "./Pages/ScanLineAnimationPage/ScanLineAnimationPage";
import { ScrambleTextPage } from "./Pages/ScrambleTextPage/ScrambleTextPage";
import { ScrollerPage } from "./Pages/ScrollerPage/ScrollerPage";
import { SegmentedInputPage } from "./Pages/SegmentedInputPage/SegmentedInputPage";
import { SelectPage } from "./Pages/SelectPage/SelectPage";
import { ShapePage } from "./Pages/ShapePage/ShapePage";
import { SlideButtonPage } from "./Pages/SlideButtonPage/SlideButtonPage";
import { SortableGridPage } from "./Pages/SortableGridPage/SortableGridPage";
import { SortablePage } from "./Pages/SortablePage/SortablePage";
import { SplitPanePage } from "./Pages/SplitPanePage/SplitPanePage";
import { SpotlightGuidePage } from "./Pages/Spotlights/SpotlightGuidePage/SpotlightGuidePage";
import { SpotlightHintPage } from "./Pages/Spotlights/SpotlightHintPage/SpotlightHintPage";
import { SpotlightPromptPage } from "./Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage";
import { StaircasePage } from "./Pages/StaircasePage/StaircasePage";
import { StepperPage } from "./Pages/StepperPage/StepperPage";
import { SunburstPage } from "./Pages/SunburstPage/SunburstPage";
import { SurfacePage } from "./Pages/SurfacePage/SurfacePage";
import { TableOfContentsPage } from "./Pages/TableOfContentsPage/TableOfContentsPage";
import { TablePage } from "./Pages/TablePage/TablePage";
import { TabsPage } from "./Pages/TabsPage/TabsPage";
import { TagInputPage } from "./Pages/TagInputPage/TagInputPage";
import { TextAreaPage } from "./Pages/TextAreaPage/TextAreaPage";
import { TextInputPage } from "./Pages/TextInputPage/TextInputPage";
import { TileBoardPage } from "./Pages/TileBoardPage/TileBoardPage";
import { TimeInputPage } from "./Pages/TimeInputPage/TimeInputPage";
import { TimePickerPage } from "./Pages/TimePickerPage/TimePickerPage";
import { TimelinePage } from "./Pages/TimelinePage/TimelinePage";
import { ToastsPage } from "./Pages/ToastsPage/ToastsPage";
import { TogglePage } from "./Pages/TogglePage/TogglePage";
import { ToolbarPage } from "./Pages/ToolbarPage/ToolbarPage";
import { TooltipPage } from "./Pages/TooltipPage/TooltipPage";
import { TrailPage } from "./Pages/TrailPage/TrailPage";
import { TreePage } from "./Pages/TreePage/TreePage";
import { TreemapPage } from "./Pages/TreemapPage/TreemapPage";
import { TypewriterPage } from "./Pages/TypewriterPage/TypewriterPage";
import { ViewportWrapperPage } from "./Pages/ViewportWrapperPage/ViewportWrapperPage";
import { DrumWheelPage } from "./Pages/Wheels/DrumWheelPage/DrumWheelPage";
import { OverheadWheelPage } from "./Pages/Wheels/OverheadWheelPage/OverheadWheelPage";
import { PageCheckboxContent } from "./StyledComponents/CheckboxContent/CheckboxContent";
import { PageTextField } from "./StyledComponents/Field/Field";
import { PageLabelCaption } from "./StyledComponents/LabelCaption/LabelCaption";
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

const PassThroughPage = (props: RouteSectionProps) => <>{props.children}</>;

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
                name: "Anchor",
                description:
                    "Where a floating layer goes, as two independent choices — one across, one down — and a fallback that may only pick another candidate from its own family, so a list asked to sit to the right of a field can end up on its left but never above it. It also asks Elevation what the anchor is inside, which is what keeps a popup opened from within a raised layer in front of that layer rather than behind it.",
            },
            {
                name: "Carrier",
                description:
                    "The one carry every pick-up-and-put-down control in the library shares. A zone says what it will accept, what a point inside it means, and whether a landing is allowed; the carry itself — what is held, where it came from, where it is aimed now — is a single stack holding at most one thing. That is what lets an item leave one list and arrive in a different control entirely, and it is why a drag, a tap to pick and a tap to place, and a keyboard pick-move-drop are three ways into the same machinery rather than three implementations of it.",
            },
            {
                name: "CheckedState",
                description:
                    "Three states rather than two, and the single rule that decides the third: with every member of a group agreeing, the group is what they agree on, and with them disagreeing it is mixed. A checkbox's indeterminate and a select group's header are the same value read in two places.",
            },
            {
                name: "ColorExtractor",
                description:
                    "Reads colors back out of an image — the one dominant color, or a palette of as many as are asked for — by loading it out of sight and sampling it. It samples a fraction of the pixels rather than all of them, and the fraction is the consumer's to set, so the cost is a knob rather than a fixed price. An image that fails to load is reported as a value rather than thrown.",
            },
            {
                name: "Cutout",
                description:
                    "A hole in an element, cut with a mask rather than drawn as four boxes around it. Two mask layers — one covering the whole element, one covering just the hole — are composited so the second subtracts from the first, and the hole can be a plain rectangle or any image handed in, which is what lets its edge be soft or rounded instead of a hard corner.",
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
                name: "ElementObserver",
                description:
                    "Measuring, in the four shapes the library actually needs: one element's box, a list of boxes at once, a height on its own, and a rectangle in viewport coordinates. The last is the odd one out — it re-reads every frame while the thing is visible, because there is no event for the element you are anchored to having moved. Beside them sits the rule a table of contents follows: of a list of elements, the current one is the last whose top has scrolled past a line near the top of the viewport.",
            },
            {
                name: "Elevation",
                description:
                    "Which stacking level a floating layer has to beat. Every raised layer registers its element and its level; anything about to open asks what it is inside and is given the highest level containing it. Without it, a popup opened from inside a dialog appears behind the dialog — the one stacking fault that cannot be fixed with CSS from outside.",
            },
            {
                name: "Flattener",
                description:
                    "Turns a tree into the flat list of rows that are on screen, and hands each row what the markup needs: its depth, which number it is among its siblings, how many siblings there are, and whether it is open. One walk produces all of it, which is the point — counting a node's siblings separately for each row walks the same tree again for every row on screen. A select's option groups and a tree's branches are this walk with different questions asked of each node.",
            },
            {
                name: "FocusManager",
                description:
                    "What counts as focusable, and the two things done with the answer: keeping Tab inside a dialog by sending it from the last element back to the first, and putting focus where it was when a layer closes. Being reachable is a stricter test than matching the selector — anything inside an inert subtree, hidden from the accessibility tree, or with no boxes at all is skipped — so the trap never lands on something the eye cannot find.",
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
            },
            {
                name: "LiveAnnouncer",
                description:
                    "The live region that belongs to no component. A message is appended to one of two hidden regions — polite and assertive — made on first use and taken away a second later, because a region still holding its text says nothing at all the next time the same text arrives. Anything that changes while the eye is elsewhere goes through here: an item landing in a list, a wheel coming to rest, a notification arriving.",
            },
            {
                name: "MaskedField",
                description:
                    "The half that every field over a typed value shares: the text on screen, the digits behind it, and what happens when the two disagree. A value is committed only when the digits make one, what was typed is left alone when they do not, and the field is put back to the value on blur. A date, a time and an amount are this object with a different formatter.",
            },
            {
                name: "MediaQueryMonitor",
                description:
                    "A media query as a signal, with one listener per query however many components ask for it. Reduced motion is the query with a name of its own, since it is the one the library itself has to answer to.",
            },
            {
                name: "Navigator",
                description:
                    "The arithmetic behind every arrow-key walk: the next position along a line, and the next cell in a grid. The grid walk neither wraps nor clamps — it answers with nothing when the step leaves the grid — because a table, a calendar and a tile board all need to hear that the step went off the edge, and each does something different with it.",
            },
            {
                name: "Placement",
                description:
                    "Where a control's items go when they are not in a row. A layout is a function from an item count, the path down to the level being drawn, the size of the level above it and the placement of the item that opened it, to a list of boxes in fractions of the arrangement's own width — so it resolves in CSS with nothing measured in JavaScript. A box may also name the wedge of a ring it occupies, which is what lets a control hand its painter a shape rather than a rectangle. The layouts themselves are under `PlacementLayouts`; what stays here is the vocabulary, the picking that answers which item a direction means, and the sector and link path builders. Every control that takes a layout shows it on its own page.",
            },
            {
                name: "PointerTracker",
                description:
                    "Reports where the pointer is relative to one element: the offset from its center, the angle, the distance, and the point where that same line leaves the element. Dividing the two distances gives one shape-aware number — below 1 inside, 1 on the edge, 2 a further element-radius away. It renders nothing at all, so what it does is seen through the things built on it: `Tilter` leans a surface away from the pointer and `ShadowCaster` throws a shadow the other way.",
            },
            {
                name: "Proximity",
                description:
                    "The other half of a layout: where `Placement` says where an arrangement's items go, this says what being near the pointer does to one of them. An effect is a function from one item's measurements to a set of CSS transform and filter values, so a dock's swell, a glow and a blur that lifts as the pointer nears are the same mechanism with a different answer. What makes it work across arrangements is that nearness is not a straight line: a row counts the horizontal gap and nothing else, a ring counts the turn between two wedges and, separately, how far off the band the pointer is — a turn never making up for the second — and each arrangement names the rule it is read by. The axis a rule throws away is read once more as a yes or a no — inside the arrangement's box or not — so ignoring an axis does not mean answering a pointer that has walked away. It never strips a response it thinks is motion — the reduced-motion preference arrives in the measurements instead, because only the consumer knows what to put in movement's place. The effects themselves are under `ProximityEffects`; every control that takes a layout takes one of these too.",
            },
            {
                name: "Rotator",
                description:
                    "The spin both wheels share: given a number of steps and a function that answers with the one to land on, it turns, overshoots and settles back, and will turn on its own until it is spun. How many turns a spin takes and how far it is thrown off true are a function the consumer can replace; where the wedges are and what they look like are the wheel's, not this.",
            },
            {
                name: "Selection",
                description:
                    "Picking items out of a list: one of them, several, or the whole run between two. It keeps no list of its own — what is selected belongs to whichever control is drawing it — and owns only the anchor, the memory of where the last plain pick landed, so that a shifted pick knows where to measure its run from. The anchor is held as the item rather than as a position, which is what lets a run survive the list being sorted or filtered underneath it. A folder's tick box that reports ticked, empty or half-ticked by asking what is under it, and a press that moves the folder and everything inside it together, are the same idea one level down.",
            },
            {
                name: "SignalMirror",
                description:
                    "A value held in one form on the outside and another on the inside, kept in step in both directions without the loop that normally follows. A picker holding a date while its field holds text is the shape it was built for; so is a component that takes an optional signal from the consumer and quietly falls back to one of its own when none is passed.",
            },
            {
                name: "Smoother",
                description:
                    "Makes a set of numbers trail the values driving them instead of jumping to them. Each one closes the same share of the gap in the same time whatever the screen's frame rate, and frames are asked for only while something is still moving. It renders nothing, so it is seen through the pointer effects: `Tilter`, `ShadowCaster` and `LightCatcher` each take a smoothing time that lets them lag the pointer and settle softly.",
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
            {
                name: "Viewport",
                description:
                    "What box a thing is painted into: how big it is, how it is scaled, where a floating layer should portal to, and where it sits on the page. With no wrapper anywhere it answers for the window, which is why anchoring and measuring work the same whether or not anything has scaled the page. Viewports nest, and the scales multiply.",
            },
            {
                name: "Virtualizer",
                description:
                    "A window over a list too long to mount: it reports which rows should exist right now, where each one starts, and how tall the whole thing would be. Rows can be measured after they mount rather than guessed, and named rows can be pinned so they stay mounted when scrolled away.",
            },
        ],
    },
    {
        name: "Composites",
        hidden: !SHOW_COMPOSITES,
        children: [
            {
                name: "GlassSurface",
                description:
                    "A pane of frosted glass over whatever is behind it. The blur reaches every browser; the ripple that bends the backdrop is an SVG filter reference, which only Chromium honors, so the two sit on separate layers and the ripple layer is simply inert where it is not supported. The sheen on the surface is a specular highlight that follows the pointer.",
                component: () => <GlassSurfacePage />,
            },
            {
                name: "Surface",
                description:
                    "A box that takes the SVG path only when its fill or stroke needs one, and stays a plain div with inline radii when it does not.",
                component: () => <SurfacePage />,
            },
        ],
    },
    {
        name: "Essentials",
        children: [
            {
                name: "Accordions",
                children: [
                    {
                        name: "Accordion",
                        description:
                            "A set of sections with one keyboard walk over the headers and a policy for how many may stand open — any number, one at a time, or one at a time with never none. Each panel animates to its content's own height and is inert while closed, and a panel can be left unbuilt until its section is first opened.",
                        component: () => <AccordionPage />,
                    },
                    {
                        name: "Collapsible",
                        description:
                            "One trigger and one panel, with none of the group behavior an accordion adds. It measures what is inside and animates to that height rather than to a number somebody guessed, stays inert while closed so nothing in it takes focus, and can leave its contents unbuilt until the first time it is opened.",
                        component: () => <CollapsiblePage />,
                    },
                ],
            },
            {
                name: "AudioSwitcher",
                description:
                    "Two audio elements taking it in turns, so changing the source crosses from one to the other rather than cutting. It renders nothing at all — the buttons on this page are the page's — and the fade is stepped in twenty-five parts over whatever duration it is given, which is also how it stops and starts. Every change of source plays what arrived, except the one that arrives at mount: that one waits to be asked, unless shouldAutoPlayOnMount says otherwise. Whether sound is actually coming out is written back into the playback signal, so a control painted from it is right even where a browser has refused to start.",
                component: () => <AudioSwitcherPage />,
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
                name: "Carousels",
                children: [
                    {
                        name: "DrumCarousel",
                        description:
                            "The slides on the faces of a drum rather than in a strip: turning about the axis the direction names, swiped along it, and with the faces that have turned away hidden rather than merely obscured, so a screen reader is never read the back of a slide nobody can see. The stepping, the wrap and the keyboard are the shared carousel's; only the geometry differs.",
                        component: () => <DrumCarouselPage />,
                    },
                    {
                        name: "TrackCarousel",
                        description:
                            "Slides in a strip, stepped one at a time, across or up and down. Stepping past either end wraps round, which is what separates it from a scroller, and it can rotate on its own — holding while the pointer is over it, while anything inside it has focus, and while the tab is in the background. Every control it draws is optional, so a page that wants its own buttons drives it through the shared index instead.",
                        component: () => <TrackCarouselPage />,
                    },
                ],
            },
            {
                name: "Drawer",
                description:
                    "A modal that arrives from an edge. It is a preset rather than a mode, because a panel cannot become a centered dialog while it is open.",
                component: () => <DrawerPage />,
            },
            {
                name: "EdgeFader",
                description:
                    "A box whose chosen sides fade to nothing, so content running past an edge trails off rather than being cut. The fade is a mask on the content itself, so it works over any background without being told what is behind it. Fixed, the sides are always faded; scroll-aware, a side fades only while there is more to scroll to that way, and the fade shrinks as that end arrives.",
                component: () => <EdgeFaderPage />,
            },
            {
                name: "Form",
                description:
                    "Association and announcement, and nothing else. The library generates the ids and wires a control to its message; whether a value is valid is the consumer's to decide and to report.",
                component: () => <FormPage />,
            },
            {
                name: "HoverCard",
                description:
                    "A card of content hung off another element, opened by resting the pointer on it or by keyboard focus, and by a press where nothing can hover. Unlike a tooltip it may hold links and controls, so it is a dialog of its own rather than the element's description: Tab moves focus from the anchor into it, it stays open while focus is inside it, and Escape puts focus back on the anchor. The waiting, the skip window and the bridge across the gap are the hover engine it shares with Tooltip.",
                component: () => <HoverCardPage />,
            },
            {
                name: "ImageSwitcher",
                description:
                    "Cross-fades between image sources, loading the next one out of sight first so a slow or missing file never leaves a hole where the old picture was.",
                component: () => <ImageSwitcherPage />,
            },
            {
                name: "Input",
                children: [
                    {
                        name: "Calendar",
                        description:
                            "A month grid over a date value that carries its own calendar system, so first day, last day and era are asked of the value rather than assumed to be Gregorian.",
                        component: () => <CalendarPage />,
                    },
                    {
                        name: "Checkbox",
                        description:
                            "One of three presets over a shared binary switch. It is the only one with a third state — indeterminate is a value here, not a styling trick.",
                        component: () => <CheckboxPage />,
                    },
                    {
                        name: "CheckboxGroup",
                        description:
                            "Several checkboxes over one list. A box given a value is ticked while the list holds it, and pressing it adds or removes it; there is no walk and no single tab stop, because each box is a choice of its own. A select-all box is the consumer's to draw anywhere, and the group hands it the state to show — ticked, empty or mixed — and the command that ticks or clears every box still enabled.",
                        component: () => <CheckboxGroupPage />,
                    },
                    {
                        name: "Clock",
                        description:
                            "A time picked from columns rather than typed: one column per unit, so an hour and a minute are two independent choices and no column ever lists every time of day. Steps can be coarsened per unit, a range can be bounded, and twelve-hour reading adds an am/pm column while the value underneath stays 24-hour.",
                        component: () => <ClockPage />,
                    },
                    {
                        name: "ColorArea",
                        description:
                            "The saturation and brightness surface that replaces the operating system's color dialog. It holds hue, saturation and value rather than hex, because eight bits per channel cannot carry hue at black — re-reading hex every frame would drift and then stick.",
                        component: () => <ColorAreaPage />,
                    },
                    {
                        name: "ColorInput",
                        description:
                            "A color field where the browser owns the picker itself. The component owns the trigger and the value, and nothing about what the dialog looks like.",
                        component: () => <ColorInputPage />,
                    },
                    {
                        name: "CurrencyInput",
                        description:
                            "A money field, and deliberately not a number field with grouping switched on: the currency decides the symbol, which side it sits on and how many decimals there are, so the mask follows from the locale.",
                        component: () => <CurrencyInputPage />,
                    },
                    {
                        name: "DateInput",
                        description:
                            "A date typed into a mask rather than picked: the separators belong to the field, each segment is stepped by the arrows, and a half-typed or impossible date leaves the value alone rather than writing something nobody meant. It carries its calendar with it, so an era control appears in the leading slot when the calendar has eras to offer.",
                        component: () => <DateInputPage />,
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
                        name: "FileInput",
                        description:
                            "A file field where the operating system owns the dialog. The component owns what activates it and what comes back.",
                        component: () => <FileInputPage />,
                    },
                    {
                        name: "FormField",
                        description:
                            "The frame round a control: a caption above it, a message below it, in a column or a row. It owns the message's id and hands it down, so the control inside points aria-describedby at the message without either of them being told the other's name — and every control in the library reads that quietly, falling back to nothing when there is no field around it. An empty message is not an empty box: nothing is rendered and nothing is referenced. It also registers itself with the form it sits in, which is how a form knows whether any of its fields is in error. It is not a label and does not name the control; that is Label's job.",
                        component: () => <FormFieldPage />,
                    },
                    {
                        name: "FormSection",
                        description:
                            "A real fieldset with a legend, standing between a form and its fields. It opens a form context of its own while registering with the one around it, so the fields inside report to the section, the section is valid when none of them is in error, and what the form hears is one answer per section rather than one per field. Sections nest, so the verdict can travel up more than one level, and the section carries its own message for a rule that belongs to the group rather than to any one field.",
                        component: () => <FormSectionPage />,
                    },
                    {
                        name: "Label",
                        description:
                            "A caption that wraps its control rather than pointing at it by id, so nothing has to be kept unique or in sync. It paints nothing at all, cursor included.",
                        component: () => <LabelPage />,
                    },
                    {
                        name: "Listbox",
                        description:
                            "Select's option list standing on its own in the page: no field and no popup, always open. The options take focus themselves, so the list is one tab stop and the arrows move focus from option to option. Groups, typeahead, reachable disabled options, windowing and a horizontal walk that follows the page's text direction all come from the same list Select draws in its popup.",
                        component: () => <ListboxPage />,
                    },
                    {
                        name: "MultiSelect",
                        description:
                            "The same list as Select with more than one value held at once: picking does not close it, a picked option can be picked again to drop it, and the field shows what is chosen rather than one label. Groups, a query and options fetched on demand all work as they do for the single-value list, since both are the same shell with a different value.",
                        component: () => <MultiSelectPage />,
                    },
                    {
                        name: "NumberInput",
                        description:
                            "A number field with steppers that repeat while held, and the first field to take a codec — the thing that turns typed characters into a value and back.",
                        component: () => <NumberInputPage />,
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
                        name: "SegmentedInput",
                        description:
                            "A code drawn as a row of cells over one real field, so autofill, paste, the keyboard and a screen reader all meet a single input holding the whole code. The field draws none of its own text, caret, selection or focus ring; it hands each cell its character and whether the caret or the selection is in it, and a press on a cell puts the caret there.",
                        component: () => <SegmentedInputPage />,
                    },
                    {
                        name: "Select",
                        description:
                            "A list of options in a popup over one value or several. Filtering is the consumer's — autocomplete narrows what is shown, and the component never decides what counts as a match.",
                        component: () => <SelectPage />,
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
                        name: "TimeInput",
                        description:
                            "A time typed into a mask, in the same shape as the date field: two segments, or three with seconds, each stepped by the arrows where the caret is. Twelve-hour reading puts an am/pm control in the trailing slot while the value underneath stays 24-hour, and a range can be bounded so a time outside opening hours is refused.",
                        component: () => <TimeInputPage />,
                    },
                    {
                        name: "TimePicker",
                        description:
                            "The typed time field with a clock hung off it, so the same value can be typed or picked. The trailing slot carries the clock's trigger, sharing it with the am/pm control when the field is reading twelve-hour, and whatever bounds and steps the field has are the ones the clock offers.",
                        component: () => <TimePickerPage />,
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
                name: "Menubar",
                description:
                    "A row of words that each open a menu, built on the toolbar rather than beside it, so it measures itself, walks with the arrows as one tab stop and moves whatever does not fit into an overflow menu, where a word becomes a submenu. What it adds is one rule: while a menu is open, the arrow that moves to the next word closes that menu and opens the next one.",
                component: () => <MenubarPage />,
            },
            {
                name: "Menus",
                children: [
                    {
                        name: "FanMenu",
                        description:
                            "The same menu drawn as a narrow arc of cards opening sideways, and stepped through rather than stacked: opening a submenu replaces the level it came from instead of appearing beside it, and the row at the head of the new arc is the item you came in through, which takes you back. One level is ever on screen, so a fan never has to find room for a second one.",
                        component: () => <FanMenuPage />,
                    },
                    {
                        name: "Menu",
                        description:
                            "A popup list of commands, with a popup per submenu level rather than one list that redraws. Focus moves between the levels, and a dismissal closes them from the innermost out.",
                        component: () => <MenuPage />,
                    },
                    {
                        name: "WheelMenu",
                        description:
                            "The same menu with its items cut as wedges of a hollow wheel, over a whole turn or half of one. Everything a menu does it still does — the walk, the levels, the typeahead — and what this adds is angular: each item may ask for a share of the arc, a submenu is a wider band aimed at the wedge that opened it and only as wide as its own items need, and the close control in the hole is an ordinary item that happens to sit at the center, which is why the menu underneath knows nothing about it.",
                        component: () => <WheelMenuPage />,
                    },
                ],
            },
            {
                name: "Modal",
                description:
                    "A dialog that traps focus, joins one dismissal stack, and hands the overlay to the consumer to paint. Escape always closes it, and that is a conformance requirement rather than a courtesy.",
                component: () => <ModalPage />,
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
                name: "Scroller",
                description:
                    "A strip too wide for its box, paged by a previous and a next button instead of a scrollbar. It holds whatever it is given without rendering or typing it, it never claims the arrow keys — whatever is inside may already own them — and when a child is focused it scrolls just far enough to show that child whole.",
                component: () => <ScrollerPage />,
            },
            {
                name: "SlideButton",
                description:
                    "A confirmation you drag rather than press. Holding it is the single-pointer route the standard asks for, so the gesture is never the only way through.",
                component: () => <SlideButtonPage />,
            },
            {
                name: "Sortable",
                description:
                    "Lists whose items can be picked up and put down, in place or in a sibling list. Three ways in — a drag, a tap to pick and a tap to place, and a keyboard pick-move-drop — because a control operated only by dragging is one a good many people cannot operate at all. The library owns the carry, the landing place and the announcements; the item, the list's surface and the insertion marker are all painted by the consumer.",
                component: () => <SortablePage />,
            },
            {
                name: "SplitPane",
                description:
                    "Resizable panes over a CSS grid: the ratios are fr shares and a pane's bounds are a clamp, so a window resize is the browser's arithmetic rather than the component's. When the minimums cannot all fit, it overflows, exactly as grid does.",
                component: () => <SplitPanePage />,
            },
            {
                name: "Spotlights",
                children: [
                    {
                        name: "SpotlightGuide",
                        description:
                            "A tour: the hole moves from one element to the next as the steps advance, with a popup beside it carrying the step's own words and the controls for going on, going back, or leaving. Ending is reported with a reason, so a tour that was finished and one that was walked out of are not the same event.",
                        component: () => <SpotlightGuidePage />,
                    },
                    {
                        name: "SpotlightHint",
                        description:
                            "The lightest of the three: a hole cut round one element with a note beside it, dismissed by a press anywhere or by any key that means anything. Nothing is blocked while it is up, because a hint is an aside rather than a question.",
                        component: () => <SpotlightHintPage />,
                    },
                    {
                        name: "SpotlightPrompt",
                        description:
                            "The one that blocks: a hole round the element being asked about, and nothing else on the page answering until the question is. Focus is kept inside it, which is what separates it from a hint that merely sits there.",
                        component: () => <SpotlightPromptPage />,
                    },
                ],
            },
            {
                name: "Stepper",
                description:
                    "A progress strip whose per-step states are the consumer's to invent — the library owns only which step is current, and insists that whatever a state means reaches the step's name as words rather than as paint alone.",
                component: () => <StepperPage />,
            },
            {
                name: "Table",
                description:
                    "A grid rather than a table: one tab stop for the whole thing, arrows walking cell to cell, and the row and column indices published so a screen reader can still count fifty thousand rows when only thirty of them exist. Sorting, selection, column widths and the scroll window are each a signal the consumer owns, and every cell is painted by the column that declared it.",
                component: () => <TablePage />,
            },
            {
                name: "TableOfContents",
                description:
                    "The links to an article's sections, as a navigation landmark that follows the reader: the link whose section is being read is marked current, and pressing one scrolls its section into view and moves focus there, so the next Tab carries on inside it. The article is not the component's — it is rendered wherever the page likes, and each link is handed the element it leads to.",
                component: () => <TableOfContentsPage />,
            },
            {
                name: "Tabs",
                description:
                    "A tab list built from records rather than from children, so the same list can be buttons, anchors, or a consumer's own link component. The panel is optional, and pairing it is the consumer's to wire.",
                component: () => <TabsPage />,
            },
            {
                name: "Toasts",
                description:
                    "A queue the consumer owns. The component shows what is in it and reports when one is finished; nothing is added or dropped behind the consumer's back.",
                component: () => <ToastsPage />,
            },
            {
                name: "Toolbar",
                description:
                    "A row of actions that measures itself and moves whatever does not fit into a menu at the end. The row is one tab stop with the arrows walking it, and an action that leaves the row leaves that walk with it. Each action is described once and painted twice — as a button in the row and as a row in the menu — and can refuse to collapse, or insist on it.",
                component: () => <ToolbarPage />,
            },
            {
                name: "Tooltip",
                description:
                    "A description hung off another element, shown while the pointer is over it and, after a pause, while it holds keyboard focus. It is handed the element rather than wrapping it, so anything with a ref can carry one, and it points that element at the tooltip with aria-describedby only while the tooltip is on screen, which is what gets it read out without leaving a reference to something that has gone. It is portaled out to the top layer so nothing it grew out of can clip it, and it asks Anchor where to sit.",
                component: () => <TooltipPage />,
            },
            {
                name: "Tree",
                description:
                    "A disclosure tree with one keyboard walk over the rows that are actually visible. A node's children sit in a group box beside the node rather than inside it, which is what the role requires.",
                component: () => <TreePage />,
            },
            {
                name: "ViewportWrapper",
                description:
                    "Scales everything inside it to one design size. It is terminal: anything measured, anchored or portaled within it works in the viewport's coordinates rather than the window's, and wrappers nest — an inner one composes its scale with the outer one's.",
                component: () => <ViewportWrapperPage />,
            },
        ],
    },
    {
        name: "Exotics",
        children: [
            {
                name: "Bracket",
                description:
                    "A tree drawn in layers with elbow connectors between a node and the nodes that feed it — a knockout draw being the arrangement it was asked for, and an org chart or a skill tree the same component with a different tree. A node sits centered between the ones it feeds from, which propagates upward and is the whole of the layout; a node with one child sits level with it, which is what a bye looks like. The arrows walk a layer and step between layers, on one tab stop.",
                component: () => <BracketPage />,
            },
            {
                name: "CardStack",
                description:
                    "A pile of cards where the top one is pushed away in any of the four directions and the next comes up. What is on a card is the consumer's; what belongs here is the pile — which cards exist right now, how far the top one has been pushed, and which way it is leaving — so a painter can tilt, fade or tint from numbers it is handed rather than measuring anything. A push that falls short of the commit ratio springs back. The gesture is attached only when the page draws the buttons that do the same job without a drag, since a swipe on its own would leave anyone who cannot drag with no way through.",
                component: () => <CardStackPage />,
            },
            {
                name: "CellAnimation",
                description:
                    "Cuts an image into a grid and animates the cells on a stagger, where a cell's turn comes from a weight rather than from its index. The animations, weights and origins on this page are Playground samples — the component itself only asks for a function from timeline to result.",
                component: () => <CellAnimationPage />,
            },
            {
                name: "CirclePacking",
                description:
                    "The same tree as Treemap and Sunburst, drawn as circles inside circles: a leaf's area is its weight, and a branch is the smallest circle around its children. Pressing a circle with circles inside it zooms into it, on a path that pulls back before traveling when the jump is far; a press anywhere else goes back to the top, and Escape goes up one level. The packing is D3's, seeded, so the same tree always packs the same way.",
                component: () => <CirclePackingPage />,
            },
            {
                name: "Corners",
                description:
                    "Four L-shaped brackets drawn just inside an element's box, on a layer that takes no pointer and says nothing to a screen reader. Each bracket is a single polygon rather than two rules meeting, so the two arm lengths and the thickness are numbers instead of a border pretending to be one, and any of the four can be left out. The color transitions rather than switching, which is what lets a control light its corners as it is pressed and let them fade as it is released.",
                component: () => <CornersPage />,
            },
            {
                name: "Cuboid",
                description:
                    "Six faces on a box that is only a cube when you make it one: width, height and depth are given separately, and each face is sized from the two extents it spans. Two counts of quarter turns drive it, one across and one up, so it always turns the way it was pushed. Kept upright, it remembers how it actually lies instead: every press is a quarter turn about the screen's own axis, the face it lands on is spun to read the right way up, and its controller can turn it to a face by name. It can also be dragged, settling on the nearest face when let go.",
                component: () => <CuboidPage />,
            },
            {
                name: "Die",
                description:
                    "Any convex solid built from flat faces — the six tabletop dice and a hundred-sided one ship as samples — turned in 3D so one face is towards the viewer. A roll asks the page which face to land on, tumbles, and lands on it the right way up, then says which face came up; the face can also be set directly, and the die turns there without tumbling. Every face is a real element clipped to its outline, which is cheap for a die and does not scale to a sphere.",
                component: () => <DiePage />,
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
                    "Places a set of items into an arrangement — a cliff, a whorl of three, a zigzag — from a function that answers with a position per item. Every position is a fraction of the formation's own width, so the whole thing scales with the container and nothing is measured in JavaScript.",
                component: () => <FormationPage />,
            },
            {
                name: "Icicle",
                description:
                    "The same tree as Treemap, Sunburst and CirclePacking, drawn in columns: the node in view fills the first at full height, its children share the next in proportion to what they weigh, theirs the one after. Pressing any cell — a leaf too — brings it to the left at full height while the rest slides out of the way, and pressing the leftmost cell or Escape goes back up. The arrows walk up and down a column and across to a parent or its children.",
                component: () => <IciclePage />,
            },
            {
                name: "Mosaics",
                children: [
                    {
                        name: "ElementMosaic",
                        description:
                            "Packs elements the consumer has already sized into the least room they will fit in, one side taken from the parent and the other whatever the arrangement costs. A short item leaves no hole under it — the next thing that fits rises into it — and items are rendered in the order they end up reading in rather than the order they were passed, so Tab and a screen reader follow the eye.",
                        component: () => <ElementMosaicPage />,
                    },
                    {
                        name: "ImageMosaic",
                        description:
                            "The same packing, with the sizes taken out of the consumer's hands: every row is scaled to fill the fixed side exactly, so the only size asked for is the shape the finished mosaic should come out closest to. Each image keeps its own proportions, which is what stops a row of portraits being stretched to match a row of landscapes.",
                        component: () => <ImageMosaicPage />,
                    },
                ],
            },
            {
                name: "Odometer",
                description:
                    "A number where each digit is a column that turns to its new value, so a change reads as travel rather than a swap. The columns turn the way the number is going, so nine to zero keeps going forward instead of rewinding, and a column waits for every column to its right that is also carrying. It takes the text rather than the number, so a separator is a slot that never turns and the component owns no locale.",
                component: () => <OdometerPage />,
            },
            {
                name: "ParticleSpawner",
                description:
                    "A spawner element and a set of target elements: particles leave the spawner one after another, each aimed at a target its own evaluator picked, and are removed once they arrive. Where a particle sits at any moment is answered by a caller-supplied function rather than fixed to a straight line, and several spawners can aim at the same pool of targets without knowing about each other.",
                component: () => <ParticleSpawnerPage />,
            },
            {
                name: "PatchBoard",
                description:
                    "Boxes a person places by hand, sockets on their edges, and cables dragged from one socket to another. The board owns the geometry and the wiring rules: a cable stays fixed to its socket while the box it hangs off is dragged, an input already carrying a cable refuses a second, a node cannot be wired to itself, and the consumer can refuse a pair on top of that. Everything a pointer does is also a tap and a keystroke — pick up, aim, drop, Escape to put back — so a graph can be wired without a mouse.",
                component: () => <PatchBoardPage />,
            },
            {
                name: "PointerEffects",
                children: [
                    {
                        name: "LightCatcher",
                        description:
                            "Wraps anything and brightens it as the pointer comes near, as though the pointer carried the light in the room. It is brightest with the pointer on the content and fades back to a resting brightness as the pointer walks out to the edge of the light, reaching full strength at the edge of the content rather than at its middle, so a wide thing and a narrow one behave alike. Drop the resting brightness below one and a row of them stops being a row of lamps and becomes a spotlight, because everything not being pointed at is dimmed rather than merely left alone.",
                        component: () => <LightCatcherPage />,
                    },
                    {
                        name: "ShadowCaster",
                        description:
                            "Wraps anything and throws a shadow away from the pointer, as though the pointer were the light in the room: on the content the shadow is short, dark and tight, and it lengthens, softens and fades as the pointer retreats, until past the light's range it stops changing. It draws with a filter rather than a box shadow, so the shadow traces the shape the content actually paints — a rounded card, a clipped star, a picture with transparency — instead of the rectangle around it.",
                        component: () => <ShadowCasterPage />,
                    },
                    {
                        name: "Tilter",
                        description:
                            "Wraps anything and leans it away from the pointer, so a flat card or picture reads as a surface being tipped rather than a picture of one. How far it turns at the edges and how near the viewer sits are both set; the specular band that sells it is a slot rather than something drawn here, because a sheen has to take the corners of whatever is underneath it and a wrapper cannot know them. It tracks the area it was given rather than the surface that turns, so the turn cannot feed back into the reading that caused it.",
                        component: () => <TilterPage />,
                    },
                ],
            },
            {
                name: "Reveals",
                children: [
                    {
                        name: "Reveal",
                        description:
                            "A cover with a hole cut where the pointer is, traveling with it, so the cover is whole again the moment the pointer leaves. The cover is the consumer's — opaque, frosted, or something that reads what it is told — and the component hands it the mask that cuts the hole and whether a reveal is happening.",
                        component: () => <RevealPage />,
                    },
                    {
                        name: "ScratchCard",
                        description:
                            "The same cover, except the holes stay. One element with a mask cut into it rather than a grid of tiles, so the rubbed area is a continuous surface with a soft edge and no seams; the grid behind it is bookkeeping, which is what makes how much has gone an exact count rather than a sampled estimate. Crossing a threshold fades the rest away, the brush can be previewed before it lands, and pressing it with the keyboard reveals the lot, because a control that only answers to dragging cannot be operated without a pointer.",
                        component: () => <ScratchCardPage />,
                    },
                ],
            },
            {
                name: "RichText",
                description:
                    "Paints a plain string that carries bracketed tags — [b], [i], [s], [u], [li] — so text arriving from a server or a file can say which of its words are emphasized without bringing markup along. Nothing is handed to the browser as HTML: the string is parsed into a tree of runs and painted with classes the consumer supplies, or with elements of the consumer's own such as a link or a tooltip, and a tag it does not recognize is either left on screen exactly as typed or dropped, whichever the consumer asks for. A tag carries attributes only where the consumer has allowed them, so a bracket in ordinary prose stays prose.",
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
                name: "Sunburst",
                description:
                    "Treemap's tree drawn as rings: the branch in the middle, its children in the first ring, theirs in the second, each arc's share of its ring in proportion to what it weighs. Pressing an arc with rings outside it zooms into it, its arc opening out to the whole circle while everything outside it squeezes away, and Escape zooms back out. The middle is the page's own button, driven through the signal the two share, so the way back out is drawn by whoever draws the rest.",
                component: () => <SunburstPage />,
            },
            {
                name: "TileBoard",
                description:
                    "A board of tiles that interlock, and every built-in shape tessellates: the offset rows and short alternate row a hexagon or a lozenge needs, the half-tile overlap and turned-over neighbors a triangle needs, or neither for a square. The board owns the geometry and the keyboard — a transparent layer wearing the tile's own shape takes the pointer, so a press lands on the tile you can see rather than on its rectangle while a piece standing taller than its tile still hangs over the row above, and the arrows walk every tile whether it will take a press or not. What a tile looks like, and what it means, are the consumer's.",
                component: () => <TileBoardPage />,
            },
            {
                name: "Timeline",
                description:
                    "Items with a start and an end, laid on a window over a range that can be zoomed and moved. The component owns the arithmetic — where a span lands as a share of the window, which lane it goes in when it overlaps its neighbors, and which round numbers the ticks fall on at the width it currently has — and the keyboard, where the arrows walk the items in time order and bring the window with them. It moves the window only when it is asked to: the wheel, the drag and the buttons that do the asking are the consumer's.",
                component: () => <TimelinePage />,
            },
            {
                name: "Trail",
                description:
                    "One element traveling a path the consumer draws, on a frame loop rather than a CSS animation, so where it is right now is a value anything can read. It reports the point and the direction of travel at every frame and can turn the traveler to face along it; the controller plays, pauses and seeks, which is what lets a slider put it anywhere on the path.",
                component: () => <TrailPage />,
            },
            {
                name: "Treemap",
                description:
                    "A tree drawn as a box divided into rectangles, each one's area in proportion to what it weighs — a leaf its own weight, a branch everything under it. One level is shown at a time: pressing a branch zooms into it, its tile growing to fill the box while its children fade in, and Escape zooms back out. Every level is tiled as though it filled the whole box, so what is inside a tile before the zoom is exactly what fills the box after it. The way back up is the page's own button, driven through the signal the two share.",
                component: () => <TreemapPage />,
            },
            {
                name: "TypeWriter",
                description:
                    "Reveals text one character at a time without flattening it first, so a bold run or a nested element still animates in place.",
                component: () => <TypewriterPage />,
            },
            {
                name: "Wheels",
                children: [
                    {
                        name: "DrumWheel",
                        description:
                            "A ring of faces turned about one axis, so the wedges arrive edge-on rather than sweeping round a disc — sideways like a fruit machine's reel laid flat, or over like the reel itself. The faces come from Barrel, which is told nothing but an angle, and the spin comes from Rotator: to an index the consumer names, overshooting and settling back, and turning on its own until it is spun.",
                        component: () => <DrumWheelPage />,
                    },
                    {
                        name: "OverheadWheel",
                        description:
                            "The prize wheel seen from above: wedges cut from one disc, a marker fixed at the edge, and a spin that lands on a wedge the consumer names rather than on wherever it stops. The rotation is Rotator's — spin, overshoot, settle back — and the wedge under the marker is reported while it turns, not only when it comes to rest.",
                        component: () => <OverheadWheelPage />,
                    },
                ],
            },
        ],
    },
    {
        name: "Generators",
        children: [
            {
                name: "CellAnimationBreakpoints",
                description:
                    "When each cell of a cell animation plays. A weight becomes a window of the shared timeline — heavy cells early, light ones late, or the other way round — and the smoothness decides how much of the timeline one window takes, from every cell being an instant to every cell moving together. The same window is where an easing curve is applied, so the curve bends each cell's own motion rather than the stagger. `ScanlineAnimation` times its lines with it too.",
            },
            {
                name: "CellAnimationKeyframes",
                description:
                    "The per-cell animations written as keyframes rather than as code: a list of stops — at this point, these values — is turned into the function a cell animation asks for, with the interpolation done for you. A stop may also name the point a cell turns about and how far it is pushed towards the viewer, which are folded into ordinary transform values. Different parts of the grid can play different animations, by zone.",
            },
            {
                name: "CellAnimationPlayback",
                description:
                    "Turns elapsed time into the position on a cell animation's timeline. A cell animation is handed a timeline from 0 to 1 and knows nothing about time; this runs it forwards or backwards, or out and back again with an optional hold at the turn, so a loop can rest at its end rather than snapping back to its start. It also says how long one loop takes, which is what a player needs to know when to start the next.",
            },
            {
                name: "CellAnimationWeights",
                description:
                    "Where a cell's turn comes from. A weight is a number from 0 to 1 per cell, heavy cells going first, and these are what weights are made of: distances from the origin measured straight, in squares, in rings stretched to the grid's shape and along the diagonals; orderings by row, by column, by a scattering stride and along a Z-shaped curve; a seeded random order that holds still between renders; and three shapes built from those — a ripple, a radar sweep and a spiral. One call runs a weight function over the whole grid and can break ties or even out the spacing.",
            },
            {
                name: "CellAnimationZones",
                description:
                    "Named parts of a cell animation's grid, for an animation that does different things in different places: a side of the origin, a quadrant, an axis, the origin itself, a parity of rows, columns, rings or checkered cells, or a half by weight. Everything is measured from the origin, so a zone moves with it. Every parity zone is the exact complement of its partner, so the two together take every cell exactly once.",
            },
            {
                name: "PlacementLayouts",
                description:
                    "The arrangements the library ships — a ring, an arc, a row, a column, a honeycomb, a cliff, a whorl and a zigzag — as functions a consumer can tune or take as they are. Each turns an item count into one box per item, in the shares `Placement` describes, so they are examples of writing a layout rather than the only ones a control will accept. Two families are worth telling apart: a sized layout states the width it was drawn at, so a menu can grow its levels in the proportions the layout chose, and a fitted one has no size of its own and fills whatever room it is given. Every control that takes a layout shows them on its own page.",
            },
            {
                name: "ProximityEffects",
                description:
                    "The pointer effects the library ships — a zoom that grows the nearest items and moves the rest aside, a glow and a fade — as functions a consumer can tune or take as they are. Each turns one item's measurements into CSS transform and filter values, which is the whole of what an effect is in `Proximity`. What is worth reading them for is how each answers the reduced-motion preference: the library never strips a response it thinks is motion, so the substitution belongs to whoever wrote the effect, and these are three worked answers. Every control that takes a layout takes one of these too.",
            },
            {
                name: "SVGDefs",
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
                        children: [
                            {
                                name: "SVGGradients",
                                description:
                                    "Linear and radial gradients written as a list of colors rather than as markup. A gradient can be described by an angle, the way CSS describes one, rather than by two endpoints; a color may name the stop it sits at or leave it to be spread evenly between the ones that do; and asking for bands rather than a blend emits each stop twice so the colors meet at a hard edge. Everything is read through accessors, so a gradient changes in place as its angle or its colors do. The two pages beside this one drive it, one on a clock and one from the pointer.",
                            },
                            {
                                name: "TimedGradients",
                                description:
                                    "Linear and radial gradients written as a list of colors rather than as markup. A color may name the stop it sits at or leave it to be spread evenly between the ones that do, and asking for bands rather than a blend emits each stop twice so the colors meet at a hard edge. Angle, origin, scale and offset belong to the gradient rather than to the colors, so the same list can be turned or squashed without being rewritten. Every sample here is driven by a clock, so a duration and an iteration pattern are what they answer to.",
                                component: () => <TimedGradientsPage />,
                            },
                            {
                                name: "TrackedGradients",
                                description:
                                    "The same gradients, driven by the pointer rather than by a clock. Each one reads the element it is painting and turns the pointer's position inside that box into an origin or an offset, so there is no duration to set and no iteration to choose — the highlight simply is wherever the pointer is, and travels off the surface when the pointer leaves. A key names the mark it draws, then the treatment applied to it, then how many of the shared colors it uses. Three marks: a band slides under the pointer, a spot is a pool centered on it, and a hand throws a wedge out towards it. The treatments are what happens next — a trail leaves the mark behind at every position it passed through and fades it where it lies, a smear stretches each of those along the way the pointer was going, a ripple expands them into rings, and a flare hangs a chain of ghosts off the mark on the axis through the center. A trailing c blends the colors continuously on a clock and freezes each mark at the color the source had when it was laid. The second example is four boxes rather than one, because each reads the pointer against its own box and only neighbors can show whether they agree.",
                                component: () => <TrackedGradientsPage />,
                            },
                        ],
                    },
                    {
                        name: "SVGPatterns",
                        description:
                            "Places a number of cells inside one tile and repeats the tile, which is the whole of what turns a shape and a count into a tiling. Where a cell sits and what it draws are the consumer's two functions; the named tilings — hexagons, triangles, lozenges — are built on the same placement and repeat any tiling of one's own would be.",
                        component: () => <SVGPatternsPage />,
                    },
                ],
            },
        ],
    },
    {
        name: "Primitives",
        children: [
            {
                name: "Barrel",
                description:
                    "Faces set round a turning drum, and nothing that turns it. It is handed an angle and shows it: which faces sit where, which have turned away from the viewer and so leave the accessibility tree, and what each one is called when it is read out. A drum carousel and a drum wheel are each one of these with something moving the angle, and that something is what makes it a control — which is why a barrel has no use on its own.",
            },
            {
                name: "BinarySwitch",
                description:
                    "The shared body of `Checkbox`, `Radio` and `Toggle`: a hidden native input under a control the consumer paints, told whether it is a checkbox or a radio and whether it announces itself as a switch. What it owns that the three must not each copy is how the input's ticked state is written — from state, in one place, and again straight after a change is reported — so a change the owner refuses never leaves the box showing ticked. It is not exported; only its types are, because the three controls' props are built from them.",
            },
            {
                name: "Carousel",
                description:
                    "The shell both carousels are built on: stepping, wrapping, autoplay that can be stopped and held, the swipe and the keyboard, and the controls that step, pick a slide and stop the rotation. `TrackCarousel` lays the slides out in a strip and `DrumCarousel` sets them round a barrel; the geometry is the only thing that differs. It is not exported, since a consumer reaches for one of the two.",
            },
            {
                name: "InteractionWrapper",
                description:
                    "What every pressable control in the library sits inside. It owns the events, focus, the tab order, the ARIA attributes and the tooltip, and paints nothing: the consumer draws the control and is handed its state — hovered, pressed, focused, disabled — to draw it against. A disabled control can be kept reachable by keyboard, so a reader still finds it, hears that it is disabled, and can read the tooltip saying why.",
            },
            {
                name: "Mosaic",
                description:
                    "Tiles of different sizes packed together: one side is given and the other is worked out from what the tiles measure. Packing moves tiles out of the order they were given in, so it keeps the reading order separately, and a mosaic can be walked with the arrow keys as a single tab stop. `ElementMosaic` and `ImageMosaic` are what a consumer reaches for; this is the packing and the walk they share, and it is not exported.",
            },
            {
                name: "PlacementBox",
                description:
                    "The box an arrangement is drawn in. It takes a layout — a function from how many items there are to a rectangle each — and holds what the items inside it need to read: where the pointer is, what nearness does to an item, and whether the reader has asked for less motion. It reports itself as nothing to assistive technology, because the shape arrives from outside and so do the items.",
            },
            {
                name: "PlacementItem",
                description:
                    "One item inside a `PlacementBox`, placed as a share of the box rather than in pixels, so the whole arrangement scales with its container. When the layout changes it glides to its new place, and giving each item a longer wait than the one before is what staggers an arrangement.",
            },
            {
                name: "Popover",
                description:
                    "The floating layer behind every dropdown, menu and picker panel. The consumer owns whether it is open and what it hangs off, and says which of three things it is standing in for — a listbox, a menu or a dialog — which decides what it is announced as. It keeps itself on screen against its anchor, closes when dismissed from outside and says whether that was a press elsewhere, focus leaving or Escape, and hands the fade to the consumer rather than applying it.",
            },
            {
                name: "PopupTrigger",
                description:
                    "The button that opens a picker's popup, shared by `DatePicker`, `DateRangePicker` and `TimePicker`. It says that it opens a dialog, whether that dialog is showing and which element it is, and that last part is also what lets a press inside a popup drawn elsewhere on the page count as a press inside this control rather than outside it.",
            },
            {
                name: "Spotlight",
                description:
                    "Lights one element and covers the rest: a hole cut in an overlay, moved rather than restarted when the element changes, with a sentence announced on each move so a reader who cannot see the hole is told what it is on. How insistent it is decides which of three it is — a hint goes away at the first key or press, a prompt keeps focus on the lit element, and a guide adds a popup beside it and keeps focus inside that. `SpotlightHint`, `SpotlightPrompt` and `SpotlightGuide` are what a consumer reaches for.",
            },
            {
                name: "TextField",
                description:
                    "The shared body of `TextInput`, `TextArea`, `NumberInput`, `CurrencyInput`, `DateInput` and `TimeInput`, told whether it is a single-line input or a text area. It handles everything those have in common — the placeholder, whatever sits before and after the text, formatting as you type without the caret jumping, and the number a spin button announces holding. Only its types are exported.",
            },
            {
                name: "Wheel",
                description:
                    "The shell both wheels are built on: wedges set round a turn, spun by `Rotator`, landing on one wedge and announcing it. `OverheadWheel` lays its wedges out flat and `DrumWheel` sets them round a barrel; that is the only difference. It is not exported.",
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
    generators: listNames(names.generators),
    primitives: listNames(names.primitives),
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
    { key: "generators" as const, label: "Generators", singular: "Generator" },
    { key: "primitives" as const, label: "Primitives", singular: "Primitive" },
    { key: "components" as const, label: "Components", singular: "Component" },
];

const EMPTY_DEPENDENCY_NAMES: DependencyNames = { abstracts: [], generators: [], primitives: [], components: [] };

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
                        <Show when={DEPENDENCY_GROUPS.some((group) => getSectionNames()[group.key].length)}>
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
    const showsDescriptionOnlySignal = createSignal(false);
    const [getBrowseExpanded, setBrowseExpanded] = createSignal<MenuNodeConfig[]>(VISIBLE_MENU_CONFIGS);
    const [getSearchExpanded, setSearchExpanded] = createSignal<MenuNodeConfig[]>([]);

    const getIsSearching = createMemo(() => getSearchTerm().trim().length > 0);

    const getVisibleNodes = createMemo(() => {
        const isSearching = getIsSearching();
        const showsDescriptionOnly = showsDescriptionOnlySignal[0]();

        if (!isSearching && showsDescriptionOnly) return MENU_NODES;

        const searchTerm = getSearchTerm().trim().toLocaleLowerCase();
        const selectedConfig = getSelectedConfig();

        const getIsKept = (config: ComponentConfig) => {
            if (config === selectedConfig) return true;

            if (isSearching) return config.name.toLocaleLowerCase().includes(searchTerm);

            return showsDescriptionOnly || config.component !== undefined;
        };

        return MENU_NODES.map((node) => filterTreeNode(node, getIsKept)).filter(
            (node): node is TreeNode<MenuNodeConfig> => node !== undefined,
        );
    });

    createEffect(() => {
        if (!getIsSearching()) return;

        const branches = collectBranchValues(getVisibleNodes());

        setSearchExpanded(() => branches);
    });

    createEffect(() => {
        const pathName = toBaseRoute(props.location.pathname);
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

                <div class={styles.filterContainer}>
                    <Label>
                        <Checkbox
                            checkedSignal={showsDescriptionOnlySignal}
                            renderContent={(getFlags) => <PageCheckboxContent flags={getFlags} />}
                        />

                        <PageLabelCaption>Show pages without examples</PageLabelCaption>
                    </Label>
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
                                hasExamples={() => {
                                    const node = getNode().value;

                                    return getIsBranchConfig(node) || node.component !== undefined;
                                }}
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

                                <PageDependencies name={getConfig().name} />

                                <PageViewTabs
                                    baseRoute={componentToRouteName(getConfig().name)}
                                    hasSamples={getConfig().component !== undefined}
                                />
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
                        <ViewportWrapper size={getViewportSize}>
                            <AppContent {...props} />
                        </ViewportWrapper>
                    )}
                >
                    <Route path="/" component={EmptyPage} />
                    {COMPONENT_CONFIGS.map((config) => (
                        <Route path={componentToRouteName(config.name)} component={PassThroughPage}>
                            <Route
                                path="/"
                                component={
                                    config.component ??
                                    (() => (
                                        <Navigate href={toPageViewRoute(componentToRouteName(config.name), "docs")} />
                                    ))
                                }
                            />
                            <Route
                                path="/docs"
                                component={() => <PageDocsView name={config.name} description={config.description} />}
                            />
                        </Route>
                    ))}
                </Route>
            </Router>
        </div>
    );
}
