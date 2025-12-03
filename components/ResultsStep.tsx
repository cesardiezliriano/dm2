
import React, { useCallback } from 'react';
import { StrategySessionData, Language, UIStringKeys } from '../types';
import { getText } from '../constants';
import Card from './common/Card';
import Button from './common/Button';
import { DocumentTextIcon, CheckCircleIcon } from './Icons';
import SimpleMarkdown from './common/SimpleMarkdown'; // Import parser
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

interface ResultsStepProps {
  data: StrategySessionData;
  lang: Language;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ data, lang }) => {
  const formatForExport = useCallback(() => {
    let output = `# ${getText(lang, UIStringKeys.AppName)} - ${getText(lang, UIStringKeys.HeaderResults)}\n\n`;

    output += `## 1. ${getText(lang, UIStringKeys.HeaderDiagnosis)}\n\n`;
    output += `**${getText(lang, UIStringKeys.LabelClientName)}:** ${data.diagnosis.clientName || getText(lang, UIStringKeys.TextNotSet)}\n`;
    
    // Updated Context Fields
    output += `**${getText(lang, UIStringKeys.LabelOpportunityType)}:** ${data.diagnosis.opportunityType || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelMediaRole)}:** ${data.diagnosis.mediaRole || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelDigitalMaturity)}:** ${data.diagnosis.digitalMaturity || getText(lang, UIStringKeys.TextNotSet)}\n`;

    if (data.diagnosis.briefingFileName) {
      output += `**${getText(lang, UIStringKeys.LabelUploadBriefing)}:** ${data.diagnosis.briefingFileName}\n`;
    }
    
    output += `**${getText(lang, UIStringKeys.LabelCustomerType)}:** ${data.diagnosis.customerType || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelMarketCategory)}:** ${data.diagnosis.market || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelSectorIndustry)}:** ${data.diagnosis.sector || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelProductService)}:** ${data.diagnosis.productOrService || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelBusinessChallenge)}:** ${data.diagnosis.businessChallenge || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelCustomerChallenge)}:** ${data.diagnosis.customerChallenge || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelConsumerInvolvement)}:** ${data.diagnosis.consumerContext.involvement || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelFunnelStage)}:** ${data.diagnosis.consumerContext.funnelStage || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelConsumerBarriers)}:** ${data.diagnosis.consumerContext.barriers || getText(lang, UIStringKeys.TextNotSet)}\n`;
    output += `**${getText(lang, UIStringKeys.LabelCurrentStrategy)}:** ${data.diagnosis.currentStrategyAttempt || getText(lang, UIStringKeys.TextNotSet)}\n\n`;

    output += `## 2. ${getText(lang, UIStringKeys.HeaderChallengeFormulation)}\n\n`;
    
    // Display Alternatives
    const getSelectionLabel = (key: string) => {
        if (data.challenge.selectedAlternative === key) return " [SELECTED]";
        return "";
    }

    if (data.challenge.strategicAlternativeA) {
        output += `### ${getText(lang, UIStringKeys.LabelOptionA)}${getSelectionLabel('A')}:\n${data.challenge.strategicAlternativeA}\n\n`;
    }
    if (data.challenge.strategicAlternativeB) {
        output += `### ${getText(lang, UIStringKeys.LabelOptionB)}${getSelectionLabel('B')}:\n${data.challenge.strategicAlternativeB}\n\n`;
    }
    if (data.challenge.strategicAlternativeC) {
        output += `### ${getText(lang, UIStringKeys.LabelOptionC)}${getSelectionLabel('C')}:\n${data.challenge.strategicAlternativeC}\n\n`;
    }

    output += `### ${getText(lang, UIStringKeys.HeaderRumeltDiagnosis)}:\n${data.challenge.rumeltDiagnosis || getText(lang, UIStringKeys.TextNotGenerated)}\n\n`;
    output += `### ${getText(lang, UIStringKeys.HeaderRumeltGuidingPolicy)}:\n${data.challenge.rumeltGuidingPolicy || getText(lang, UIStringKeys.TextNotGenerated)}\n\n`;
    output += `### ${getText(lang, UIStringKeys.HeaderBehavioralJustification)}:\n${data.challenge.behavioralJustification || getText(lang, UIStringKeys.TextNotGenerated)}\n\n`;
    output += `### ${getText(lang, UIStringKeys.HeaderCulturalTension)}:\n${data.challenge.culturalTension || getText(lang, UIStringKeys.TextNotGenerated)}\n\n`;
    output += `### ${getText(lang, UIStringKeys.HeaderMarketOpportunity)}:\n${data.challenge.marketOpportunity || getText(lang, UIStringKeys.TextNotGenerated)}\n\n`;
    output += `### ${getText(lang, UIStringKeys.HeaderConsumerInsight)}:\n${data.challenge.consumerInsight || getText(lang, UIStringKeys.TextNotGenerated)}\n\n`;
    
    if (data.challenge.keyAssumptions) {
        output += `### ${getText(lang, UIStringKeys.HeaderKeyAssumptions)}:\n${data.challenge.keyAssumptions}\n\n`;
    }
    if (data.challenge.relevantMentalModels) {
        output += `### ${getText(lang, UIStringKeys.HeaderRelevantMentalModels)}:\n${data.challenge.relevantMentalModels}\n\n`;
    }
    
    output += `## 3. ${getText(lang, UIStringKeys.HeaderSmartPrompts)}\n\n`;
    if (data.generatedPrompts.length > 0) {
      data.generatedPrompts.forEach((prompt) => {
        output += `* ${prompt}\n`; 
      });
    } else {
      output += `_${getText(lang, UIStringKeys.TextNoPromptsGenerated)}_\n`; 
    }
    output += `\n---\n_Generated by ${getText(lang, UIStringKeys.AppName)}_`;
    return output;
  }, [data, lang]);

  const handleCopyToClipboard = async () => {
    try {
      const textToCopy = formatForExport();
      await navigator.clipboard.writeText(textToCopy);
      alert(getText(lang, UIStringKeys.ResultsCopied));
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert(getText(lang, UIStringKeys.FailedToCopyResults) + String(err));
    }
  };

  const handleDownloadTextFile = useCallback(() => {
    const textToDownload = formatForExport();
    const element = document.createElement("a");
    const file = new Blob([textToDownload], {type: 'text/markdown;charset=utf-8'}); 
    element.href = URL.createObjectURL(file);
    
    // FORMAT: CLIENTNAME_RetoEstrategico_YYYYMMDD_HHMM.md
    const clientName = (data.diagnosis.clientName || "Client").replace(/[^a-zA-Z0-9]/g, "_");
    const timestamp = getTimestamp();
    
    element.download = `${clientName}_RetoEstrategico_${timestamp}.md`; 
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  }, [formatForExport, data.diagnosis.clientName]);

  const handleDownloadDocx = useCallback(async () => {
      const children: any[] = [];
      const addHeading = (text: string, level: any) => children.push(new Paragraph({ text, heading: level, spacing: { before: 200, after: 100 } }));
      const addPara = (text: string) => children.push(new Paragraph({ text, spacing: { after: 100 } }));
      const addBold = (label: string, value: string) => children.push(new Paragraph({ children: [new TextRun({ text: label + ": ", bold: true }), new TextRun(value)] }));
      const addBullet = (text: string) => children.push(new Paragraph({ text, bullet: { level: 0 } }));
      
      // Parse markdown-like strings from AI to DOCX runs
      const addMarkdownPara = (markdownText: string) => {
          if (!markdownText) return;
          const lines = markdownText.split('\n');
          lines.forEach(line => {
             if (line.startsWith('### ')) {
                 addHeading(line.replace('### ', ''), HeadingLevel.HEADING_3);
             } else if (line.startsWith('## ')) {
                 addHeading(line.replace('## ', ''), HeadingLevel.HEADING_2);
             } else if (line.startsWith('* ') || line.startsWith('- ')) {
                 addBullet(line.substring(2));
             } else {
                 if(line.trim() !== '') addPara(line);
             }
          });
      };

      // TITLE
      addHeading(`${getText(lang, UIStringKeys.AppName)} - ${getText(lang, UIStringKeys.HeaderResults)}`, HeadingLevel.HEADING_1);

      // 1. DIAGNOSIS
      addHeading(getText(lang, UIStringKeys.HeaderDiagnosis), HeadingLevel.HEADING_2);
      addBold(getText(lang, UIStringKeys.LabelClientName), data.diagnosis.clientName || "-");
      addBold(getText(lang, UIStringKeys.LabelOpportunityType), data.diagnosis.opportunityType || "-");
      addBold(getText(lang, UIStringKeys.LabelMediaRole), data.diagnosis.mediaRole || "-");
      addBold(getText(lang, UIStringKeys.LabelDigitalMaturity), data.diagnosis.digitalMaturity || "-");
      addBold(getText(lang, UIStringKeys.LabelBusinessChallenge), data.diagnosis.businessChallenge || "-");
      addBold(getText(lang, UIStringKeys.LabelCustomerChallenge), data.diagnosis.customerChallenge || "-");

      // 2. CHALLENGE
      addHeading(getText(lang, UIStringKeys.HeaderChallengeFormulation), HeadingLevel.HEADING_2);
      
      const getSelectionLabel = (key: string) => data.challenge.selectedAlternative === key ? " [SELECTED]" : "";
      
      if (data.challenge.strategicAlternativeA) {
          addHeading(getText(lang, UIStringKeys.LabelOptionA) + getSelectionLabel('A'), HeadingLevel.HEADING_3);
          addMarkdownPara(data.challenge.strategicAlternativeA);
      }
      if (data.challenge.strategicAlternativeB) {
           addHeading(getText(lang, UIStringKeys.LabelOptionB) + getSelectionLabel('B'), HeadingLevel.HEADING_3);
           addMarkdownPara(data.challenge.strategicAlternativeB);
      }
      if (data.challenge.strategicAlternativeC) {
           addHeading(getText(lang, UIStringKeys.LabelOptionC) + getSelectionLabel('C'), HeadingLevel.HEADING_3);
           addMarkdownPara(data.challenge.strategicAlternativeC);
      }

      // Rumelt Kernel
      addHeading(getText(lang, UIStringKeys.HeaderRumeltDiagnosis), HeadingLevel.HEADING_3);
      addMarkdownPara(data.challenge.rumeltDiagnosis);

      addHeading(getText(lang, UIStringKeys.HeaderRumeltGuidingPolicy), HeadingLevel.HEADING_3);
      addMarkdownPara(data.challenge.rumeltGuidingPolicy);
      
      // 3. PROMPTS
      addHeading(getText(lang, UIStringKeys.HeaderSmartPrompts), HeadingLevel.HEADING_2);
      if (data.generatedPrompts.length > 0) {
        data.generatedPrompts.forEach(p => addBullet(p));
      } else {
        addPara(getText(lang, UIStringKeys.TextNoPromptsGenerated));
      }

      const doc = new Document({
          sections: [{
              properties: {},
              children: children,
          }],
      });

      const blob = await Packer.toBlob(doc);
      
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      const clientName = (data.diagnosis.clientName || "Client").replace(/[^a-zA-Z0-9]/g, "_");
      const timestamp = getTimestamp();
      element.download = `${clientName}_RetoEstrategico_${timestamp}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

  }, [data, lang]);

  const getTimestamp = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}${mm}${dd}_${hh}${min}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-2xl font-semibold text-[#36A7B7] mb-2 flex items-center font-['Montserrat']"> 
        <CheckCircleIcon className="w-7 h-7 mr-2 text-[#76CC9B]" /> 
        {getText(lang, UIStringKeys.HeaderResults)}
      </h2>
      <p className="text-[#6D7475] mb-6 font-['Open_Sans']"> 
        {getText(lang, UIStringKeys.DescriptionResults)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          onClick={handleCopyToClipboard} 
          icon={<DocumentTextIcon className="w-5 h-5" />}
          variant="secondary"
        >
          {getText(lang, UIStringKeys.CopyToClipboard)}
        </Button>
        <Button 
          onClick={handleDownloadTextFile} 
          icon={<DocumentTextIcon className="w-5 h-5" />}
          variant="primary"
        >
          {getText(lang, UIStringKeys.DownloadAsMD)}
        </Button>
         <Button 
          onClick={handleDownloadDocx} 
          icon={<DocumentTextIcon className="w-5 h-5" />}
          variant="primary"
        >
          {getText(lang, UIStringKeys.DownloadAsDOCX)}
        </Button>
      </div>

      <Card>
        <div className="bg-[#F8F8F8] p-6 rounded-lg border border-[#DDDDDD] overflow-y-auto max-h-[70vh]">
          {/* Use the new visualizer */}
          <SimpleMarkdown text={formatForExport()} />
        </div>
      </Card>
    </div>
  );
};

export default ResultsStep;