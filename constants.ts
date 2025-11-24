
import { DiagnosisData, FormulatedChallenge, FunnelStage, InvolvementLevel, Language, UIStringKeys, HelpTopic, OpportunityType, MediaRole, DigitalMaturity } from './types';

// FIX: Updated to 'gemini-3-pro-preview' for Complex Text Tasks (Strategy & Reasoning)
export const GEMINI_MODEL_TEXT = 'gemini-3-pro-preview';

export const initialDiagnosisData: DiagnosisData = {
  clientName: '',
  briefingFileName: null,
  briefingFileContent: null,
  manualBriefingText: '',
  screenshots: [],
  opportunityType: '',
  mediaRole: '',
  digitalMaturity: '',
  customerType: '',
  market: '',
  sector: '',
  productOrService: '',
  businessChallenge: '',
  customerChallenge: '',
  consumerContext: {
    involvement: '',
    funnelStage: '',
    barriers: '',
  },
  currentStrategyAttempt: '',
};

export const initialFormulatedChallenge: FormulatedChallenge = {
  strategicAlternativeA: '',
  strategicAlternativeB: '',
  strategicAlternativeC: '',
  selectedAlternative: '', // Default none selected
  culturalTension: '',
  marketOpportunity: '',
  consumerInsight: '',
  rumeltDiagnosis: '', // Changed from decisionTension
  rumeltGuidingPolicy: '', // New field
  behavioralJustification: '',
  keyAssumptions: '',
  relevantMentalModels: '',
};

export const defaultFunnelStages: FunnelStage[] = [
  FunnelStage.AWARENESS,
  FunnelStage.CONSIDERATION,
  FunnelStage.DECISION,
  FunnelStage.LOYALTY,
  FunnelStage.RETENTION,
  FunnelStage.ADVOCACY,
];

export const defaultInvolvementLevels: InvolvementLevel[] = [
  InvolvementLevel.LOW,
  InvolvementLevel.MEDIUM,
  InvolvementLevel.HIGH,
];

export const translations: Record<Language, Record<UIStringKeys, string>> = {
  [Language.EN]: {
    [UIStringKeys.AppName]: "Challenge Definition",
    [UIStringKeys.AppSubtitle]: "CSO AI: Digital Media, Data & Adtech Strategy.",
    [UIStringKeys.FooterStep]: "Step {current} of {total}",
    
    // History
    [UIStringKeys.ButtonHistory]: "History",
    [UIStringKeys.ButtonNewSession]: "New Session",
    [UIStringKeys.HistoryModalTitle]: "Saved Strategy Sessions",
    [UIStringKeys.HistoryEmpty]: "No saved sessions found.",
    [UIStringKeys.LabelLastModified]: "Last Modified",
    [UIStringKeys.ButtonLoad]: "Load",
    [UIStringKeys.ButtonDelete]: "Delete",
    [UIStringKeys.ConfirmDelete]: "Are you sure you want to delete this session?",
    [UIStringKeys.NewSessionConfirm]: "Start a new session? Unsaved progress will be lost.",

    [UIStringKeys.HelpButtonTooltip]: "Help & User Guide",
    [UIStringKeys.HelpModalTitle]: "CSO Assistant (DM 2)",
    [UIStringKeys.HelpModalIntro]: "Hello. I am your AI Chief Strategy Officer, specialized in Digital Media, Adtech, and Data. I do not do tactics. I transform disorder into strategic kernels.",
    [UIStringKeys.HelpModalDefaultContent]: "Please select a topic from the menu to see help information.",
    [UIStringKeys.HelpModalCloseButtonSR]: "Close help modal",
    [UIStringKeys.HelpModalTopicsHeader]: "Help Topics",

    [UIStringKeys.HelpTopic_Overview_Q]: "What is DM 2. Challenge Definition?",
    [UIStringKeys.HelpTopic_Overview_A]: "This tool is the mandatory starting point for New Business, Upsell, and Cross-sell. It acts as a CSO specializing in Media & Data, converting disordered inputs into a structured Rumelt Strategy Kernel.",
    [UIStringKeys.HelpTopic_Diagnosis_Q]: "How do I complete the Diagnosis step?",
    [UIStringKeys.HelpTopic_Diagnosis_A]: "Client Name is mandatory. Select the Opportunity Type, Media Role, and Maturity. Optionally upload any file type (PDF, PPTX, etc.) or paste text. Then click 'Analyze Briefing' to let the AI deduce the core challenges.",
    [UIStringKeys.HelpTopic_ChallengeFormulation_Q]: "Understanding the Output (Rumelt)",
    [UIStringKeys.HelpTopic_ChallengeFormulation_A]: "We use Rumelt's framework applied to Adtech:\n- **Diagnosis:** The root cause (e.g., Data signal loss).\n- **Guiding Policy:** The strategic approach (e.g., First-party data architecture).\nWe do NOT provide tactical solutions (banners, creatives) here.",
    [UIStringKeys.HelpTopic_SmartPrompts_Q]: "What are the Smart Prompts?",
    [UIStringKeys.HelpTopic_SmartPrompts_A]: "These are not creative ideas. They are 'Strategic Investigation Avenues'—directions for your team to explore regarding Data, Tech, and Media efficiency.",
    [UIStringKeys.HelpTopic_Export_Q]: "How can I save or share my work?",
    [UIStringKeys.HelpTopic_Export_A]: "In the final \"Summary & Export\" step, you can review all the information from your session.\nUse the \"Copy to Clipboard\" button to copy the entire summary in Markdown format.\nUse the \"Download as .md File\" button to save the summary as a Markdown file for easy sharing and future reference.",
    [UIStringKeys.HelpTopic_AIGeneration_Q]: "How does AI generation work? What if I see errors?",
    [UIStringKeys.HelpTopic_AIGeneration_A]: "DM 2. Challenge Definition uses Google's Gemini AI to analyze your inputs and generate strategic insights and prompts based on Rumelt's framework.\nIf you encounter errors:\n- Ensure all required fields in the Diagnosis step are filled comprehensively.\n- Check your internet connection.\n- Try regenerating the content. If the issue persists, the AI service might be temporarily unavailable.",
    [UIStringKeys.HelpTopic_Navigation_Q]: "How do I move between steps?",
    [UIStringKeys.HelpTopic_Navigation_A]: "Use the \"Next\" and \"Back\" buttons at the bottom of the page to navigate sequentially through the steps.\nYou can also click on the step names in the progress stepper at the top to jump to a previously completed step or the current step.",

    [UIStringKeys.FeedbackButtonTooltip]: "Send Feedback",
    [UIStringKeys.FeedbackEmailSubject]: "Feedback about DM 2. Challenge Definition",
    [UIStringKeys.FeedbackEmailBody]: "Hello LLYC Team,\n\nI'd like to provide the following feedback regarding the DM 2. Challenge Definition application:\n\n[Please describe your feedback here, including any suggestions or issues encountered.]\n\nThank you.",
    
    [UIStringKeys.ButtonBack]: "Back",
    [UIStringKeys.ButtonNext]: "Next",
    [UIStringKeys.ButtonGenerateStrategicChallenge]: "Generate Strategic Challenge Kernel (CSO)",
    [UIStringKeys.ButtonRegenerateChallenge]: "Regenerate Challenge Kernel",
    [UIStringKeys.ButtonGenerateSmartPrompts]: "Generate Strategic Avenues",
    [UIStringKeys.ButtonRegeneratePrompts]: "Regenerate Avenues",
    [UIStringKeys.ButtonAnalyzeBriefing]: "Analyze Briefing with AI", // UPDATED
    [UIStringKeys.ButtonAnalyzing]: "Analyzing Briefing...", // UPDATED
    [UIStringKeys.CopyToClipboard]: "Copy to Clipboard",
    [UIStringKeys.DownloadAsMD]: "Download as .md File",
    [UIStringKeys.ResultsCopied]: "Results copied to clipboard!",
    [UIStringKeys.FailedToCopyResults]: "Failed to copy results: ",
    [UIStringKeys.ButtonChooseFile]: "Choose File",
    [UIStringKeys.ButtonRemoveFile]: "Remove File",
    [UIStringKeys.ButtonUploadImages]: "Choose Images",

    [UIStringKeys.HeaderDiagnosis]: "Phase 1: Initial Diagnosis",
    [UIStringKeys.HeaderChallengeFormulation]: "Phase 2: Challenge Definition",
    [UIStringKeys.HeaderSmartPrompts]: "Phase 3: Strategic Avenues",
    [UIStringKeys.HeaderResults]: "Phase 4: Summary & Export",
    [UIStringKeys.HeaderProjectSetup]: "Client & Context Setup", 
    [UIStringKeys.HeaderBusinessMarketContext]: "Business & Market Context (AI Extracted)", 
    [UIStringKeys.HeaderProblemConsumerContext]: "Problem, Context & Current Efforts (AI Extracted)", 
    [UIStringKeys.HeaderCurrentEffortsOptional]: "Current Efforts", 
    [UIStringKeys.HeaderCulturalTension]: "Cultural Tension (Context)", 
    [UIStringKeys.HeaderMarketOpportunity]: "Market Opportunity (Adtech/Data)", 
    [UIStringKeys.HeaderConsumerInsight]: "Consumer Insight (Context)", 
    [UIStringKeys.HeaderRumeltDiagnosis]: "Rumelt's Diagnosis (The Core Challenge)", 
    [UIStringKeys.HeaderRumeltGuidingPolicy]: "Rumelt's Guiding Policy (The Approach)", 
    [UIStringKeys.HeaderBehavioralJustification]: "Behavioral Justification (Why it works)",
    [UIStringKeys.HeaderKeyAssumptions]: "Key Assumptions",
    [UIStringKeys.HeaderRelevantMentalModels]: "Relevant Mental Models / Rumelt's Sources of Power",
    [UIStringKeys.HeaderGeneratedIdeationPrompts]: "Strategic Avenues (Data, Tech, Media)",
    [UIStringKeys.HeaderInformationSources]: "Information Sources",
    [UIStringKeys.HeaderDiagnosisSnapshot]: "Diagnosis Input Snapshot",
    [UIStringKeys.HeaderStrategicChallengeCore]: "Strategic Challenge Kernel (Rumelt)",
    [UIStringKeys.HeaderStrategicAlternatives]: "3 Strategic Angles (Select One)", // New
  
    [UIStringKeys.DescriptionDiagnosis]: "Provide client details and optional inputs. The AI will extract the context using your settings.",
    [UIStringKeys.DescriptionChallengeFormulation]: "The AI CSO articulates 3 Strategic Angles (Challenger, Consultative, Mixed). Select the one that best fits.",
    [UIStringKeys.DescriptionSmartPrompts]: "Identify avenues for investigation in Data, Tech, and Media efficiency to support the Guiding Policy.",
    [UIStringKeys.DescriptionResults]: "Review your complete strategic formulation. You can copy it or download it as a text file.",

    [UIStringKeys.PlaceholderLoading]: "Loading...",
    [UIStringKeys.LabelClientName]: "Client Name (Mandatory)",
    [UIStringKeys.PlaceholderNoFileSelected]: "No file selected",
    [UIStringKeys.FileSelected]: "Selected: {fileName}",
    [UIStringKeys.FileParsing]: "Parsing: {fileName}",
    
    [UIStringKeys.LabelOpportunityType]: "Opportunity Type",
    [UIStringKeys.LabelMediaRole]: "Expected Media Role",
    [UIStringKeys.LabelDigitalMaturity]: "Digital Maturity Level",

    [UIStringKeys.LabelUploadBriefing]: "Briefing / Inputs",
    [UIStringKeys.LabelBriefingSource]: "Briefing Source (Optional)",
    [UIStringKeys.TabPDF]: "File Upload",
    [UIStringKeys.TabImages]: "Screenshots",
    [UIStringKeys.TabManualText]: "Manual Input",
    [UIStringKeys.LabelManualBriefing]: "Manual Briefing / Raw Notes",
    [UIStringKeys.PlaceholderManualBriefing]: "Paste disordered notes, emails, client conversations, or brain dumps here. The AI will structure it.",
    [UIStringKeys.LabelUploadImages]: "Upload Screenshots (Max 5)",
    [UIStringKeys.LabelCustomerType]: "Target Customer Type / Persona",
    [UIStringKeys.PlaceholderCustomerType]: "e.g., SME Founders, Gen Z Gamers",
    [UIStringKeys.LabelMarketCategory]: "Market / Category",
    [UIStringKeys.PlaceholderMarketCategory]: "e.g., B2B SaaS, Sustainable Fashion",
    [UIStringKeys.LabelSectorIndustry]: "Sector / Industry",
    [UIStringKeys.PlaceholderSectorIndustry]: "e.g., Fintech, Healthcare Tech",
    [UIStringKeys.LabelProductService]: "Product or Service Name/Type",
    [UIStringKeys.PlaceholderProductService]: "e.g., AI-powered CRM, Organic Skincare Line",
    [UIStringKeys.LabelBusinessChallenge]: "The Business Challenge (What problem does the *company* face?)",
    [UIStringKeys.PlaceholderBusinessChallenge]: "e.g., Stagnant market share, low brand differentiation, inefficient customer acquisition.",
    [UIStringKeys.LabelCustomerChallenge]: "The Customer Challenge (What problem does the *end-user* face?)",
    [UIStringKeys.PlaceholderCustomerChallenge]: "e.g., Overwhelmed by complex software, unable to find sustainable products, feels disconnected from brands.",
    [UIStringKeys.LabelConsumerInvolvement]: "Consumer Involvement Level",
    [UIStringKeys.LabelFunnelStage]: "Typical Funnel Stage for Target Interaction",
    [UIStringKeys.LabelConsumerBarriers]: "Key Consumer Barriers/Frictions",
    [UIStringKeys.PlaceholderConsumerBarriers]: "e.g., High price perception, complex onboarding, lack of trust",
    [UIStringKeys.LabelCurrentStrategy]: "Previous Efforts / Current Strategy (Auto-detected)",
    [UIStringKeys.PlaceholderCurrentStrategy]: "e.g., Ran social media ads, offered discounts, focused on SEO content",
    [UIStringKeys.AlertNonPDF]: "File selected. Note: Only PDF and TXT support content auto-extraction. For others, the AI will rely on filename and your dropdown choices.",
    [UIStringKeys.PlaceholderAIWillGenerate]: "The AI CSO will generate this based on your inputs...",
    [UIStringKeys.MessageFormulatingChallenge]: "The AI CSO is designing 3 Strategic Angles (Media + Tech + Data)...",
    [UIStringKeys.MessageGeneratingPrompts]: "Defining strategic investigation avenues...",
    [UIStringKeys.ErrorGeneric]: "An unknown error occurred.",
    [UIStringKeys.ErrorChallengeNotFormulated]: "Please ensure Rumelt's Diagnosis and Guiding Policy are formulated before generating prompts.",
    [UIStringKeys.ErrorDiagnosisNotComplete]: "Please complete the Client Name. Click 'Analyze Briefing' to extract the context from inputs or defaults.",
    [UIStringKeys.TextNotSet]: "Not set",
    [UIStringKeys.TextNotGenerated]: "Not generated",
    [UIStringKeys.TextNoPromptsGenerated]: "No avenues generated yet.",
    [UIStringKeys.SelectDefaultOption]: "Select an option...",

    [UIStringKeys.LabelOptionA]: "Option A: Challenger",
    [UIStringKeys.LabelOptionB]: "Option B: Consultative",
    [UIStringKeys.LabelOptionC]: "Option C: Mixed / Synthesis",

    [UIStringKeys.LanguageToggleEN]: "EN",
    [UIStringKeys.LanguageToggleES]: "ES",

    [UIStringKeys.StepperAriaLabel]: "Progress",
    [UIStringKeys.LoadingSpinnerSR]: "Loading...",
  },
  [Language.ES]: {
    [UIStringKeys.AppName]: "Definición del Reto", 
    [UIStringKeys.AppSubtitle]: "CSO AI: Estrategia de Medios, Data y Adtech.",
    [UIStringKeys.FooterStep]: "Paso {current} de {total}",

    // History
    [UIStringKeys.ButtonHistory]: "Historial",
    [UIStringKeys.ButtonNewSession]: "Nueva Sesión",
    [UIStringKeys.HistoryModalTitle]: "Sesiones Guardadas",
    [UIStringKeys.HistoryEmpty]: "No se encontraron sesiones guardadas.",
    [UIStringKeys.LabelLastModified]: "Última Modificación",
    [UIStringKeys.ButtonLoad]: "Cargar",
    [UIStringKeys.ButtonDelete]: "Borrar",
    [UIStringKeys.ConfirmDelete]: "¿Seguro que quieres borrar esta sesión?",
    [UIStringKeys.NewSessionConfirm]: "¿Iniciar nueva sesión? Se perderá el progreso no guardado.",

    [UIStringKeys.HelpButtonTooltip]: "Ayuda y Guía de Usuario",
    [UIStringKeys.HelpModalTitle]: "Asistente CSO (DM 2)",
    [UIStringKeys.HelpModalIntro]: "¡Hola! Soy tu Chief Strategy Officer (IA) especializado en Digital Media, Adtech y Data. No hago tácticas. Transformo el caos en núcleos estratégicos.",
    [UIStringKeys.HelpModalDefaultContent]: "Por favor, selecciona un tema del menú para ver la información de ayuda.",
    [UIStringKeys.HelpModalCloseButtonSR]: "Cerrar modal de ayuda",
    [UIStringKeys.HelpModalTopicsHeader]: "Temas de Ayuda",

    [UIStringKeys.HelpTopic_Overview_Q]: "¿Qué es DM 2. Definición del Reto?",
    [UIStringKeys.HelpTopic_Overview_A]: "Es el paso obligatorio de arranque para New Business, Upsell y Cross-sell. Actúa como un CSO experto en Medios y Data, convirtiendo inputs desordenados en una estrategia sólida basada en Rumelt.",
    [UIStringKeys.HelpTopic_Diagnosis_Q]: "¿Cómo completo el paso de Diagnóstico?",
    [UIStringKeys.HelpTopic_Diagnosis_A]: "El Nombre del Cliente es obligatorio. Selecciona Tipo de Oportunidad, Rol de Medios y Madurez. Opcionalmente sube cualquier archivo (PDF, PPTX, etc) o pega texto. Luego pulsa 'Analizar Briefing' para que la IA deduzca los retos.",
    [UIStringKeys.HelpTopic_ChallengeFormulation_Q]: "Entendiendo el Output (Rumelt)",
    [UIStringKeys.HelpTopic_ChallengeFormulation_A]: "Usamos el marco de Rumelt aplicado a Adtech:\n- **Diagnóstico:** La causa raíz (ej. pérdida de señal de Data).\n- **Política Guía:** El enfoque estratégico (ej. Soberanía de First-party data).\nNO damos soluciones tácticas (banners, creatividades) aquí.",
    [UIStringKeys.HelpTopic_SmartPrompts_Q]: "¿Qué son los Prompts Inteligentes?",
    [UIStringKeys.HelpTopic_SmartPrompts_A]: "No son ideas creativas. Son 'Vías de Investigación Estratégica' para que tu equipo explore temas de Data, Tecnología y Eficiencia de Medios.",
    [UIStringKeys.HelpTopic_Export_Q]: "¿Cómo puedo guardar o compartir mi trabajo?",
    [UIStringKeys.HelpTopic_Export_A]: "En el paso final \"Resumen y Exportación\", puedes revisar toda la información de tu sesión.\nUsa el botón \"Copiar al Portapapeles\" para copiar el resumen completo en formato Markdown.\nUsa el botón \"Descargar como Archivo .md\" para guardar el resumen como un archivo Markdown para compartir fácilmente y referencia futura.",
    [UIStringKeys.HelpTopic_AIGeneration_Q]: "¿Cómo funciona la generación por IA? ¿Qué pasa si veo errores?",
    [UIStringKeys.HelpTopic_AIGeneration_A]: "DM 2. Definición del Reto utiliza la IA Gemini de Google para analizar tus entradas y generar insights estratégicos y prompts basados en el marco de Rumelt.\nSi encuentras errores:\n- Asegúrate de que todos los campos requeridos en el paso de Diagnóstico estén completos.\n- Verifica tu conexión a internet.\n- Intenta regenerar el contenido. Si el problema persiste, el servicio de IA podría estar temporalmente no disponible.",
    [UIStringKeys.HelpTopic_Navigation_Q]: "¿Cómo me muevo entre los pasos?",
    [UIStringKeys.HelpTopic_Navigation_A]: "Usa los botones \"Siguiente\" y \"Anterior\" en la parte inferior de la página para navegar secuencialmente a través de los pasos.\nTambién puedes hacer clic en los nombres de los pasos en el indicador de progreso en la parte superior para saltar a un paso previamente completado o al paso actual.",

    [UIStringKeys.FeedbackButtonTooltip]: "Enviar Feedback",
    [UIStringKeys.FeedbackEmailSubject]: "Feedback sobre DM 2. Definición del Reto",
    [UIStringKeys.FeedbackEmailBody]: "Hola Equipo LLYC,\n\nMe gustaría proporcionar el siguiente feedback sobre la aplicación DM 2. Definición del Reto:\n\n[Por favor, describe tu feedback aquí, incluyendo sugerencias o problemas encontrados.]\n\nGracias.",

    [UIStringKeys.ButtonBack]: "Anterior",
    [UIStringKeys.ButtonNext]: "Siguiente",
    [UIStringKeys.ButtonGenerateStrategicChallenge]: "Generar Núcleo del Reto (CSO)",
    [UIStringKeys.ButtonRegenerateChallenge]: "Regenerar Núcleo del Reto",
    [UIStringKeys.ButtonGenerateSmartPrompts]: "Generar Vías Estratégicas",
    [UIStringKeys.ButtonRegeneratePrompts]: "Regenerar Vías",
    [UIStringKeys.ButtonAnalyzeBriefing]: "Analizar briefing con IA", // UPDATED: Lowercase 'briefing' and removed CSO
    [UIStringKeys.ButtonAnalyzing]: "Analizando briefing...", // UPDATED
    [UIStringKeys.CopyToClipboard]: "Copiar al Portapapeles",
    [UIStringKeys.DownloadAsMD]: "Descargar como .md",
    [UIStringKeys.ResultsCopied]: "¡Resultados copiados al portapapeles!",
    [UIStringKeys.FailedToCopyResults]: "Error al copiar resultados: ",
    [UIStringKeys.ButtonChooseFile]: "Elegir Archivo",
    [UIStringKeys.ButtonRemoveFile]: "Eliminar Archivo",
    [UIStringKeys.ButtonUploadImages]: "Elegir Imágenes",
    
    [UIStringKeys.HeaderDiagnosis]: "Fase 1: Diagnóstico Inicial",
    [UIStringKeys.HeaderChallengeFormulation]: "Fase 2: Definición del Reto",
    [UIStringKeys.HeaderSmartPrompts]: "Fase 3: Vías Estratégicas",
    [UIStringKeys.HeaderResults]: "Fase 4: Resumen y Exportación",
    [UIStringKeys.HeaderProjectSetup]: "Cliente y Contexto",
    [UIStringKeys.HeaderBusinessMarketContext]: "Contexto de Negocio (Extraído por IA)",
    [UIStringKeys.HeaderProblemConsumerContext]: "Contexto Problema, Consumidor y Esfuerzos Previos",
    [UIStringKeys.HeaderCurrentEffortsOptional]: "Esfuerzos Actuales",
    [UIStringKeys.HeaderCulturalTension]: "Tensión Cultural (Contexto)",
    [UIStringKeys.HeaderMarketOpportunity]: "Oportunidad de Mercado (Adtech/Data)",
    [UIStringKeys.HeaderConsumerInsight]: "Insight del Consumidor (Contexto)",
    [UIStringKeys.HeaderRumeltDiagnosis]: "Diagnóstico de Rumelt (El Reto Central)", 
    [UIStringKeys.HeaderRumeltGuidingPolicy]: "Política Guía de Rumelt (El Enfoque)", 
    [UIStringKeys.HeaderBehavioralJustification]: "Justificación Conductual (Por qué funciona)",
    [UIStringKeys.HeaderKeyAssumptions]: "Suposiciones Clave",
    [UIStringKeys.HeaderRelevantMentalModels]: "Modelos Mentales Relevantes / Fuentes de Poder de Rumelt",
    [UIStringKeys.HeaderGeneratedIdeationPrompts]: "Vías Estratégicas (Data, Tech, Media)",
    [UIStringKeys.HeaderInformationSources]: "Fuentes de Información",
    [UIStringKeys.HeaderDiagnosisSnapshot]: "Resumen del Diagnóstico (Entrada)",
    [UIStringKeys.HeaderStrategicChallengeCore]: "Núcleo del Reto Estratégico (Rumelt)",
    [UIStringKeys.HeaderStrategicAlternatives]: "3 Ángulos Estratégicos (Selecciona Uno)", // New

    [UIStringKeys.DescriptionDiagnosis]: "Aporta detalles del cliente y opciones obligatorias. El CSO IA extraerá el contexto de estos datos y archivos opcionales.",
    [UIStringKeys.DescriptionChallengeFormulation]: "El CSO IA diseña 3 Ángulos (Challenger, Consultivo, Mixto). Selecciona el que mejor encaje.",
    [UIStringKeys.DescriptionSmartPrompts]: "Identifica vías de investigación en Data, Tech y Eficiencia de Medios para apoyar la Política Guía.",
    [UIStringKeys.DescriptionResults]: "Revisa tu formulación estratégica completa. Puedes copiarla o descargarla como un archivo de texto.",

    [UIStringKeys.PlaceholderLoading]: "Cargando...",
    [UIStringKeys.LabelClientName]: "Nombre del Cliente (Obligatorio)",
    [UIStringKeys.PlaceholderNoFileSelected]: "Ningún archivo seleccionado",
    [UIStringKeys.FileSelected]: "Seleccionado: {fileName}",
    [UIStringKeys.FileParsing]: "Analizando: {fileName}",

    [UIStringKeys.LabelOpportunityType]: "Tipo de Oportunidad",
    [UIStringKeys.LabelMediaRole]: "Rol Esperado de Medios",
    [UIStringKeys.LabelDigitalMaturity]: "Nivel de Madurez Digital",

    [UIStringKeys.LabelUploadBriefing]: "Briefing / Entradas",
    [UIStringKeys.LabelBriefingSource]: "Fuente del Briefing (Opcional)",
    [UIStringKeys.TabPDF]: "Subir Archivo",
    [UIStringKeys.TabImages]: "Pantallazos",
    [UIStringKeys.TabManualText]: "Input Manual",
    [UIStringKeys.LabelManualBriefing]: "Briefing Manual / Notas Crudas",
    [UIStringKeys.PlaceholderManualBriefing]: "Pega notas desordenadas, correos, conversaciones con cliente o brain dumps aquí. La IA estructurará el caos.",
    [UIStringKeys.LabelUploadImages]: "Subir Pantallazos (Máx 5)",
    [UIStringKeys.LabelCustomerType]: "Tipo de Cliente / Persona Objetivo",
    [UIStringKeys.PlaceholderCustomerType]: "Ej: Fundadores de PYMEs, Gamers Gen Z",
    [UIStringKeys.LabelMarketCategory]: "Mercado / Categoría",
    [UIStringKeys.PlaceholderMarketCategory]: "Ej: SaaS B2B, Moda Sostenible",
    [UIStringKeys.LabelSectorIndustry]: "Sector / Industria",
    [UIStringKeys.PlaceholderSectorIndustry]: "Ej: Fintech, Tecnología Sanitaria",
    [UIStringKeys.LabelProductService]: "Nombre/Tipo de Producto o Servicio",
    [UIStringKeys.PlaceholderProductService]: "Ej: CRM con IA, Línea de Cosmética Orgánica",
    [UIStringKeys.LabelBusinessChallenge]: "El Reto de Negocio (¿Qué problema enfrenta la *empresa*?)",
    [UIStringKeys.PlaceholderBusinessChallenge]: "Ej: Cuota de mercado estancada, baja diferenciación de marca, adquisición de clientes ineficiente.",
    [UIStringKeys.LabelCustomerChallenge]: "El Reto del Cliente (¿Qué problema enfrenta el *usuario final*?)",
    [UIStringKeys.PlaceholderCustomerChallenge]: "Ej: Abrumado por software complejo, no encuentra productos sostenibles, se siente desconectado de las marcas.",
    [UIStringKeys.LabelConsumerInvolvement]: "Nivel de Implicación del Consumidor",
    [UIStringKeys.LabelFunnelStage]: "Etapa Típica del Embudo para Interacción Objetivo",
    [UIStringKeys.LabelConsumerBarriers]: "Barreras/Fricciones Clave del Consumidor",
    [UIStringKeys.PlaceholderConsumerBarriers]: "Ej: Percepción de precio alto, onboarding complejo, falta de confianza",
    [UIStringKeys.LabelCurrentStrategy]: "Esfuerzos Previos / Estrategia Actual (Auto-detectado)",
    [UIStringKeys.PlaceholderCurrentStrategy]: "Ej: Campañas en redes sociales, descuentos, contenido SEO",
    [UIStringKeys.AlertNonPDF]: "Archivo seleccionado. Nota: Solo PDF y TXT permiten auto-extracción de texto. Para otros formatos, la IA usará el nombre del archivo y tus selecciones.",
    [UIStringKeys.PlaceholderAIWillGenerate]: "El CSO IA generará esto basándose en tus inputs...",
    [UIStringKeys.MessageFormulatingChallenge]: "El CSO IA está diseñando 3 Ángulos Estratégicos (Media + Tech + Data)...",
    [UIStringKeys.MessageGeneratingPrompts]: "Definiendo vías de investigación estratégica...",
    [UIStringKeys.ErrorGeneric]: "Ocurrió un error desconocido.",
    [UIStringKeys.ErrorChallengeNotFormulated]: "Asegúrate de que el Diagnóstico y la Política Guía de Rumelt estén formulados antes de generar prompts.",
    [UIStringKeys.ErrorDiagnosisNotComplete]: "Por favor, completa Nombre Cliente. Pulsa 'Analizar Briefing' para extraer el contexto de los inputs o valores por defecto.",
    [UIStringKeys.TextNotSet]: "No establecido",
    [UIStringKeys.TextNotGenerated]: "No generado",
    [UIStringKeys.TextNoPromptsGenerated]: "Aún no se han generado vías.",
    [UIStringKeys.SelectDefaultOption]: "Selecciona una opción...",

    [UIStringKeys.LabelOptionA]: "Opción A: Challenger",
    [UIStringKeys.LabelOptionB]: "Opción B: Consultiva",
    [UIStringKeys.LabelOptionC]: "Opción C: Mixta / Síntesis",

    [UIStringKeys.LanguageToggleEN]: "EN",
    [UIStringKeys.LanguageToggleES]: "ES",

    [UIStringKeys.StepperAriaLabel]: "Progreso",
    [UIStringKeys.LoadingSpinnerSR]: "Cargando...",
  },
};

export const getText = (lang: Language, key: UIStringKeys, replacements?: Record<string, string | number>): string => {
  let text = translations[lang]?.[key] || translations[Language.EN]?.[key] || `Missing translation for ${key}`; 
  if (replacements) {
    Object.keys(replacements).forEach(placeholder => {
      text = text.replace(`{${placeholder}}`, String(replacements[placeholder]));
    });
  }
  return text;
};


export const HELP_TOPICS_LIST: HelpTopic[] = [
  { id: "overview", questionKey: UIStringKeys.HelpTopic_Overview_Q, answerKey: UIStringKeys.HelpTopic_Overview_A },
  { id: "diagnosis", questionKey: UIStringKeys.HelpTopic_Diagnosis_Q, answerKey: UIStringKeys.HelpTopic_Diagnosis_A },
  { id: "challenge", questionKey: UIStringKeys.HelpTopic_ChallengeFormulation_Q, answerKey: UIStringKeys.HelpTopic_ChallengeFormulation_A },
  { id: "prompts", questionKey: UIStringKeys.HelpTopic_SmartPrompts_Q, answerKey: UIStringKeys.HelpTopic_SmartPrompts_A },
  { id: "export", questionKey: UIStringKeys.HelpTopic_Export_Q, answerKey: UIStringKeys.HelpTopic_Export_A },
  { id: "ai", questionKey: UIStringKeys.HelpTopic_AIGeneration_Q, answerKey: UIStringKeys.HelpTopic_AIGeneration_A },
  { id: "navigation", questionKey: UIStringKeys.HelpTopic_Navigation_Q, answerKey: UIStringKeys.HelpTopic_Navigation_A },
];

export const FEEDBACK_EMAIL_RECIPIENTS = "luisma.nunez@llyc.global,marta.devicente@llyc.global,cesar.diez@llyc.global";
