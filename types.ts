
export enum FunnelStage {
  AWARENESS = "Awareness",
  CONSIDERATION = "Consideration",
  DECISION = "Decision",
  LOYALTY = "Loyalty",
  RETENTION = "Retention",
  ADVOCACY = "Advocacy",
}

export enum InvolvementLevel {
  HIGH = "High Involvement",
  MEDIUM = "Medium Involvement",
  LOW = "Low Involvement",
}

export enum OpportunityType {
  NEWBIZ = "New Business",
  UPSELL = "Upsell",
  CROSS_SELL = "Cross-sell",
}

export enum MediaRole {
  BRAND = "Brand",
  PERFORMANCE = "Performance",
  RETAIL = "Retail Media",
  MIXED = "Mixed / Full Funnel",
}

export enum DigitalMaturity {
  LOW = "Low (Legacy / Siloed)",
  MID = "Mid (Developing / Hybrid)",
  HIGH = "High (Data-Driven / Integrated)",
}

export interface ScreenshotData {
  name: string;
  data: string; // Base64 string without prefix for API
  mimeType: string;
  previewUrl: string; // For UI display
}

export interface DiagnosisData {
  clientName: string; 
  // Removed projectBudget
  
  briefingFileName: string | null; 
  briefingFileContent: string | null;
  
  // New Fields
  manualBriefingText: string;
  screenshots: ScreenshotData[];
  
  // New Contextual Fields (Guided)
  opportunityType: OpportunityType | "";
  mediaRole: MediaRole | "";
  digitalMaturity: DigitalMaturity | "";

  // Auto-extracted fields
  customerType: string;
  market: string;
  sector: string;
  productOrService: string;
  businessChallenge: string;
  customerChallenge: string;
  consumerContext: {
    involvement: InvolvementLevel | "";
    funnelStage: FunnelStage | "";
    barriers: string; 
  };
  currentStrategyAttempt: string; 
}

export interface FormulatedChallenge {
  // Split into 3 distinct fields
  strategicAlternativeA: string; 
  strategicAlternativeB: string; 
  strategicAlternativeC: string; 
  selectedAlternative: 'A' | 'B' | 'C' | ''; // Track user selection

  culturalTension: string;
  marketOpportunity: string;
  consumerInsight: string;
  rumeltDiagnosis: string; 
  rumeltGuidingPolicy: string; 
  behavioralJustification: string;
  keyAssumptions: string; 
  relevantMentalModels: string; 
}

export interface StrategySessionData {
  id: string; // Unique ID for history
  lastModified: number; // Timestamp
  diagnosis: DiagnosisData;
  challenge: FormulatedChallenge;
  generatedPrompts: string[];
}

export interface HistoryItem {
  id: string;
  clientName: string;
  lastModified: number;
}

export enum AppStep {
  DIAGNOSIS = "1. Diagnosis",
  CHALLENGE_FORMULATION = "2. Challenge Definition", // Renamed
  PROMPT_GENERATION = "3. Smart Prompts",
  RESULTS = "4. Summary & Export",
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}

export enum Language {
  EN = "EN",
  ES = "ES",
}

export enum UIStringKeys {
  // App
  AppName = "AppName",
  AppSubtitle = "AppSubtitle", 

  // History / Session Management
  ButtonHistory = "ButtonHistory",
  ButtonNewSession = "ButtonNewSession",
  HistoryModalTitle = "HistoryModalTitle",
  HistoryEmpty = "HistoryEmpty",
  LabelLastModified = "LabelLastModified",
  ButtonLoad = "ButtonLoad",
  ButtonDelete = "ButtonDelete",
  ConfirmDelete = "ConfirmDelete",
  NewSessionConfirm = "NewSessionConfirm",

  // Footer
  FooterStep = "FooterStep", 

  // Help Button
  HelpButtonTooltip = "HelpButtonTooltip",

  // Help Modal
  HelpModalTitle = "HelpModalTitle",
  HelpModalIntro = "HelpModalIntro",
  HelpModalDefaultContent = "HelpModalDefaultContent",
  HelpModalCloseButtonSR = "HelpModalCloseButtonSR",
  HelpModalTopicsHeader = "HelpModalTopicsHeader",

  // Help Topics
  HelpTopic_Overview_Q = "HelpTopic_Overview_Q",
  HelpTopic_Overview_A = "HelpTopic_Overview_A",
  HelpTopic_Diagnosis_Q = "HelpTopic_Diagnosis_Q",
  HelpTopic_Diagnosis_A = "HelpTopic_Diagnosis_A",
  HelpTopic_ChallengeFormulation_Q = "HelpTopic_ChallengeFormulation_Q",
  HelpTopic_ChallengeFormulation_A = "HelpTopic_ChallengeFormulation_A",
  HelpTopic_SmartPrompts_Q = "HelpTopic_SmartPrompts_Q",
  HelpTopic_SmartPrompts_A = "HelpTopic_SmartPrompts_A",
  HelpTopic_Export_Q = "HelpTopic_Export_Q",
  HelpTopic_Export_A = "HelpTopic_Export_A",
  HelpTopic_AIGeneration_Q = "HelpTopic_AIGeneration_Q",
  HelpTopic_AIGeneration_A = "HelpTopic_AIGeneration_A",
  HelpTopic_Navigation_Q = "HelpTopic_Navigation_Q",
  HelpTopic_Navigation_A = "HelpTopic_Navigation_A",

  // Feedback Button
  FeedbackButtonTooltip = "FeedbackButtonTooltip",
  FeedbackEmailSubject = "FeedbackEmailSubject",
  FeedbackEmailBody = "FeedbackEmailBody",

  // General UI Buttons
  ButtonBack = "ButtonBack",
  ButtonNext = "ButtonNext",
  ButtonGenerateStrategicChallenge = "ButtonGenerateStrategicChallenge",
  ButtonRegenerateChallenge = "ButtonRegenerateChallenge",
  ButtonGenerateSmartPrompts = "ButtonGenerateSmartPrompts",
  ButtonRegeneratePrompts = "ButtonRegeneratePrompts",
  ButtonAnalyzeBriefing = "ButtonAnalyzeBriefing", // New
  ButtonAnalyzing = "ButtonAnalyzing", // New
  CopyToClipboard = "CopyToClipboard",
  DownloadAsMD = "DownloadAsMD",
  ResultsCopied = "ResultsCopied",
  FailedToCopyResults = "FailedToCopyResults",
  ButtonChooseFile = "ButtonChooseFile", 
  ButtonRemoveFile = "ButtonRemoveFile", 
  ButtonUploadImages = "ButtonUploadImages",

  // Headers for Steps & Cards
  HeaderDiagnosis = "HeaderDiagnosis",
  HeaderChallengeFormulation = "HeaderChallengeFormulation",
  HeaderSmartPrompts = "HeaderSmartPrompts",
  HeaderResults = "HeaderResults",
  HeaderProjectSetup = "HeaderProjectSetup", 
  HeaderBusinessMarketContext = "HeaderBusinessMarketContext", 
  HeaderProblemConsumerContext = "HeaderProblemConsumerContext", 
  HeaderCurrentEffortsOptional = "HeaderCurrentEffortsOptional", 
  HeaderCulturalTension = "HeaderCulturalTension", 
  HeaderMarketOpportunity = "HeaderMarketOpportunity", 
  HeaderConsumerInsight = "HeaderConsumerInsight", 
  HeaderRumeltDiagnosis = "HeaderRumeltDiagnosis", 
  HeaderRumeltGuidingPolicy = "HeaderRumeltGuidingPolicy", 
  HeaderBehavioralJustification = "HeaderBehavioralJustification", 
  HeaderKeyAssumptions = "HeaderKeyAssumptions", 
  HeaderRelevantMentalModels = "HeaderRelevantMentalModels", 
  HeaderGeneratedIdeationPrompts = "HeaderGeneratedIdeationPrompts", 
  HeaderInformationSources = "HeaderInformationSources", 
  HeaderDiagnosisSnapshot = "HeaderDiagnosisSnapshot", 
  HeaderStrategicChallengeCore = "HeaderStrategicChallengeCore", 
  HeaderStrategicAlternatives = "HeaderStrategicAlternatives", // New
  
  // Descriptions for Steps
  DescriptionDiagnosis = "DescriptionDiagnosis", 
  DescriptionChallengeFormulation = "DescriptionChallengeFormulation", 
  DescriptionSmartPrompts = "DescriptionSmartPrompts", 
  DescriptionResults = "DescriptionResults", 

  // Placeholders / Labels / UI Text
  PlaceholderLoading = "PlaceholderLoading",
  LabelClientName = "LabelClientName", 
  LabelUploadBriefing = "LabelUploadBriefing", 
  LabelBriefingSource = "LabelBriefingSource",
  TabPDF = "TabPDF",
  TabImages = "TabImages",
  TabManualText = "TabManualText",
  LabelManualBriefing = "LabelManualBriefing",
  PlaceholderManualBriefing = "PlaceholderManualBriefing",
  LabelUploadImages = "LabelUploadImages",
  PlaceholderNoFileSelected = "PlaceholderNoFileSelected", 
  FileSelected = "FileSelected", 
  FileParsing = "FileParsing",
  
  LabelOpportunityType = "LabelOpportunityType", 
  LabelMediaRole = "LabelMediaRole", 
  LabelDigitalMaturity = "LabelDigitalMaturity", 

  LabelCustomerType = "LabelCustomerType", 
  PlaceholderCustomerType = "PlaceholderCustomerType", 
  LabelMarketCategory = "LabelMarketCategory", 
  PlaceholderMarketCategory = "PlaceholderMarketCategory", 
  LabelSectorIndustry = "LabelSectorIndustry", 
  PlaceholderSectorIndustry = "PlaceholderSectorIndustry", 
  LabelProductService = "LabelProductService", 
  PlaceholderProductService = "PlaceholderProductService", 
  LabelBusinessChallenge = "LabelBusinessChallenge",
  PlaceholderBusinessChallenge = "PlaceholderBusinessChallenge",
  LabelCustomerChallenge = "LabelCustomerChallenge",
  PlaceholderCustomerChallenge = "PlaceholderCustomerChallenge",
  LabelConsumerInvolvement = "LabelConsumerInvolvement", 
  LabelFunnelStage = "LabelFunnelStage", 
  LabelConsumerBarriers = "LabelConsumerBarriers", 
  PlaceholderConsumerBarriers = "PlaceholderConsumerBarriers", 
  LabelCurrentStrategy = "LabelCurrentStrategy", 
  PlaceholderCurrentStrategy = "PlaceholderCurrentStrategy", 
  AlertNonPDF = "AlertNonPDF", 
  PlaceholderAIWillGenerate = "PlaceholderAIWillGenerate", 
  MessageFormulatingChallenge = "MessageFormulatingChallenge", 
  MessageGeneratingPrompts = "MessageGeneratingPrompts", 
  ErrorGeneric = "ErrorGeneric", 
  ErrorChallengeNotFormulated = "ErrorChallengeNotFormulated", 
  ErrorDiagnosisNotComplete = "ErrorDiagnosisNotComplete", 
  TextNotSet = "TextNotSet", 
  TextNotGenerated = "TextNotGenerated", 
  TextNoPromptsGenerated = "TextNoPromptsGenerated", 
  SelectDefaultOption = "SelectDefaultOption", 
  
  LabelOptionA = "LabelOptionA",
  LabelOptionB = "LabelOptionB",
  LabelOptionC = "LabelOptionC",

  // Language Toggle
  LanguageToggleEN = "LanguageToggleEN",
  LanguageToggleES = "LanguageToggleES",

  // Accessibility
  StepperAriaLabel = "StepperAriaLabel", 
  LoadingSpinnerSR = "LoadingSpinnerSR", 
}

export interface HelpTopic {
  id: string;
  questionKey: UIStringKeys;
  answerKey: UIStringKeys;
}
