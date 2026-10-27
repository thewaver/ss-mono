import type { DependencyNames } from "virtual:component-dependencies";

import { SHOW_COMPOSITES } from "@thewaver/ss-playground/App/App.const";

import type { MenuBranchConfig } from "./App.types";

export { GETTING_STARTED_ROUTE, GALLERY_ROUTE } from "@thewaver/ss-playground/App/App.const";
export {
    LIST_PAGELESS_COMPONENTS,
    SEARCH_FIELD_WIDTH,
    MENU_ID,
    MENU_EDGE,
    PREVIEW_EXCLUDED_PAGES,
    DEPENDENCY_SECTIONS,
    DEPENDENCY_GROUPS,
    FIXED_ANCHOR_RATIO,
} from "@thewaver/ss-playground/App/App.const";

const AccordionDocs = () => import("./Pages/Accordions/AccordionPage/AccordionDocs.vue");
const AudioSwitcherDocs = () => import("./Pages/AudioSwitcherPage/AudioSwitcherDocs.vue");
const BracketPage = () => import("./Pages/BracketPage/BracketPage.vue");
const BreadcrumbsDocs = () => import("./Pages/BreadcrumbsPage/BreadcrumbsDocs.vue");
const ButtonDocs = () => import("./Pages/ButtonPage/ButtonDocs.vue");
const CalendarDocs = () => import("./Pages/CalendarPage/CalendarDocs.vue");
const CardStackPage = () => import("./Pages/CardStackPage/CardStackPage.vue");
const CarouselDocs = () => import("./Pages/Carousels/CarouselPage/CarouselDocs.vue");
const CellAnimationPage = () => import("./Pages/CellAnimationPage/CellAnimationPage.vue");
const CheckboxGroupDocs = () => import("./Pages/CheckboxGroupPage/CheckboxGroupDocs.vue");
const CheckboxDocs = () => import("./Pages/CheckboxPage/CheckboxDocs.vue");
const CirclePackingPage = () => import("./Pages/CirclePackingPage/CirclePackingPage.vue");
const ClockDocs = () => import("./Pages/ClockPage/ClockDocs.vue");
const CollapsibleDocs = () => import("./Pages/Accordions/CollapsiblePage/CollapsibleDocs.vue");
const ColorAreaDocs = () => import("./Pages/ColorAreaPage/ColorAreaDocs.vue");
const ColorInputDocs = () => import("./Pages/ColorInputPage/ColorInputDocs.vue");
const CornerHighlightPage = () => import("./Pages/CornerHighlightPage/CornerHighlightPage.vue");
const CornerPinPage = () => import("./Pages/CornerPinPage/CornerPinPage.vue");
const CuboidPage = () => import("./Pages/CuboidPage/CuboidPage.vue");
const CurrencyInputDocs = () => import("./Pages/CurrencyInputPage/CurrencyInputDocs.vue");
const DateInputDocs = () => import("./Pages/DateInputPage/DateInputDocs.vue");
const DatePickerDocs = () => import("./Pages/DatePickerPage/DatePickerDocs.vue");
const DateRangePickerDocs = () => import("./Pages/DateRangePickerPage/DateRangePickerDocs.vue");
const DateTimePickerDocs = () => import("./Pages/DateTimePickerPage/DateTimePickerDocs.vue");
const DiePage = () => import("./Pages/DiePage/DiePage.vue");
const DrawerDocs = () => import("./Pages/DrawerPage/DrawerDocs.vue");
const EdgeFaderDocs = () => import("./Pages/EdgeFaderPage/EdgeFaderDocs.vue");
const FileInputDocs = () => import("./Pages/FileInputPage/FileInputDocs.vue");
const FlipCardPage = () => import("./Pages/FlipCardPage/FlipCardPage.vue");
const FlipbookPage = () => import("./Pages/FlipbookPage/FlipbookPage.vue");
const InfiniteCorridorPage = () => import("./Pages/InfiniteCorridorPage/InfiniteCorridorPage.vue");
const FormFieldDocs = () => import("./Pages/FormFieldPage/FormFieldDocs.vue");
const FormDocs = () => import("./Pages/FormPage/FormDocs.vue");
const FormSectionDocs = () => import("./Pages/FormSectionPage/FormSectionDocs.vue");
const FormationPage = () => import("./Pages/FormationPage/FormationPage.vue");
const GlassSurfacePage = () => import("./Pages/GlassSurfacePage/GlassSurfacePage.vue");
const HoverCardDocs = () => import("./Pages/HoverCardPage/HoverCardDocs.vue");
const IciclePage = () => import("./Pages/IciclePage/IciclePage.vue");
const ImageSwitcherDocs = () => import("./Pages/ImageSwitcherPage/ImageSwitcherDocs.vue");
const LabelDocs = () => import("./Pages/LabelPage/LabelDocs.vue");
const ListboxDocs = () => import("./Pages/ListboxPage/ListboxDocs.vue");
const MenubarDocs = () => import("./Pages/MenubarPage/MenubarDocs.vue");
const CommandPaletteDocs = () => import("./Pages/Menus/CommandPalettePage/CommandPaletteDocs.vue");
const FanMenuDocs = () => import("./Pages/Menus/FanMenuPage/FanMenuDocs.vue");
const FlyoutMenuDocs = () => import("./Pages/Menus/FlyoutMenuPage/FlyoutMenuDocs.vue");
const MenuDocs = () => import("./Pages/Menus/MenuPage/MenuDocs.vue");
const WheelMenuDocs = () => import("./Pages/Menus/WheelMenuPage/WheelMenuDocs.vue");
const ModalDocs = () => import("./Pages/ModalPage/ModalDocs.vue");
const ElementMosaicPage = () => import("./Pages/Mosaics/ElementMosaicPage/ElementMosaicPage.vue");
const ImageMosaicPage = () => import("./Pages/Mosaics/ImageMosaicPage/ImageMosaicPage.vue");
const MultiSelectDocs = () => import("./Pages/MultiSelectPage/MultiSelectDocs.vue");
const NumberInputDocs = () => import("./Pages/NumberInputPage/NumberInputDocs.vue");
const FittedTextPage = () => import("./Pages/FittedTextPage/FittedTextPage.vue");
const MorphTextPage = () => import("./Pages/MorphTextPage/MorphTextPage.vue");
const SlotTextPage = () => import("./Pages/SlotTextPage/SlotTextPage.vue");
const PaintedTextPage = () => import("./Pages/PaintedTextPage/PaintedTextPage.vue");
const ProximityTextPage = () => import("./Pages/ProximityTextPage/ProximityTextPage.vue");
const PaginatorDocs = () => import("./Pages/PaginatorPage/PaginatorDocs.vue");
const ParticleDissolvePage = () => import("./Pages/ParticleDissolvePage/ParticleDissolvePage.vue");
const ParticleFieldPage = () => import("./Pages/ParticleFieldPage/ParticleFieldPage.vue");
const ParticleSpawnerPage = () => import("./Pages/ParticleSpawnerPage/ParticleSpawnerPage.vue");
const PatchBoardPage = () => import("./Pages/PatchBoardPage/PatchBoardPage.vue");
const LightCatcherPage = () => import("./Pages/PointerEffects/LightCatcherPage/LightCatcherPage.vue");
const RGBSplitterPage = () => import("./Pages/PointerEffects/RGBSplitterPage/RGBSplitterPage.vue");
const ShadowCasterPage = () => import("./Pages/PointerEffects/ShadowCasterPage/ShadowCasterPage.vue");
const TilterPage = () => import("./Pages/PointerEffects/TilterPage/TilterPage.vue");
const PreviewDocs = () => import("./Pages/PreviewPage/PreviewDocs.vue");
const ProgressDocs = () => import("./Pages/ProgressPage/ProgressDocs.vue");
const RadioDocs = () => import("./Pages/RadioPage/RadioDocs.vue");
const RangeCalendarDocs = () => import("./Pages/RangeCalendarPage/RangeCalendarDocs.vue");
const RangeDocs = () => import("./Pages/RangePage/RangeDocs.vue");
const LensPage = () => import("./Pages/Reveals/LensPage/LensPage.vue");
const RevealPage = () => import("./Pages/Reveals/RevealPage/RevealPage.vue");
const ScratchCardPage = () => import("./Pages/Reveals/ScratchCardPage/ScratchCardPage.vue");
const RichTextPage = () => import("./Pages/RichTextPage/RichTextPage.vue");
const SVGFiltersPage = () => import("./Pages/SVGFiltersPage/SVGFiltersPage.vue");
const TimedGradientsPage = () => import("./Pages/SVGGradients/TimedGradientsPage/TimedGradientsPage.vue");
const TrackedGradientsPage = () => import("./Pages/SVGGradients/TrackedGradientsPage/TrackedGradientsPage.vue");
const TimedPatternsPage = () => import("./Pages/SVGPatterns/TimedPatternsPage/TimedPatternsPage.vue");
const TrackedPatternsPage = () => import("./Pages/SVGPatterns/TrackedPatternsPage/TrackedPatternsPage.vue");
const SatellitePage = () => import("./Pages/SatellitePage/SatellitePage.vue");
const ScanlineAnimationPage = () => import("./Pages/ScanLineAnimationPage/ScanLineAnimationPage.vue");
const ScrambleTextPage = () => import("./Pages/ScrambleTextPage/ScrambleTextPage.vue");
const ScrollerDocs = () => import("./Pages/ScrollerPage/ScrollerDocs.vue");
const SegmentedInputDocs = () => import("./Pages/SegmentedInputPage/SegmentedInputDocs.vue");
const SelectDocs = () => import("./Pages/SelectPage/SelectDocs.vue");
const ShapePage = () => import("./Pages/ShapePage/ShapePage.vue");
const ShapeRevealPage = () => import("./Pages/ShapeRevealPage/ShapeRevealPage.vue");
const SidebarDocs = () => import("./Pages/SidebarPage/SidebarDocs.vue");
const SlideButtonDocs = () => import("./Pages/SlideButtonPage/SlideButtonDocs.vue");
const SortableGridPage = () => import("./Pages/SortableGridPage/SortableGridPage.vue");
const SortableDocs = () => import("./Pages/SortablePage/SortableDocs.vue");
const SplitPaneDocs = () => import("./Pages/SplitPanePage/SplitPaneDocs.vue");
const SpotlightGuideDocs = () => import("./Pages/Spotlights/SpotlightGuidePage/SpotlightGuideDocs.vue");
const SpotlightHintDocs = () => import("./Pages/Spotlights/SpotlightHintPage/SpotlightHintDocs.vue");
const SpotlightPromptDocs = () => import("./Pages/Spotlights/SpotlightPromptPage/SpotlightPromptDocs.vue");
const StaircasePage = () => import("./Pages/StaircasePage/StaircasePage.vue");
const StepperDocs = () => import("./Pages/StepperPage/StepperDocs.vue");
const SunburstPage = () => import("./Pages/SunburstPage/SunburstPage.vue");
const SurfacePage = () => import("./Pages/SurfacePage/SurfacePage.vue");
const TableOfContentsDocs = () => import("./Pages/TableOfContentsPage/TableOfContentsDocs.vue");
const TableDocs = () => import("./Pages/TablePage/TableDocs.vue");
const TabsDocs = () => import("./Pages/TabsPage/TabsDocs.vue");
const TagInputDocs = () => import("./Pages/TagInputPage/TagInputDocs.vue");
const TextAreaDocs = () => import("./Pages/TextAreaPage/TextAreaDocs.vue");
const TextInputDocs = () => import("./Pages/TextInputPage/TextInputDocs.vue");
const TileBoardPage = () => import("./Pages/TileBoardPage/TileBoardPage.vue");
const TimeInputDocs = () => import("./Pages/TimeInputPage/TimeInputDocs.vue");
const TimePickerDocs = () => import("./Pages/TimePickerPage/TimePickerDocs.vue");
const TimelinePage = () => import("./Pages/TimelinePage/TimelinePage.vue");
const ToastsDocs = () => import("./Pages/ToastsPage/ToastsDocs.vue");
const ToggleDocs = () => import("./Pages/TogglePage/ToggleDocs.vue");
const ToolbarDocs = () => import("./Pages/ToolbarPage/ToolbarDocs.vue");
const TooltipDocs = () => import("./Pages/TooltipPage/TooltipDocs.vue");
const TrailPage = () => import("./Pages/TrailPage/TrailPage.vue");
const WraparoundPage = () => import("./Pages/WraparoundPage/WraparoundPage.vue");
const TreeDocs = () => import("./Pages/TreePage/TreeDocs.vue");
const TreemapPage = () => import("./Pages/TreemapPage/TreemapPage.vue");
const TypewriterPage = () => import("./Pages/TypewriterPage/TypewriterPage.vue");
const ViewportWrapperPage = () => import("./Pages/ViewportWrapperPage/ViewportWrapperPage.vue");
const DrumWheelPage = () => import("./Pages/Wheels/DrumWheelPage/DrumWheelPage.vue");
const OverheadWheelPage = () => import("./Pages/Wheels/OverheadWheelPage/OverheadWheelPage.vue");

export const MENU_CONFIGS: MenuBranchConfig[] = [
    {
        name: "Abstracts",
        children: [
            {
                name: "Anchor",
            },
            {
                name: "Carrier",
            },
            {
                name: "CheckedState",
            },
            {
                name: "ColorExtractor",
            },
            {
                name: "Cutout",
            },
            {
                name: "DateTimeValue",
            },
            {
                name: "DateValue",
            },
            {
                name: "Dismisser",
            },
            {
                name: "ElementFader",
            },
            {
                name: "ElementObserver",
            },
            {
                name: "Elevation",
            },
            {
                name: "Flattener",
            },
            {
                name: "FocusManager",
            },
            {
                name: "FrameRateMonitor",
            },
            {
                name: "InteractionTracker",
            },
            {
                name: "LiveAnnouncer",
            },
            {
                name: "MaskedField",
            },
            {
                name: "MediaQueryMonitor",
            },
            {
                name: "Navigator",
            },
            {
                name: "Placement",
            },
            {
                name: "PointerTracker",
            },
            {
                name: "Proximity",
            },
            {
                name: "Rotator",
            },
            {
                name: "Selection",
            },
            {
                name: "ShapeReveal",
                component: ShapeRevealPage,
            },
            {
                name: "Shortcut",
            },
            {
                name: "SignalMirror",
            },
            {
                name: "Smoother",
            },
            {
                name: "TextSync",
            },
            {
                name: "Typeahead",
            },
            {
                name: "Viewport",
            },
            {
                name: "Virtualizer",
            },
        ],
    },
    {
        name: "Composites",
        hidden: !SHOW_COMPOSITES,
        children: [
            {
                name: "GlassSurface",
                component: GlassSurfacePage,
            },
            {
                name: "Surface",
                component: SurfacePage,
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
                        docs: AccordionDocs,
                    },
                    {
                        name: "Collapsible",
                        docs: CollapsibleDocs,
                    },
                ],
            },
            {
                name: "Breadcrumbs",
                docs: BreadcrumbsDocs,
            },
            {
                name: "Buttons",
                children: [
                    {
                        name: "Button",
                        docs: ButtonDocs,
                    },
                    {
                        name: "SlideButton",
                        docs: SlideButtonDocs,
                    },
                ],
            },
            {
                name: "Carousel",
                docs: CarouselDocs,
            },
            {
                name: "EdgeFader",
                docs: EdgeFaderDocs,
            },
            {
                name: "Form",
                docs: FormDocs,
            },
            {
                name: "Input",
                children: [
                    {
                        name: "Calendar",
                        docs: CalendarDocs,
                    },
                    {
                        name: "Checkbox",
                        docs: CheckboxDocs,
                    },
                    {
                        name: "CheckboxGroup",
                        docs: CheckboxGroupDocs,
                    },
                    {
                        name: "Clock",
                        docs: ClockDocs,
                    },
                    {
                        name: "ColorArea",
                        docs: ColorAreaDocs,
                    },
                    {
                        name: "ColorInput",
                        docs: ColorInputDocs,
                    },
                    {
                        name: "CurrencyInput",
                        docs: CurrencyInputDocs,
                    },
                    {
                        name: "DateInput",
                        docs: DateInputDocs,
                    },
                    {
                        name: "DatePicker",
                        docs: DatePickerDocs,
                    },
                    {
                        name: "DateRangePicker",
                        docs: DateRangePickerDocs,
                    },
                    {
                        name: "DateTimePicker",
                        docs: DateTimePickerDocs,
                    },
                    {
                        name: "FileInput",
                        docs: FileInputDocs,
                    },
                    {
                        name: "FormField",
                        docs: FormFieldDocs,
                    },
                    {
                        name: "FormSection",
                        docs: FormSectionDocs,
                    },
                    {
                        name: "Label",
                        docs: LabelDocs,
                    },
                    {
                        name: "Listbox",
                        docs: ListboxDocs,
                    },
                    {
                        name: "MultiSelect",
                        docs: MultiSelectDocs,
                    },
                    {
                        name: "NumberInput",
                        docs: NumberInputDocs,
                    },
                    {
                        name: "Radio",
                        docs: RadioDocs,
                    },
                    {
                        name: "Range",
                        docs: RangeDocs,
                    },
                    {
                        name: "RangeCalendar",
                        docs: RangeCalendarDocs,
                    },
                    {
                        name: "SegmentedInput",
                        docs: SegmentedInputDocs,
                    },
                    {
                        name: "Select",
                        docs: SelectDocs,
                    },
                    {
                        name: "TagInput",
                        docs: TagInputDocs,
                    },
                    {
                        name: "TextArea",
                        docs: TextAreaDocs,
                    },
                    {
                        name: "TextInput",
                        docs: TextInputDocs,
                    },
                    {
                        name: "TimeInput",
                        docs: TimeInputDocs,
                    },
                    {
                        name: "TimePicker",
                        docs: TimePickerDocs,
                    },
                    {
                        name: "Toggle",
                        docs: ToggleDocs,
                    },
                ],
            },
            {
                name: "MediaSwitchers",
                children: [
                    {
                        name: "AudioSwitcher",
                        docs: AudioSwitcherDocs,
                    },
                    {
                        name: "ImageSwitcher",
                        docs: ImageSwitcherDocs,
                    },
                ],
            },
            {
                name: "Menubar",
                docs: MenubarDocs,
            },
            {
                name: "Menus",
                children: [
                    {
                        name: "CommandPalette",
                        docs: CommandPaletteDocs,
                    },
                    {
                        name: "FanMenu",
                        docs: FanMenuDocs,
                    },
                    {
                        name: "FlyoutMenu",
                        docs: FlyoutMenuDocs,
                    },
                    {
                        name: "Menu",
                        docs: MenuDocs,
                    },
                    {
                        name: "WheelMenu",
                        docs: WheelMenuDocs,
                    },
                ],
            },
            {
                name: "Overlays",
                children: [
                    {
                        name: "Drawer",
                        docs: DrawerDocs,
                    },
                    {
                        name: "HoverCard",
                        docs: HoverCardDocs,
                    },
                    {
                        name: "Modal",
                        docs: ModalDocs,
                    },
                    {
                        name: "Sidebar",
                        docs: SidebarDocs,
                    },
                    {
                        name: "Spotlights",
                        children: [
                            {
                                name: "SpotlightGuide",
                                docs: SpotlightGuideDocs,
                            },
                            {
                                name: "SpotlightHint",
                                docs: SpotlightHintDocs,
                            },
                            {
                                name: "SpotlightPrompt",
                                docs: SpotlightPromptDocs,
                            },
                        ],
                    },
                    {
                        name: "Toasts",
                        docs: ToastsDocs,
                    },
                    {
                        name: "Tooltip",
                        docs: TooltipDocs,
                    },
                ],
            },
            {
                name: "Paginator",
                docs: PaginatorDocs,
            },
            {
                name: "Preview",
                docs: PreviewDocs,
            },
            {
                name: "Progress",
                docs: ProgressDocs,
            },
            {
                name: "Scroller",
                docs: ScrollerDocs,
            },
            {
                name: "Sortable",
                docs: SortableDocs,
            },
            {
                name: "SplitPane",
                docs: SplitPaneDocs,
            },
            {
                name: "Stepper",
                docs: StepperDocs,
            },
            {
                name: "Table",
                docs: TableDocs,
            },
            {
                name: "TableOfContents",
                docs: TableOfContentsDocs,
            },
            {
                name: "Tabs",
                docs: TabsDocs,
            },
            {
                name: "Toolbar",
                docs: ToolbarDocs,
            },
            {
                name: "Tree",
                docs: TreeDocs,
            },
        ],
    },
    {
        name: "Exotics",
        children: [
            {
                name: "Animations",
                children: [
                    {
                        name: "CellAnimation",
                        component: CellAnimationPage,
                    },
                    {
                        name: "ScanlineAnimation",
                        component: ScanlineAnimationPage,
                    },
                ],
            },
            {
                name: "Arrangements",
                children: [
                    {
                        name: "Formation",
                        component: FormationPage,
                    },
                    {
                        name: "Satellite",
                        component: SatellitePage,
                    },
                    {
                        name: "Staircase",
                        component: StaircasePage,
                    },
                ],
            },
            {
                name: "CardStack",
                component: CardStackPage,
            },
            {
                name: "Charts",
                children: [
                    {
                        name: "CirclePacking",
                        component: CirclePackingPage,
                    },
                    {
                        name: "Icicle",
                        component: IciclePage,
                    },
                    {
                        name: "Sunburst",
                        component: SunburstPage,
                    },
                    {
                        name: "Treemap",
                        component: TreemapPage,
                    },
                ],
            },
            {
                name: "CornerHighlight",
                component: CornerHighlightPage,
            },
            {
                name: "Diagrams",
                children: [
                    {
                        name: "Bracket",
                        component: BracketPage,
                    },
                    {
                        name: "PatchBoard",
                        component: PatchBoardPage,
                    },
                    {
                        name: "Timeline",
                        component: TimelinePage,
                    },
                ],
            },
            {
                name: "Mosaics",
                children: [
                    {
                        name: "ElementMosaic",
                        component: ElementMosaicPage,
                    },
                    {
                        name: "ImageMosaic",
                        component: ImageMosaicPage,
                    },
                ],
            },
            {
                name: "Particles",
                children: [
                    {
                        name: "ParticleDissolve",
                        component: ParticleDissolvePage,
                    },
                    {
                        name: "ParticleField",
                        component: ParticleFieldPage,
                    },
                    {
                        name: "ParticleSpawner",
                        component: ParticleSpawnerPage,
                    },
                ],
            },
            {
                name: "Perspective",
                children: [
                    {
                        name: "CornerPin",
                        component: CornerPinPage,
                    },
                    {
                        name: "Cuboid",
                        component: CuboidPage,
                    },
                    {
                        name: "Die",
                        component: DiePage,
                    },
                    {
                        name: "FlipCard",
                        component: FlipCardPage,
                    },
                    {
                        name: "Flipbook",
                        component: FlipbookPage,
                    },
                    {
                        name: "InfiniteCorridor",
                        component: InfiniteCorridorPage,
                    },
                ],
            },
            {
                name: "PointerEffects",
                children: [
                    {
                        name: "LightCatcher",
                        component: LightCatcherPage,
                    },
                    {
                        name: "RGBSplitter",
                        component: RGBSplitterPage,
                    },
                    {
                        name: "ShadowCaster",
                        component: ShadowCasterPage,
                    },
                    {
                        name: "Tilter",
                        component: TilterPage,
                    },
                ],
            },
            {
                name: "Reveals",
                children: [
                    {
                        name: "Lens",
                        component: LensPage,
                    },
                    {
                        name: "Reveal",
                        component: RevealPage,
                    },
                    {
                        name: "ScratchCard",
                        component: ScratchCardPage,
                    },
                ],
            },
            {
                name: "Shape",
                component: ShapePage,
            },
            {
                name: "SortableGrid",
                component: SortableGridPage,
            },
            {
                name: "Text",
                children: [
                    {
                        name: "FittedText",
                        component: FittedTextPage,
                    },
                    {
                        name: "MorphText",
                        component: MorphTextPage,
                    },
                    {
                        name: "SlotText",
                        component: SlotTextPage,
                    },
                    {
                        name: "PaintedText",
                        component: PaintedTextPage,
                    },
                    {
                        name: "ProximityText",
                        component: ProximityTextPage,
                    },
                    {
                        name: "RichText",
                        component: RichTextPage,
                    },
                    {
                        name: "ScrambleText",
                        component: ScrambleTextPage,
                    },
                    {
                        name: "Typewriter",
                        component: TypewriterPage,
                    },
                ],
            },
            {
                name: "TileBoard",
                component: TileBoardPage,
            },
            {
                name: "Trail",
                component: TrailPage,
            },
            {
                name: "Wheels",
                children: [
                    {
                        name: "DrumWheel",
                        component: DrumWheelPage,
                    },
                    {
                        name: "OverheadWheel",
                        component: OverheadWheelPage,
                    },
                ],
            },
            {
                name: "ViewportWrapper",
                component: ViewportWrapperPage,
            },
            {
                name: "Wraparound",
                component: WraparoundPage,
            },
        ],
    },
    {
        name: "Generators",
        children: [
            {
                name: "CellAnimationBreakpoints",
            },
            {
                name: "CellAnimationKeyframes",
            },
            {
                name: "CellAnimationPlayback",
            },
            {
                name: "CellAnimationWeights",
            },
            {
                name: "CellAnimationZones",
            },
            {
                name: "PlacementLayouts",
            },
            {
                name: "ProximityEffects",
            },
            {
                name: "SVGDefs",
                children: [
                    {
                        name: "SVGAnimations",
                    },
                    {
                        name: "SVGFilters",
                        component: SVGFiltersPage,
                    },
                    {
                        name: "SVGGradients",
                        children: [
                            {
                                name: "SVGGradients",
                            },
                            {
                                name: "TimedGradients",
                                component: TimedGradientsPage,
                            },
                            {
                                name: "TrackedGradients",
                                component: TrackedGradientsPage,
                            },
                        ],
                    },
                    {
                        name: "SVGPatterns",
                        children: [
                            {
                                name: "SVGPatterns",
                            },
                            {
                                name: "TimedPatterns",
                                component: TimedPatternsPage,
                            },
                            {
                                name: "TrackedPatterns",
                                component: TrackedPatternsPage,
                            },
                        ],
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
            },
            {
                name: "BinarySwitch",
            },
            {
                name: "InteractionWrapper",
            },
            {
                name: "Mosaic",
            },
            {
                name: "PlacementBox",
            },
            {
                name: "PlacementItem",
            },
            {
                name: "Popover",
            },
            {
                name: "PopupTrigger",
            },
            {
                name: "Spine",
            },
            {
                name: "Spotlight",
            },
            {
                name: "TextField",
            },
            {
                name: "Wheel",
            },
        ],
    },
];

export const EMPTY_DEPENDENCY_NAMES: DependencyNames = {
    abstracts: [],
    generators: [],
    primitives: [],
    components: [],
};
