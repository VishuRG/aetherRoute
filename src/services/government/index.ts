// Government & Civic Portal Service — CPGRAMS, MCD 311, and Delhi Traffic Police grievance integration

import { ECO_CONFIG, getServiceStatus, ServiceDataStatus } from "@/services/config";

export interface CivicComplaintDraft {
  category: string;
  portalName: string;
  portalUrl: string;
  department: string;
  subject: string;
  formattedBody: string;
  referenceNo: string;
  status: "draft" | "user_approved" | "submitted" | "acknowledged";
  dataStatus: ServiceDataStatus;
}

export function generateCivicComplaint(
  category: string,
  title: string,
  description: string,
  address: string,
  reporterName = "Concerned Citizen"
): CivicComplaintDraft {
  const refNo = `CPG-${Date.now().toString().slice(-8)}`;

  let portalName = "CPGRAMS (Centralized Public Grievance Redress System)";
  let portalUrl = "https://pgportal.gov.in";
  let department = "Public Works Department (PWD), Govt. of NCT of Delhi";

  if (category.toLowerCase().includes("signal") || category.toLowerCase().includes("traffic")) {
    department = "Delhi Traffic Police Grievance Cell";
    portalName = "Delhi Traffic Police Online Portal";
    portalUrl = "https://delhitrafficpolice.nic.in";
  } else if (category.toLowerCase().includes("street light") || category.toLowerCase().includes("waterlogging")) {
    department = "Municipal Corporation of Delhi (MCD)";
    portalName = "MCD 311 Grievance Portal";
    portalUrl = "https://mcdonline.nic.in";
  }

  const formattedBody = `To,
The Grievance Officer,
${department}

SUBJECT: Civic Issue Report — ${title} at ${address}

Dear Sir/Madam,

I am writing to bring to your urgent attention a civic concern regarding "${title}" observed at the location: ${address}.

DETAILS:
${description}

Location: ${address}
Date Reported: ${new Date().toLocaleDateString("en-IN")}
Report Ref: ${refNo}

This issue presents a safety risk to commuters, pedestrians, and public transit operations in Delhi-NCR. We kindly request the competent authority to inspect and take appropriate corrective measures at the earliest.

Yours sincerely,
${reporterName}
(Drafted via EcoRoute Civic Integration Hub — Pending User Manual Submission)`;

  const dataStatus = getServiceStatus("GOV_API_KEY", true);

  return {
    category,
    portalName,
    portalUrl,
    department,
    subject: `Civic Issue: ${title} - ${address}`,
    formattedBody,
    referenceNo: refNo,
    status: "draft",
    dataStatus,
  };
}
