// Quick test script to verify skill extraction
const jd1 = `Job Title: Project Manager
Location: Remote
Client: Federal Election Commission (FEC)

Position Description: Project Manager: The Project Manager (PM) will serve as the primary liaison between the Federal Election Commission (FEC) and the contractor team, ensuring the successful execution of all contract requirements. The PM will oversee project planning, coordination, and delivery while managing contractor personnel and ensuring compliance with technical, security, and administrative standards.

Tasks:
1. Project Oversight:
- Supervise and manage all contractor personnel assigned to the project.
- Ensure timely delivery of all contract deliverables and adherence to project schedules.
- Monitor and report project progress through recurring status reports and meetings.
- Coordinate with the Contracting Officer Representative (COR) and business owners to address project needs and priorities.

2. Team Management:
- Assign tasks to team members and ensure efficient resource utilization.
- Conduct weekly and monthly meetings with the team and stakeholders.
- Maintain a Project Contact Directory and ensure regular updates.

3. Documentation and Reporting:
- Ensure all project documentation is accurate, up-to-date, and stored in Confluence.
- Submit meeting minutes, test plans, production delivery documentation, and change control documentation as required.
- Prepare and deliver disaster recovery plans and application documentation annually.

4. Quality Assurance:
- Ensure all deliverables meet the Quality Assurance Surveillance Plan (QASP) standards.
- Oversee testing, peer reviews, and compliance with security and accessibility standards.

5. Risk Management:
- Identify and mitigate risks to project timelines and deliverables.
- Notify the COR/CO of any potential delays and propose solutions.

6. Stakeholder Communication:
- Act as the primary point of contact for the FEC product team.
- Facilitate communication between the contractor team and FEC stakeholders.
- Provide regular updates and address concerns promptly.

Education:
Minimum Requirement: Bachelor's degree in Computer Science, Information Technology, Business Administration, or a related field.
Preferred: Master's degree in Project Management, Business Administration, or a related field.

Years of Experience:
Minimum Requirement: 5 years of experience in project management roles, preferably in IT or government contracts.
Preferred: 7-10 years of experience managing large-scale IT projects, including cloud-based systems and database migrations.

Security Clearance:
Legally eligible to work in the United States
May require a National Agency Check Inquiry (NACI) or equivalent U.S. Government background investigation.

Certifications:
Required:
- Project Management Professional (PMP) certification.
- ITIL Foundation Certification.
Preferred:
- Certified Scrum Master (CSM) or Agile Certified Practitioner (PMI-ACP).
- AWS Certified Solutions Architect or AWS Certified Cloud Practitioner.
- Security+ or CISSP (Certified Information Systems Security Professional).`;

const jd2 = `Job Title: Unified Communications Engineer
Location: Fort Meade MD (Hybrid work) (First Few months onsite)
Duration: Long Term
Clearance required: Secret Clearance or Higher
Certification required by project: CompTIA SEC+ or Willing to Obtain

Job Description:
CompQsoft is seeking a Lead Network Engineer to join our DISA program team in Fort Meade, MD. This is an exciting key position providing Gateway Engineering Support which provides end-to-end engineering solutions for DISN projects. The Gateway projects include all variants of DoD Enterprise Classified Travel Kit (DECTK) gateways, Senior National Leadership Communications (SNLC), Internet and cloud gateways, customer interface gateways, and Satellite Communications Gateways. The engineer must have a high level of knowledge and experience in the current and planned gateways in the DISN core and DISN customer gateways including unclassified and classified voice, video, data, endpoints, and encryption devices.

As a Lead Network Engineer, you will be responsible for engineering, testing, implementing, and providing Tier III support for all Gateway initiatives ensuring mission success.

Responsibilities (include, but not limited to):
• Design, build, test, implement and maintain Gateway engineering solutions.
• Design engineering enhancements, develop engineering change requests and provide all required documentation in support of Configuration Control Boards (CCB).
• Provide technical expertise in design review, lab testing & test report, implementation plan and deployment of new advanced large-scale complex DoD networks.
• Support mission partners to satisfy the interoperability requirements.
• Design architecture to include the software, hardware, and communications to support the total requirements as well as provide for present and future cross-functional requirements and interfaces.
• Evaluates analytically and systematically problems of workflows and network usage, organization and planning and develops appropriate corrective action.
• Analyze existing and planned gateway solutions and architectures and make recommendations.
• Configure various routers, switches, firewalls, voice gateways, unified communication managers.
• Utilize advanced security devices including High Assurance Internet Protocol Encryptor (HAIPE), crypto ignition keys and SIPRNet hard tokens.
• Apply system patches, security patches and third-party updates in order to maintain systems at a high level of performance, availability, and security.
• Develop detailed test plans, test reports, implementation plans, configuration guides and other technical documentation.
• Deliver timely resolution and document troubleshooting procedures in order to mitigate impact of issues and improve infrastructure performance.
• Perform incident response tasks and services restoration.
• Review security requirements set by DoD agencies for the NIPRNET network protection; assess and analyze current NIPRNET network architecture; propose and analyze potential solutions.
• Review security threats to the current DoD NIPRNet/Internet gateway IA infrastructure, architecture, and technology and determines/implements effective countermeasures IAW established policies, regulations, and directives.
• Provide support to the Automation Team.
• Provide on-call Tier III support as needed.

Experience/Qualifications:
• DoD and/or Government program experience preferred; DISA experience a plus.
• Strong routing protocols and IP network design experience to include: IPSEC, BGP, MPLS/RSVP, OSPF, IS-IS, Multicast, Layer-2/Layer-3 Virtual Private Network (VPN), Carrier servicing Carrier (CsC).
• Unified capabilities experience to include Cisco voice gateways, unified communication managers and SIP trunking.
• Experience with Type 1 HAIPE encryption devices, secure tokens, etc.
• Laboratory testing experience using tools such as Wireshark, Kiwi-Syslog, SNMP/Traps, for testing/troubleshooting network traffic.
• Working knowledge of Microsoft Office Tools; specifically, PowerPoint, Word & Excel
• Excellent communication (verbal and written), effective leadership, and interpersonal skills`;

console.log("JD1 - Project Manager:");
console.log("Length:", jd1.length, "chars");
console.log("\nJD2 - Unified Communications Engineer:");
console.log("Length:", jd2.length, "chars");
console.log("\nJDs are ready for testing in the app!");
