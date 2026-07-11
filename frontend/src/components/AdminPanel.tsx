import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";

// High-fidelity style-sheet sanitization helper for html2canvas
// This ensures that modern CSS color formats (like oklch in Tailwind CSS v4) 
// are temporarily sanitized during the PDF capture phase, avoiding crashes.
const safeHtml2Canvas = async (element: HTMLElement, options: any): Promise<HTMLCanvasElement> => {
  const tempStyleElements: HTMLStyleElement[] = [];
  const disabledOriginalElements: (HTMLStyleElement | HTMLLinkElement)[] = [];

  try {
    const styleElements = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    
    for (const el of styleElements) {
      try {
        let cssText = "";
        if (el.tagName.toLowerCase() === 'style') {
          cssText = el.textContent || "";
        } else if (el.tagName.toLowerCase() === 'link') {
          const href = (el as HTMLLinkElement).href;
          if (href && href.startsWith(window.location.origin)) {
            const res = await fetch(href);
            if (res.ok) {
              cssText = await res.text();
            }
          }
        }
        
        if (cssText && cssText.includes("oklch")) {
          const sanitizedCss = cssText.replace(/oklch\([^)]+\)/g, (match) => {
            if (match.includes("/")) {
              const parts = match.split("/");
              const opacity = parts[1].replace(/\)/g, "").trim();
              return `rgba(79, 70, 229, ${opacity})`;
            }
            return '#4f46e5'; // Standard fallback Indigo-600
          });
          
          const tempStyle = document.createElement('style');
          tempStyle.setAttribute('data-html2canvas-temp', 'true');
          tempStyle.textContent = sanitizedCss;
          document.head.appendChild(tempStyle);
          tempStyleElements.push(tempStyle);
          
          if (el.tagName.toLowerCase() === 'style') {
            (el as HTMLStyleElement).disabled = true;
          } else {
            (el as HTMLLinkElement).disabled = true;
          }
          disabledOriginalElements.push(el as HTMLStyleElement | HTMLLinkElement);
        }
      } catch (err) {
        console.warn("Could not sanitize stylesheet:", el, err);
      }
    }

    return await html2canvas(element, options);
  } finally {
    // Restore all original styles
    tempStyleElements.forEach(el => el.remove());
    disabledOriginalElements.forEach(el => {
      el.disabled = false;
    });
  }
};

import jsPDF from "jspdf";

const getPdfBase64 = (pdf: jsPDF): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const blob = pdf.output("blob");
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (err) => {
        reject(err);
      };
    } catch (e) {
      reject(e);
    }
  });
};

import { 
  Award, 
  Download, 
  Send, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  FileText, 
  User as UserIcon, 
  Check, 
  Upload, 
  Sparkles, 
  Edit, 
  Eye, 
  Clock,
  Shield,
  Layers,
  Search,
  Mail,
  Settings,
  Share2,
  Palette
} from "lucide-react";
import { User, Template, TemplateCategory } from "../types";

interface AdminPanelProps {
  user: User | null;
  templates: Template[];
  onDeleteTemplate: (id: string) => void;
  onSelectTemplate: (template: Template) => void;
  onCreateBlankTemplate?: (category: TemplateCategory) => void;
}

interface CertificateRecord {
  id: string;
  fullName: string;
  courseDomain: string;
  batch: string;
  duration: string;
  whatsAppNumber: string;
  email: string;
  createdAt: string;
}

interface CertificateConfig {
  header: string;
  title: string;
  subHeader: string;
  studiesDirectorName: string;
  studiesDirectorTitle: string;
  leadInstructorName: string;
  leadInstructorTitle: string;
  sealText: string;
  bodyTemplate: string;
  accentColor: string;
  backgroundColor: string;
}

export default function AdminPanel({ 
  user, 
  templates, 
  onDeleteTemplate,
  onSelectTemplate,
  onCreateBlankTemplate
}: AdminPanelProps) {
  // Guard access
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-6 border border-rose-100">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-black text-slate-800">Access Denied</h2>
        <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
          The requested section is reserved for verified administrators only. Please sign in with an administrator credential to continue.
        </p>
      </div>
    );
  }

  // Sub-tab selection: 'certificates' | 'templates'
  const [activeTab, setActiveTab] = useState<"certificates" | "templates">("certificates");

  // Loading / processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  // Customizable Certificate Signatures & Titles
  const [certConfig, setCertConfig] = useState<CertificateConfig>(() => {
    const saved = localStorage.getItem("admin_cert_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      header: "🏆 Certificate of Completion",
      title: "IN RECOGNITION OF MASTERING",
      subHeader: "This high honor is proudly conferred to",
      studiesDirectorName: "Robert Harrison",
      studiesDirectorTitle: "Director of Studies",
      leadInstructorName: "Sarah Jenkins",
      leadInstructorTitle: "Lead Instructor",
      sealText: "SEAL",
      accentColor: "#B8860B",
      backgroundColor: "#FAF6F0",
      bodyTemplate: "for demonstrating expert proficiency and successfully completing the curriculum in {courseDomain}, executed in high standing during the period {duration} under Batch {batch}."
    };
  });

  const saveCertConfig = (newConfig: CertificateConfig) => {
    setCertConfig(newConfig);
    localStorage.setItem("admin_cert_config", JSON.stringify(newConfig));
  };

  // Certificate Generator States
  const [records, setRecords] = useState<CertificateRecord[]>([]);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  
  // Custom non-blocking Toast and Confirm states
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  const triggerConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ message, onConfirm });
  };

  // Auto-clear Toast notifications
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  const [searchQuery, setSearchQuery] = useState("");

  // Single record form inputs
  const [fullName, setFullName] = useState("");
  const [courseDomain, setCourseDomain] = useState("");
  const [batch, setBatch] = useState("");
  const [duration, setDuration] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Bulk Import State
  const [bulkText, setBulkText] = useState("");
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Live preview record reference (can be a temporary state or selected item)
  const [previewRecord, setPreviewRecord] = useState<Partial<CertificateRecord>>({
    fullName: "Rajesh Kumar",
    courseDomain: "Full-Stack Web Development Mastery",
    batch: "Batch 2026-Alpha",
    duration: "January 2026 – March 2026 (3 Months)",
    email: "rajesh.kumar@example.com"
  });

  // Load and save certificate records to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("admin_certificates");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRecords(parsed);
      } catch (e) {
        console.error("Failed to parse saved certificates", e);
      }
    } else {
      // Default seed data
      const defaultSeeds: CertificateRecord[] = [
        {
          id: "cert-1",
          fullName: "Aarav Sharma",
          courseDomain: "Advanced UI/UX Engineering",
          batch: "Batch UX-12",
          duration: "3 Months (Winter 2026)",
          whatsAppNumber: "+919876543210",
          email: "aarav.sharma@example.com",
          createdAt: new Date().toISOString()
        },
        {
          id: "cert-2",
          fullName: "Ananya Iyer",
          courseDomain: "Generative AI Integration Specialist",
          batch: "Batch AI-09",
          duration: "2 Months (Feb - Mar 2026)",
          whatsAppNumber: "+919999988888",
          email: "ananya.iyer@example.com",
          createdAt: new Date().toISOString()
        }
      ];
      setRecords(defaultSeeds);
      localStorage.setItem("admin_certificates", JSON.stringify(defaultSeeds));
    }
  }, []);

  const saveRecords = (newRecords: CertificateRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem("admin_certificates", JSON.stringify(newRecords));
  };

  // Live Sync form changes into preview
  useEffect(() => {
    if (editingId) {
      setPreviewRecord({
        fullName: fullName || "Full Name",
        courseDomain: courseDomain || "Course / Domain",
        batch: batch || "Batch",
        duration: duration || "Duration",
        email: email || "email@example.com"
      });
    } else {
      setPreviewRecord({
        fullName: fullName || "Rajesh Kumar",
        courseDomain: courseDomain || "Full-Stack Web Development Mastery",
        batch: batch || "Batch 2026-Alpha",
        duration: duration || "January 2026 – March 2026 (3 Months)",
        email: email || "rajesh.kumar@example.com"
      });
    }
  }, [fullName, courseDomain, batch, duration, email, editingId]);

  // Handle Form Submission (Add or Update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !courseDomain || !batch || !duration) {
      triggerToast("Please fill in all core certificate details.", "error");
      return;
    }

    if (editingId) {
      // Update existing record
      const updated = records.map(r => r.id === editingId ? {
        ...r,
        fullName,
        courseDomain,
        batch,
        duration,
        whatsAppNumber,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, "")}@example.com`
      } : r);
      saveRecords(updated);
      setEditingId(null);
      triggerToast("Certificate record updated successfully.", "success");
    } else {
      // Create new record
      const newCert: CertificateRecord = {
        id: `cert-${Date.now()}`,
        fullName,
        courseDomain,
        batch,
        duration,
        whatsAppNumber: whatsAppNumber || "+910000000000",
        email: email || `${fullName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        createdAt: new Date().toISOString()
      };
      saveRecords([newCert, ...records]);
      triggerToast("New certificate record created successfully.", "success");
    }

    // Reset inputs
    setFullName("");
    setCourseDomain("");
    setBatch("");
    setDuration("");
    setWhatsAppNumber("");
    setEmail("");
  };

  // Edit record
  const handleEdit = (record: CertificateRecord) => {
    setEditingId(record.id);
    setFullName(record.fullName);
    setCourseDomain(record.courseDomain);
    setBatch(record.batch);
    setDuration(record.duration);
    setWhatsAppNumber(record.whatsAppNumber);
    setEmail(record.email || "");
    setPreviewRecord({
      fullName: record.fullName,
      courseDomain: record.courseDomain,
      batch: record.batch,
      duration: record.duration,
      email: record.email || ""
    });
  };

  // Delete record
  const handleDelete = (id: string) => {
    triggerConfirm("Are you sure you want to delete this certificate record?", () => {
      const filtered = records.filter(r => r.id !== id);
      saveRecords(filtered);
      setSelectedRecordIds(selectedRecordIds.filter(sid => sid !== id));
      triggerToast("Certificate record deleted successfully.", "success");
    });
  };

  // Checkbox Selection
  const handleToggleSelectAll = () => {
    if (selectedRecordIds.length === filteredRecords.length) {
      setSelectedRecordIds([]);
    } else {
      setSelectedRecordIds(filteredRecords.map(r => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedRecordIds.includes(id)) {
      setSelectedRecordIds(selectedRecordIds.filter(sid => sid !== id));
    } else {
      setSelectedRecordIds([...selectedRecordIds, id]);
    }
  };

  // Filtered records based on search
  const filteredRecords = records.filter(r => 
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.courseDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Bulk CSV Import
  const handleBulkImport = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText.split("\n");
    const newRecords: CertificateRecord[] = [];
    
    // Parse lines (expects comma or tab separation)
    lines.forEach((line, index) => {
      // Skip empty header rows if they contain standard keys
      if (index === 0 && (line.toLowerCase().includes("full name") || line.toLowerCase().includes("fullname"))) {
        return;
      }

      if (!line.trim()) return;

      const cols = line.split(/[,\t]/);
      if (cols.length >= 4) {
        const parsedName = cols[0]?.trim() || "Full Name";
        newRecords.push({
          id: `cert-${Date.now()}-${index}`,
          fullName: parsedName,
          courseDomain: cols[1]?.trim() || "Course Name",
          batch: cols[2]?.trim() || "Batch ID",
          duration: cols[3]?.trim() || "Duration",
          whatsAppNumber: cols[4]?.trim() || "+910000000000",
          email: cols[5]?.trim() || `${parsedName.toLowerCase().replace(/\s+/g, "")}@example.com`,
          createdAt: new Date().toISOString()
        });
      }
    });

    if (newRecords.length > 0) {
      saveRecords([...newRecords, ...records]);
      triggerToast(`Successfully imported ${newRecords.length} certificates!`, "success");
      setBulkText("");
      setShowBulkModal(false);
    } else {
      triggerToast("Invalid format. Please make sure to have columns: Full Name, Course Name, Batch, Duration, WhatsApp Number (optional), and Email (optional).", "error");
    }
  };

  // Direct PDF compilation & upload helper (Returns public URL)
  const generateAndUploadPDF = async (record: Partial<CertificateRecord>): Promise<string> => {
    // Set previewRecord temporarily to trigger hidden element update
    setPreviewRecord(record);
    
    // Give react time to render the hidden DOM element
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const element = document.getElementById("certificate-pdf-capture");
    if (!element) {
      throw new Error("PDF Capture Container not found in DOM.");
    }
    
    const canvas = await safeHtml2Canvas(element, {
      scale: 2, // High-fidelity capture
      useCORS: true,
      backgroundColor: null
    });
    
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "letter"
    });
    
    // Letter Landscape dimensions
    pdf.addImage(imgData, "PNG", 0, 0, 279.4, 215.9);
    const pdfBase64 = await getPdfBase64(pdf);
    const fileName = `certificate_${(record.fullName || "recipient").toLowerCase().replace(/\s+/g, "_")}.pdf`;
    
    const res = await fetch("/api/upload-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName, pdfBase64 })
    });
    
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Failed to save PDF on server.");
    }
    
    const data = await res.json();
    if (data.url && (data.url.startsWith("http://") || data.url.startsWith("https://"))) {
      return data.url;
    }
    return `${window.location.origin}${data.url}`;
  };

  // Download PDF / Printing helper (Letter landscape size 11 x 8.5 in)
  const handlePrintCertificate = (cert: Partial<CertificateRecord>) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      triggerToast("Please allow popups to download/print certificates.", "info");
      return;
    }

    const bodyText = certConfig.bodyTemplate
      .replace("{courseDomain}", cert.courseDomain || "Course Name")
      .replace("{duration}", cert.duration || "Duration")
      .replace("{batch}", cert.batch || "Batch ID");

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${cert.fullName}</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: letter landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', sans-serif;
              background-color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              -webkit-print-color-adjust: exact;
            }
            .certificate-container {
              width: 1056px;
              height: 816px;
              box-sizing: border-box;
              padding: 80px;
              background-color: ${certConfig.backgroundColor};
              border: 24px solid #ffffff;
              box-shadow: inset 0 0 0 3px ${certConfig.accentColor};
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              text-align: center;
            }
            .certificate-border-thin {
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 1px solid ${certConfig.accentColor}4D;
              pointer-events: none;
            }
            .header-title {
              font-family: 'Playfair Display', serif;
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 6px;
              color: ${certConfig.accentColor};
              margin-top: 20px;
            }
            .main-title {
              font-family: 'Playfair Display', serif;
              font-size: 42px;
              font-weight: 800;
              color: #111111;
              letter-spacing: 2px;
              margin-top: 10px;
              margin-bottom: 0px;
            }
            .sub-title {
              font-family: 'Playfair Display', serif;
              font-style: italic;
              font-size: 18px;
              color: #666666;
              margin-top: 15px;
            }
            .recipient-name {
              font-family: 'Playfair Display', serif;
              font-size: 46px;
              font-weight: 800;
              color: #1E293B;
              border-bottom: 2px solid ${certConfig.accentColor};
              padding-bottom: 8px;
              min-width: 450px;
              margin: 20px auto;
              letter-spacing: 1px;
            }
            .achievement-text {
              font-size: 14px;
              line-height: 1.8;
              color: #4A5568;
              max-width: 680px;
              margin: 10px auto;
            }
            .achievement-text strong {
              color: #111111;
              font-weight: 700;
            }
            .footer-info {
              display: flex;
              width: 100%;
              justify-content: space-between;
              padding: 0 40px;
              margin-top: 40px;
              box-sizing: border-box;
            }
            .signature-block {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 200px;
            }
            .signature-line {
              width: 100%;
              border-top: 1px solid #A0AEC0;
              margin-top: 30px;
              padding-top: 8px;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #718096;
            }
            .signature-handwritten {
              font-family: 'Playfair Display', serif;
              font-style: italic;
              font-size: 20px;
              color: #2D3748;
              margin-bottom: -15px;
            }
            .seal-gold {
              width: 70px;
              height: 70px;
              background-color: ${certConfig.accentColor};
              border-radius: 50%;
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: bold;
              font-size: 10px;
              letter-spacing: 1px;
              box-shadow: 0 0 0 4px ${certConfig.backgroundColor}, 0 0 0 6px ${certConfig.accentColor};
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="certificate-border-thin"></div>
            
            <div>
              <div class="header-title">${certConfig.header}</div>
              <div class="main-title">${certConfig.title}</div>
            </div>

            <div>
              <div class="sub-title">${certConfig.subHeader}</div>
              <div class="recipient-name">${cert.fullName}</div>
              <div class="achievement-text">
                ${bodyText}
              </div>
            </div>

            <div class="footer-info">
              <div class="signature-block">
                <div class="signature-handwritten">${certConfig.studiesDirectorName}</div>
                <div class="signature-line">${certConfig.studiesDirectorTitle}</div>
              </div>

              <div style="display: flex; flex-direction: column; align-items: center;">
                <div class="seal-gold">${certConfig.sealText}</div>
              </div>

              <div class="signature-block">
                <div class="signature-handwritten">${certConfig.leadInstructorName}</div>
                <div class="signature-line">${certConfig.leadInstructorTitle}</div>
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Direct WhatsApp sending with compiled PDF URL (popup blocker safe)
  const handleSendWhatsApp = async (cert: CertificateRecord) => {
    // Open a blank tab synchronously to bypass browser popup blockers
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Preparing WhatsApp Share</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; color: #475569; margin: 0; }
              .loader { border: 4px solid #e2e8f0; border-top: 4px solid #10b981; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              h3 { margin: 0; font-size: 16px; color: #1e293b; }
              p { margin: 8px 0 0; font-size: 13px; color: #64748b; }
            </style>
          </head>
          <body>
            <div class="loader"></div>
            <h3>Generating Digital Certificate PDF</h3>
            <p>Please wait while we compile the high-fidelity document...</p>
          </body>
        </html>
      `);
    }

    setIsProcessing(true);
    setProcessingStatus(`Compiling certificate PDF for ${cert.fullName}...`);
    try {
      const pdfUrl = await generateAndUploadPDF(cert);
      const text = `Hello ${cert.fullName},\n\nCongratulations on successfully completing the course "${cert.courseDomain}"!\n\nYour official digital Certificate of Completion under Batch ${cert.batch} is ready. You can download/view your high-resolution PDF certificate directly from the link below:\n\n👉 ${pdfUrl}\n\nBest regards,\nVerified Academy Team`;
      
      const phone = cert.whatsAppNumber || "";
      const formattedPhone = phone.replace(/[^0-9+]/g, "");
      const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(formattedPhone)}&text=${encodeURIComponent(text)}`;
      
      if (newWindow) {
        newWindow.location.href = url;
      } else {
        window.open(url, "_blank");
      }
      triggerToast("Certificate PDF generated and loaded for WhatsApp dispatch!", "success");
    } catch (e: any) {
      console.error(e);
      if (newWindow) {
        newWindow.close();
      }
      triggerToast(`Failed to compile and share on WhatsApp: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  // Email PDF to recipient
  const handleSendEmail = async (cert: CertificateRecord) => {
    setIsProcessing(true);
    setProcessingStatus(`Generating and emailing PDF certificate to ${cert.email}...`);
    try {
      // Direct base64 PDF generation
      setPreviewRecord(cert);
      await new Promise(resolve => setTimeout(resolve, 150));

      const element = document.getElementById("certificate-pdf-capture");
      if (!element) throw new Error("Capture container not found");

      const canvas = await safeHtml2Canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
      pdf.addImage(imgData, "PNG", 0, 0, 279.4, 215.9);
      const pdfBase64 = await getPdfBase64(pdf);
      const fileName = `certificate_${cert.fullName.toLowerCase().replace(/\s+/g, "_")}.pdf`;

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: cert.email,
          subject: `Official Certificate of Completion - ${cert.fullName}`,
          body: `Dear ${cert.fullName},\n\nCongratulations on successfully completing the course "${cert.courseDomain}"!\n\nPlease find attached your official digital Certificate of Completion.\n\nBest regards,\nVerified Academy Team`,
          pdfBase64,
          fileName
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Email delivery failed");

      triggerToast(data.message, "success");
    } catch (e: any) {
      console.error(e);
      triggerToast(`Email dispatch failed: ${e.message}`, "error");
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  // Bulk WhatsApp dispatcher
  const handleBulkWhatsApp = async () => {
    const toSend = selectedRecordIds.length > 0 
      ? records.filter(r => selectedRecordIds.includes(r.id))
      : records;
      
    if (toSend.length === 0) {
      triggerToast("Please select at least one certificate from the table or add records.", "error");
      return;
    }

    triggerConfirm(`You are about to compile and dispatch ${toSend.length} PDF certificates over WhatsApp. Proceed?`, async () => {
      setIsProcessing(true);
      for (let i = 0; i < toSend.length; i++) {
        const cert = toSend[i];
        setProcessingStatus(`Compiling and dispatching ${i + 1} of ${toSend.length}: ${cert.fullName}...`);
        
        // Open a blank tab synchronously
        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>Preparing WhatsApp Share</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc; color: #475569; margin: 0; }
                  .loader { border: 4px solid #e2e8f0; border-top: 4px solid #10b981; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
                  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                  h3 { margin: 0; font-size: 16px; color: #1e293b; }
                  p { margin: 8px 0 0; font-size: 13px; color: #64748b; }
                </style>
              </head>
              <body>
                <div class="loader"></div>
                <h3>Generating Bulk Certificate PDF</h3>
                <p>Compiling document for ${cert.fullName}...</p>
              </body>
            </html>
          `);
        }

        try {
          const pdfUrl = await generateAndUploadPDF(cert);
          const text = `Hello ${cert.fullName},\n\nCongratulations on successfully completing "${cert.courseDomain}"!\n\nYour official digital Certificate of Completion is ready. Download your high-resolution PDF certificate directly here:\n👉 ${pdfUrl}\n\nBest regards,\nVerified Academy Team`;
          
          const phone = cert.whatsAppNumber || "";
          const formattedPhone = phone.replace(/[^0-9+]/g, "");
          const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(formattedPhone)}&text=${encodeURIComponent(text)}`;
          
          if (newWindow) {
            newWindow.location.href = url;
          } else {
            window.open(url, "_blank");
          }
          // Stagger to avoid browser popup limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e: any) {
          console.error(`Error processing WhatsApp for ${cert.fullName}:`, e);
          if (newWindow) {
            newWindow.close();
          }
        }
      }
      setIsProcessing(false);
      setProcessingStatus("");
      triggerToast("Bulk WhatsApp dispatch complete!", "success");
    });
  };

  // Bulk Email dispatcher
  const handleBulkEmail = async () => {
    const toSend = selectedRecordIds.length > 0 
      ? records.filter(r => selectedRecordIds.includes(r.id))
      : records;
      
    if (toSend.length === 0) {
      triggerToast("Please select at least one certificate from the table.", "error");
      return;
    }

    triggerConfirm(`You are about to compile and email ${toSend.length} PDF certificates. Proceed?`, async () => {
      setIsProcessing(true);
      let successCount = 0;
      let mockCount = 0;

      for (let i = 0; i < toSend.length; i++) {
        const cert = toSend[i];
        setProcessingStatus(`Compiling and mailing ${i + 1} of ${toSend.length}: ${cert.fullName}...`);
        try {
          setPreviewRecord(cert);
          await new Promise(resolve => setTimeout(resolve, 150));

          const element = document.getElementById("certificate-pdf-capture");
          if (!element) throw new Error("Capture container not found");

          const canvas = await safeHtml2Canvas(element, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "letter" });
          pdf.addImage(imgData, "PNG", 0, 0, 279.4, 215.9);
          const pdfBase64 = await getPdfBase64(pdf);
          const fileName = `certificate_${cert.fullName.toLowerCase().replace(/\s+/g, "_")}.pdf`;

          const res = await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: cert.email,
              subject: `Official Certificate of Completion - ${cert.fullName}`,
              body: `Dear ${cert.fullName},\n\nCongratulations on successfully completing the course "${cert.courseDomain}"!\n\nPlease find attached your official digital Certificate of Completion.\n\nBest regards,\nVerified Academy Team`,
              pdfBase64,
              fileName
            })
          });

          const data = await res.json();
          if (res.ok) {
            if (data.smtpConfigured) {
              successCount++;
            } else {
              mockCount++;
            }
          }
        } catch (e: any) {
          console.error(`Error emailing ${cert.fullName}:`, e);
        }
      }
      setIsProcessing(false);
      setProcessingStatus("");
      
      if (successCount > 0 || mockCount > 0) {
        triggerToast(`Bulk dispatch complete! Sent real emails: ${successCount}. Drafts simulated: ${mockCount}`, "success");
      }
    });
  };

  // Bulk PDF printer
  const handleBulkPrint = () => {
    if (selectedRecordIds.length === 0) {
      triggerToast("Please select at least one certificate from the table.", "error");
      return;
    }
    const toPrint = records.filter(r => selectedRecordIds.includes(r.id));
    toPrint.forEach((cert, idx) => {
      setTimeout(() => {
        handlePrintCertificate(cert);
      }, idx * 1200);
    });
  };

  // Export selected data to CSV (Includes Email column)
  const handleExportCSV = () => {
    const toExport = selectedRecordIds.length > 0 
      ? records.filter(r => selectedRecordIds.includes(r.id))
      : records;

    const headers = ["ID", "Full Name", "Course / Domain", "Batch", "Duration", "WhatsApp Number", "Email Address", "Created At"];
    const csvRows = [
      headers.join(","),
      ...toExport.map(r => [
        `"${r.id}"`,
        `"${r.fullName.replace(/"/g, '""')}"`,
        `"${r.courseDomain.replace(/"/g, '""')}"`,
        `"${r.batch.replace(/"/g, '""')}"`,
        `"${r.duration.replace(/"/g, '""')}"`,
        `"${r.whatsAppNumber.replace(/"/g, '""')}"`,
        `"${r.email.replace(/"/g, '""')}"`,
        `"${r.createdAt}"`
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `Certificates_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-portal-view" className="py-12 bg-slate-50 min-h-screen relative">
      
      {/* High-fidelity Glassmorphic Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200/50 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="font-display font-black text-slate-800 text-sm">Processing Batch</h3>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100 w-full word-break">
              {processingStatus || "Compiling documents..."}
            </p>
          </div>
        </div>
      )}

      {/* Off-screen high-fidelity PDF capture canvas wrapper */}
      <div 
        style={{
          position: "fixed",
          left: "0px",
          top: "0px",
          width: "0px",
          height: "0px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -100
        }}
      >
        <div 
          id="certificate-pdf-capture"
          style={{
            width: "1056px",
            height: "816px",
            backgroundColor: certConfig.backgroundColor,
            border: `24px solid #ffffff`,
            boxShadow: `inset 0 0 0 3px ${certConfig.accentColor}`,
            fontFamily: "'Inter', sans-serif"
          }}
          className="p-16 relative flex flex-col justify-between items-center text-center box-border"
        >
        {/* Decorative Borders */}
        <div 
          className="absolute top-5 left-5 right-5 bottom-5 border pointer-events-none rounded-2xl"
          style={{ borderColor: `${certConfig.accentColor}4D` }}
        ></div>
        <div 
          className="absolute top-7 left-7 right-7 bottom-7 border pointer-events-none"
          style={{ borderColor: `${certConfig.accentColor}1A` }}
        ></div>

        <div>
          <span 
            className="text-xs tracking-widest font-mono font-black uppercase block mb-1"
            style={{ color: certConfig.accentColor }}
          >
            {certConfig.header}
          </span>
          <h2 
            className="font-display text-4xl font-black tracking-tight uppercase"
            style={{ color: "#0f172a" }}
          >
            {certConfig.title}
          </h2>
        </div>

        <div className="my-6">
          <p 
            className="font-serif italic text-base"
            style={{ color: "#64748b" }}
          >
            {certConfig.subHeader}
          </p>
          <h3 
            className="font-serif text-5xl font-black tracking-wide pb-2 max-w-xl mx-auto my-4"
            style={{ 
              color: "#1E293B",
              borderBottom: `2px solid ${certConfig.accentColor}`,
              minWidth: "450px"
            }}
          >
            {previewRecord.fullName}
          </h3>
          <p 
            className="text-sm leading-relaxed max-w-2xl mx-auto"
            style={{ color: "#64748b" }}
          >
            {certConfig.bodyTemplate
              .replace("{courseDomain}", previewRecord.courseDomain || "Course Name")
              .replace("{duration}", previewRecord.duration || "Duration")
              .replace("{batch}", previewRecord.batch || "Batch ID")}
          </p>
        </div>

        <div 
          className="w-full flex items-center justify-between px-12 mt-4 text-xs font-mono uppercase"
          style={{ color: "#94a3b8" }}
        >
          <div className="flex flex-col items-center w-48">
            <span 
              className="font-serif italic text-xl mb-0.5 font-medium"
              style={{ color: "#1e293b" }}
            >
              {certConfig.studiesDirectorName}
            </span>
            <span 
              className="pt-1 font-bold w-full text-[10px]"
              style={{ borderTop: "1px solid #cbd5e1", color: "#64748b" }}
            >
              {certConfig.studiesDirectorTitle}
            </span>
          </div>
          
          {/* Decorative Seal */}
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-[10px] text-white font-black tracking-widest uppercase shadow-md"
            style={{ 
              backgroundColor: certConfig.accentColor,
              border: `3px solid ${certConfig.backgroundColor}`
            }}
          >
            {certConfig.sealText}
          </div>

          <div className="flex flex-col items-center w-48">
            <span 
              className="font-serif italic text-xl mb-0.5 font-medium"
              style={{ color: "#1e293b" }}
            >
              {certConfig.leadInstructorName}
            </span>
            <span 
              className="pt-1 font-bold w-full text-[10px]"
              style={{ borderTop: "1px solid #cbd5e1", color: "#64748b" }}
            >
              {certConfig.leadInstructorTitle}
            </span>
          </div>
        </div>
      </div>
    </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full w-max">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified System Administrator Mode</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              System Admin Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add presets, customizer elements, audit security rules, and generate high-fidelity PDF certificates.
            </p>
          </div>

          {/* Tab toggles */}
          <div className="flex items-center gap-1.5 bg-slate-200/50 p-1 rounded-xl w-max">
            <button
              onClick={() => setActiveTab("certificates")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "certificates"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Certificate Generator</span>
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "templates"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Global Templates ({templates.length})</span>
            </button>
            {onCreateBlankTemplate && (
              <button
                onClick={() => onCreateBlankTemplate("document")}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 text-xs font-bold transition-all shadow-md ml-2"
                title="Create New Custom Certificate Template"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Custom Template</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: CERTIFICATE MODULE */}
        {activeTab === "certificates" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form & Styling Options Column */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              
              {/* Form Input fields */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-sm">
                    {editingId ? "Edit Participant Certificate" : "New Certificate Details"}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Course / Domain
                    </label>
                    <input
                      type="text"
                      required
                      value={courseDomain}
                      onChange={e => setCourseDomain(e.target.value)}
                      placeholder="e.g. Full-Stack Web Development"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        Batch
                      </label>
                      <input
                        type="text"
                        required
                        value={batch}
                        onChange={e => setBatch(e.target.value)}
                        placeholder="e.g. Batch 23-B"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        Duration / Period
                      </label>
                      <input
                        type="text"
                        required
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        placeholder="e.g. 3 Months"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={whatsAppNumber}
                        onChange={e => setWhatsAppNumber(e.target.value)}
                        placeholder="e.g. +919876543210"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. name@example.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingId ? "Save Changes" : "Add & Generate"}</span>
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFullName("");
                          setCourseDomain("");
                          setBatch("");
                          setDuration("");
                          setWhatsAppNumber("");
                          setEmail("");
                        }}
                        className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Certificate Template Customizer / Signature Editing Tools */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-sm">
                    Certificate Customizer & Design Tools
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Header Emblem / Text
                    </label>
                    <input
                      type="text"
                      value={certConfig.header}
                      onChange={e => saveCertConfig({ ...certConfig, header: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Certificate Main Heading
                    </label>
                    <input
                      type="text"
                      value={certConfig.title}
                      onChange={e => saveCertConfig({ ...certConfig, title: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Subheading / Conferred Text
                    </label>
                    <input
                      type="text"
                      value={certConfig.subHeader}
                      onChange={e => saveCertConfig({ ...certConfig, subHeader: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Studies Director
                      </label>
                      <input
                        type="text"
                        value={certConfig.studiesDirectorName}
                        onChange={e => saveCertConfig({ ...certConfig, studiesDirectorName: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Director Title
                      </label>
                      <input
                        type="text"
                        value={certConfig.studiesDirectorTitle}
                        onChange={e => saveCertConfig({ ...certConfig, studiesDirectorTitle: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Lead Instructor
                      </label>
                      <input
                        type="text"
                        value={certConfig.leadInstructorName}
                        onChange={e => saveCertConfig({ ...certConfig, leadInstructorName: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Instructor Title
                      </label>
                      <input
                        type="text"
                        value={certConfig.leadInstructorTitle}
                        onChange={e => saveCertConfig({ ...certConfig, leadInstructorTitle: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Seal Emblem Text
                      </label>
                      <input
                        type="text"
                        value={certConfig.sealText}
                        onChange={e => saveCertConfig({ ...certConfig, sealText: e.target.value })}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Accent Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={certConfig.accentColor}
                          onChange={e => saveCertConfig({ ...certConfig, accentColor: e.target.value })}
                          className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={certConfig.accentColor}
                          onChange={e => saveCertConfig({ ...certConfig, accentColor: e.target.value })}
                          className="flex-1 px-2 py-1 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Body Template
                    </label>
                    <textarea
                      rows={3}
                      value={certConfig.bodyTemplate}
                      onChange={e => saveCertConfig({ ...certConfig, bodyTemplate: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
                    />
                    <span className="text-[9px] text-slate-400 mt-1 block">
                      💡 Use: <span className="font-mono">{`{courseDomain}`}</span>, <span className="font-mono">{`{duration}`}</span>, and <span className="font-mono">{`{batch}`}</span>.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bulk import launcher banner */}
              <div className="bg-gradient-to-r from-indigo-500 to-slate-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                    Bulk Engine
                  </span>
                  <h3 className="font-display font-bold text-sm mt-2">Bulk Batch Generation</h3>
                  <p className="text-[10px] text-indigo-100 mt-1 leading-relaxed max-w-xs">
                    Paste raw text tables or comma separated CSV datasets to instantly create dozens of customized professional certificates.
                  </p>
                  <button
                    onClick={() => setShowBulkModal(true)}
                    className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Paste Bulk CSV</span>
                  </button>
                </div>
                <Award className="absolute -bottom-6 -right-6 w-24 h-24 text-white/5" />
              </div>

            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                  Live Certificate Design Preview (Editorial Theme)
                </h3>
                <button
                  type="button"
                  onClick={() => handlePrintCertificate(previewRecord)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all shadow-sm flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-slate-300" />
                  <span>Download PDF</span>
                </button>
              </div>

              {/* Live Preview Landscape Canvas Box */}
              <div 
                style={{ backgroundColor: certConfig.backgroundColor, borderColor: "#E2E8F0" }}
                className="border rounded-3xl overflow-hidden shadow-md p-10 relative flex flex-col justify-between items-center text-center aspect-[1.3/1] select-none"
              >
                
                {/* Thin custom margin borders */}
                <div 
                  style={{ borderColor: `${certConfig.accentColor}33` }}
                  className="absolute top-5 left-5 right-5 bottom-5 border rounded-2xl pointer-events-none"
                ></div>
                <div 
                  style={{ borderColor: `${certConfig.accentColor}12` }}
                  className="absolute top-7 left-7 right-7 bottom-7 border pointer-events-none"
                ></div>

                <div>
                  <span 
                    style={{ color: certConfig.accentColor }}
                    className="text-[9px] tracking-widest font-mono font-black uppercase"
                  >
                    {certConfig.header}
                  </span>
                  <h2 className="font-display text-2xl font-black text-slate-900 tracking-tight mt-1 uppercase">
                    {certConfig.title}
                  </h2>
                </div>

                <div>
                  <p className="font-serif italic text-xs text-slate-500 mt-4">
                    {certConfig.subHeader}
                  </p>
                  <h3 
                    style={{ borderColor: `${certConfig.accentColor}4D` }}
                    className="font-serif text-3xl font-black text-slate-800 tracking-wide border-b pb-1.5 max-w-sm mx-auto my-3"
                  >
                    {previewRecord.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto">
                    {certConfig.bodyTemplate
                      .replace("{courseDomain}", previewRecord.courseDomain || "Course Domain")
                      .replace("{duration}", previewRecord.duration || "Duration")
                      .replace("{batch}", previewRecord.batch || "Batch ID")}
                  </p>
                </div>

                <div className="w-full flex items-center justify-between px-8 mt-4 text-[9px] text-slate-400 font-mono uppercase">
                  <div className="flex flex-col items-center">
                    <span className="border-t border-slate-300/80 pt-1 text-slate-500 font-medium w-24 block truncate">
                      {certConfig.studiesDirectorName}
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5">{certConfig.studiesDirectorTitle}</span>
                  </div>
                  
                  {/* Miniature decorative seal */}
                  <div 
                    style={{ backgroundColor: certConfig.accentColor, borderColor: certConfig.backgroundColor }}
                    className="w-12 h-12 rounded-full border bg-opacity-10 flex items-center justify-center text-[8px] text-white font-black tracking-widest uppercase shadow-sm"
                  >
                    {certConfig.sealText}
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="border-t border-slate-300/80 pt-1 text-slate-500 font-medium w-24 block truncate">
                      {certConfig.leadInstructorName}
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5">{certConfig.leadInstructorTitle}</span>
                  </div>
                </div>

                {/* Duration Metadata */}
                <div className="mt-4">
                  <span className="text-[9px] text-slate-400 font-sans tracking-normal block">
                    Course duration: <span className="font-bold text-slate-600">{previewRecord.duration}</span> • Batch ID: <span className="font-bold text-slate-600">{previewRecord.batch}</span>
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 1 TABLE / DIRECTORY */}
        {activeTab === "certificates" && (
          <div className="bg-white border border-slate-200/80 rounded-3xl mt-10 shadow-sm overflow-hidden">
            
            {/* Table Header / Action rails */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-900 font-mono bg-slate-100 px-2.5 py-1 rounded-lg">
                  {filteredRecords.length} Records
                </span>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by participant name..."
                    className="pl-8 pr-4 py-1 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 w-48 sm:w-64 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Bulk dispatchers */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={handleBulkWhatsApp}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 transition-all shadow-sm"
                  title="Share PDFs via WhatsApp to selected recipients"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share WhatsApp ({selectedRecordIds.length})</span>
                </button>
                <button
                  onClick={handleBulkEmail}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 transition-all shadow-sm"
                  title="Email PDFs to selected recipients"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email PDFs ({selectedRecordIds.length})</span>
                </button>
                <button
                  onClick={handleBulkPrint}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDFs ({selectedRecordIds.length})</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 transition-all"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRecordIds.length === filteredRecords.length && filteredRecords.length > 0}
                        onChange={handleToggleSelectAll}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Recipient Name</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Course / Domain</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Batch ID</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Duration</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">WhatsApp</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map(cert => {
                      const isSelected = selectedRecordIds.includes(cert.id);
                      return (
                        <tr key={cert.id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? "bg-indigo-50/20" : ""}`}>
                          <td className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelect(cert.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="p-4 font-bold text-slate-900">{cert.fullName}</td>
                          <td className="p-4">{cert.courseDomain}</td>
                          <td className="p-4 font-mono font-medium text-indigo-600">{cert.batch}</td>
                          <td className="p-4">{cert.duration}</td>
                          <td className="p-4 font-mono text-slate-500">{cert.whatsAppNumber}</td>
                          <td className="p-4 font-mono text-slate-500">{cert.email}</td>
                          <td className="p-4 text-right flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleEdit(cert)}
                              title="Edit Details"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePrintCertificate(cert)}
                              title="Print Certificate Local"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendWhatsApp(cert)}
                              title="Compile PDF and Dispatch over WhatsApp"
                              className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSendEmail(cert)}
                              title="Compile PDF and Email to Recipient"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(cert.id)}
                              title="Delete Record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-12 text-center text-slate-400 font-sans">
                        <Award className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-700">No Certificates Found</h4>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                          Try searching for a different keyword or create a new certificate using the details panel above.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 2: GLOBAL TEMPLATES MANAGER */}
        {activeTab === "templates" && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-sm">
                  Active Global Templates Pool
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  View and clean existing system presets. Presets are loaded from `/src/defaultTemplates.ts`.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className="border border-slate-100 rounded-2xl p-4 hover:border-slate-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[9px] font-black uppercase rounded-full">
                        {template.category}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[9px] font-sans uppercase rounded-full">
                        {template.tier || "free"}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-xs text-slate-800 line-clamp-1">{template.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{template.description}</p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-50">
                    <span className="text-[9px] font-mono text-slate-400">
                      {template.elements.length} components
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onSelectTemplate(template)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold transition-all"
                      >
                        Launch
                      </button>
                      <button
                        onClick={() => onDeleteTemplate(template.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* BULK PASTE CSV MODAL */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                <h3 className="font-display font-bold text-sm text-slate-800">
                  Bulk Batch Import CSV Data
                </h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-800 font-extrabold focus:outline-none"
              >
                ✕
              </button>
            </div>

            <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">
              Format: <span className="font-mono bg-slate-100 px-1 rounded font-bold text-slate-700">Full Name, Course Name, Batch, Duration, WhatsApp Number, Email</span> (one participant per line). Commas or Tabs are supported.
            </p>

            <textarea
              rows={8}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
              placeholder={`Amit Sharma, Full-Stack Development, Batch A, 3 Months, +919999999999, amit@example.com\nPooja Verma, UI/UX Design, Batch B, 2 Months, +918888888888, pooja@example.com`}
              className="w-full border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Launch Import Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom High-fidelity Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-sm w-full bg-white border border-slate-200/80 shadow-2xl rounded-2xl p-4 flex items-start gap-3 animate-fade-in">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            toast.type === "success" ? "bg-green-50 text-green-600" :
            toast.type === "error" ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"
          }`}>
            {toast.type === "success" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {toast.type === "error" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {toast.type === "info" && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800">{toast.type === "success" ? "Success" : toast.type === "error" ? "Error" : "Information"}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 shrink-0 text-xs font-extrabold focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Custom High-fidelity Confirm Dialogue Overlay */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/50 p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-display font-black text-slate-800 text-sm">Please Confirm</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all focus:outline-none"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
