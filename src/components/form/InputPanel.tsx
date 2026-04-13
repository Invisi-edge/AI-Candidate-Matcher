"use client";

import { DropZone } from "../file-upload/DropZone";
import { FileList } from "../file-upload/FileList";

export type TemplateKey =
  | "fullStackEngineer"
  | "videoEditor"
  | "productDesigner"
  | "salesExecutive"
  | "aiEngineer"
  | "projectManager"
  | "networkEngineer"
  | "fecTechnicalLead";

export const JD_TEMPLATES: Record<TemplateKey, { label: string; value: string }> = {
  fullStackEngineer: {
    label: "Full Stack Engineer",
    value: `Senior Full Stack Engineer

Requirements:
- 4+ years building web applications
- Strong experience with React, TypeScript, Node.js, and SQL
- Experience integrating APIs and deploying production systems
- Good communication and collaboration skills
- Exposure to AI, automation, or analytics is a plus`,
  },
  videoEditor: {
    label: "Video Editor",
    value: `Senior Video Editor

Requirements:
- 3+ years editing short-form and long-form video content
- Strong experience with Adobe Premiere Pro, After Effects, and motion graphics
- Ability to create social media reels, ad creatives, and YouTube videos
- Good storytelling sense, pacing, and visual composition
- Experience collaborating with marketing and content teams`,
  },
  productDesigner: {
    label: "Product Designer",
    value: `Product Designer

Requirements:
- 3+ years designing web and mobile product experiences
- Strong experience with Figma, design systems, and prototyping
- Ability to turn business requirements into clean user flows and interfaces
- Experience working closely with product managers and developers
- Strong communication and UX research thinking`,
  },
  salesExecutive: {
    label: "Sales Executive",
    value: `Sales Executive

Requirements:
- 2+ years of B2B or SaaS sales experience
- Strong lead generation, follow-up, and closing skills
- Experience with CRM tools such as HubSpot or Salesforce
- Strong communication, presentation, and negotiation ability
- Ability to manage pipeline and achieve monthly targets`,
  },
  aiEngineer: {
    label: "AI Engineer",
    value: `AI Engineer

Requirements:
- 3+ years building AI or machine learning applications
- Strong experience with Python, APIs, LLM workflows, and prompt engineering
- Experience deploying AI features into production systems
- Familiarity with vector databases, automation pipelines, and model evaluation
- Good communication and cross-functional collaboration skills`,
  },
  projectManager: {
    label: "Project Manager (Federal)",
    value: `Project Manager - Federal Election Commission (FEC)
Location: Remote

Position Description:
The Project Manager (PM) will serve as the primary liaison between the Federal Election Commission (FEC) and the contractor team, ensuring successful execution of all contract requirements. The PM will oversee project planning, coordination, and delivery while managing contractor personnel and ensuring compliance with technical, security, and administrative standards.

Requirements:
- 5+ years of experience in project management roles, preferably in IT or government contracts
- Bachelor's degree in Computer Science, Information Technology, or Business Administration
- Project Management Professional (PMP) certification required
- ITIL Foundation Certification required
- Experience with Confluence for documentation
- Strong stakeholder communication and team management skills
- Experience with quality assurance and risk management
- Knowledge of security and accessibility standards

Preferred:
- 7-10 years managing large-scale IT projects including cloud-based systems
- Master's degree in Project Management or Business Administration
- Certified Scrum Master (CSM) or Agile Certified Practitioner (PMI-ACP)
- AWS Certified Solutions Architect or AWS Certified Cloud Practitioner
- Security+ or CISSP certification
- May require National Agency Check Inquiry (NACI) background investigation`,
  },
  networkEngineer: {
    label: "Network Engineer (DoD)",
    value: `Unified Communications Engineer / Lead Network Engineer
Location: Fort Meade, MD (Hybrid)
Clearance: Secret Clearance or Higher Required
Certification: CompTIA Security+ Required

Position Description:
Lead Network Engineer providing Gateway Engineering Support for end-to-end engineering solutions for DISN projects. Must have high level knowledge of DoD Enterprise Classified Travel Kit (DECTK) gateways, Internet and cloud gateways, and Satellite Communications Gateways.

Requirements:
- Strong routing protocols and IP network design: IPSEC, BGP, MPLS, OSPF, IS-IS, Multicast
- Layer-2/Layer-3 VPN experience
- Unified communications experience: Cisco voice gateways, unified communication managers, SIP trunking
- Experience with Type 1 HAIPE encryption devices, secure tokens
- Laboratory testing with Wireshark, SNMP, Kiwi-Syslog
- Design, build, test, implement and maintain Gateway engineering solutions
- Configure routers, switches, firewalls, voice gateways
- Develop test plans, implementation plans, configuration guides
- Incident response and Tier III support experience

Preferred:
- DoD and/or Government program experience
- DISA experience
- Excellent communication and leadership skills
- Working knowledge of Microsoft Office Tools`,
  },
  fecTechnicalLead: {
    label: "Technical Lead (FEC)",
    value: `Technical Lead - Federal Election Commission (FEC)

Position Description:
The Technical Lead will be responsible for guiding the technical direction of the contractor team, ensuring the successful implementation, maintenance, and enhancement of the Federal Election Commission (FEC) applications and systems. The Technical Lead will oversee technical operations, provide expertise in relevant technologies, and ensure compliance with security, accessibility, and performance standards.

Tasks:
1. Technical Oversight:
- Lead the technical team in the operation, maintenance, and updates of FEC applications and systems
- Ensure all applications are up-to-date with software and security patches
- Provide technical guidance for database migrations, including Amazon RDS to Amazon Aurora PostgreSQL

2. Application Support and Maintenance:
- Oversee the support and maintenance of Searchable Legal Applications, Disclosure Applications, and Reports Analysis (RAD) Modules
- Troubleshoot and resolve data anomalies and critical/high-security tickets
- Ensure compliance with legislative, regulatory, and policy changes

3. Quality Assurance:
- Develop and oversee software test plans, testing, and test results
- Ensure production release management and procedures are strictly followed
- Conduct peer code reviews and ensure adherence to QASP standards

4. Technical Documentation:
- Maintain detailed documentation of software functionality, dependencies, system diagrams, database structures, and team practices
- Ensure all documentation is stored in Confluence and accessible to the COR and FEC Deputy CIO of Enterprise Architecture

5. Collaboration and Knowledge Transfer:
- Work with other teams to troubleshoot issues and ensure seamless integration of systems
- Provide knowledge transfer, technical coaching, and advice to FEC technical staff

6. Informatica Administration:
- Patch and upgrade Informatica servers
- Maintain, modify, and create new mappings for the agency's Informatica tool

Education:
- Minimum: Bachelor's degree in Computer Science, Information Technology, Software Engineering, or a related field
- Preferred: Master's degree in Information Technology, Software Engineering, or a related field

Years of Experience:
- Minimum: 5 years of experience in technical leadership roles, including application development and system maintenance
- Preferred: 7-10 years of experience in managing complex IT systems, including cloud-based environments and database management

Security Clearance:
- Must be legally eligible to work in the United States
- Must meet the standards of Homeland Security Presidential Directive 12 (HSPD-12)
- May require a National Agency Check Inquiry (NACI) or equivalent U.S. Government background investigation

Certifications Required:
- AWS Certified Solutions Architect or AWS Certified Developer
- Oracle Certified Professional (OCP) or PostgreSQL certification
- Informatica Certified Professional

Certifications Preferred:
- Certified Information Systems Security Professional (CISSP) or Security+
- ITIL Foundation Certification
- Certified Scrum Master (CSM) or Agile Certified Practitioner (PMI-ACP)

Technical Skills Required:
- Proficiency in Java, Apache Tomcat, Spring Framework, Angular, .NET, SQL development, Oracle, PostgreSQL, Informatica, Crystal Reports, SecDevOps, Shell Scripts, and AWS
- Expertise in software testing, performance optimization, and release management
- Strong understanding of database management and cloud-based systems

Technical Skills Preferred:
- Experience with Jira for tracking work and prioritizing tickets
- Familiarity with OWASP Application Security Verification Standards`,
  },
};

type InputPanelProps = {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  selectedTemplate: TemplateKey;
  onTemplateChange: (template: TemplateKey) => void;
  jobDescriptionFile: File | null;
  onJobDescriptionFileChange: (file: File | null) => void;
  resumes: File[];
  onResumesChange: (files: File[]) => void;
  uploadMode: "single" | "batch";
  onUploadModeChange: (mode: "single" | "batch") => void;
  isPending: boolean;
  error: string;
  onSubmit: () => void;
};

export function InputPanel({
  jobDescription,
  onJobDescriptionChange,
  selectedTemplate,
  onTemplateChange,
  jobDescriptionFile,
  onJobDescriptionFileChange,
  resumes,
  onResumesChange,
  uploadMode,
  onUploadModeChange,
  isPending,
  error,
  onSubmit,
}: InputPanelProps) {
  function handleTemplateChange(template: TemplateKey) {
    onTemplateChange(template);
    onJobDescriptionChange(JD_TEMPLATES[template].value);
  }

  function removeResume(targetName: string) {
    onResumesChange(resumes.filter((file) => file.name !== targetName));
  }

  function handleResumeFilesSelected(files: File[]) {
    if (uploadMode === "single") {
      onResumesChange(files.slice(0, 1));
    } else {
      // Append new files, avoiding duplicates
      const existingNames = new Set(resumes.map((f) => f.name));
      const newFiles = files.filter((f) => !existingNames.has(f.name));
      onResumesChange([...resumes, ...newFiles]);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="panel panel-form" onSubmit={handleSubmit}>
      <div className="panel-header">
        <p className="eyebrow">Input</p>
        <h2>Upload the role and all candidate resumes in one place</h2>
      </div>

      <label className="field">
        <span>Job description template</span>
        <select
          className="select-field"
          value={selectedTemplate}
          onChange={(event) =>
            handleTemplateChange(event.target.value as TemplateKey)
          }
        >
          {Object.entries(JD_TEMPLATES).map(([key, template]) => (
            <option key={key} value={key}>
              {template.label}
            </option>
          ))}
        </select>
        <small>Select a prebuilt JD and edit it as needed for the open role.</small>
      </label>

      <label className="field">
        <span>Job description</span>
        <textarea
          value={jobDescription}
          onChange={(event) => onJobDescriptionChange(event.target.value)}
          placeholder="Paste the JD here or upload a JD file below."
          rows={10}
        />
      </label>

      <div className="field">
        <span>Optional JD file</span>
        <DropZone
          accept=".pdf,.docx,.txt"
          multiple={false}
          onFilesSelected={(files) => onJobDescriptionFileChange(files[0] ?? null)}
          hint="PDF, DOCX, or TXT (max 10MB)"
          compact
        />
        {jobDescriptionFile && (
          <FileList
            files={[jobDescriptionFile]}
            onRemove={() => onJobDescriptionFileChange(null)}
          />
        )}
      </div>

      <div className="field">
        <span>Resume upload mode</span>
        <div className="segmented-control">
          <button
            type="button"
            className={uploadMode === "single" ? "segment active" : "segment"}
            onClick={() => onUploadModeChange("single")}
          >
            One candidate
          </button>
          <button
            type="button"
            className={uploadMode === "batch" ? "segment active" : "segment"}
            onClick={() => onUploadModeChange("batch")}
          >
            Multiple candidates
          </button>
        </div>
        <small>
          Choose one resume for single-candidate review or switch to batch mode
          for bulk ranking.
        </small>
      </div>

      <div className="field">
        <span>Candidate resumes</span>
        <DropZone
          accept=".pdf,.docx,.txt"
          multiple={uploadMode === "batch"}
          maxFiles={uploadMode === "batch" ? 50 : 1}
          onFilesSelected={handleResumeFilesSelected}
          hint={
            uploadMode === "single"
              ? "Select one resume (PDF, DOCX, or TXT)"
              : "Select one or many resumes (max 50 files)"
          }
        />
        <FileList files={resumes} onRemove={removeResume} />
        {resumes.length > 0 && (
          <small style={{ marginTop: 8 }}>
            {resumes.length} file(s) selected
          </small>
        )}
      </div>

      <button className="primary-button" disabled={isPending}>
        {isPending ? "Evaluating candidates..." : "Rank candidates"}
      </button>

      {error && <p className="error-text">{error}</p>}
    </form>
  );
}
