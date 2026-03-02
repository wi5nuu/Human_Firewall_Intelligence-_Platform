import jsPDF from 'jspdf';
import type { Participant, ScoreResult } from '@/types';

interface PDFReportData {
  participant: Participant;
  scoreResult: ScoreResult;
  generated_at: string;
  verification_code: string;
}

// ============================================
// PDF REPORT GENERATOR
// Human Firewall Intelligence Platform
// ============================================

export async function generatePDFReport(data: PDFReportData): Promise<void> {
  const { participant, scoreResult, generated_at, verification_code } = data;
  
  // Create PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  
  // Colors
  const colors = {
    primary: '#06b6d4',
    secondary: '#1e293b',
    text: '#ffffff',
    textMuted: '#94a3b8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  // Helper function to add gradient background
  const addBackground = () => {
    pdf.setFillColor(15, 23, 42); // Dark background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  // Helper function to add header
  const addHeader = () => {
    // Logo area
    pdf.setFillColor(6, 182, 212);
    pdf.roundedRect(margin, margin, 40, 12, 2, 2, 'F');
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('HUMAN FIREWALL', margin + 20, margin + 8, { align: 'center' });
    
    // Title
    pdf.setTextColor(colors.text);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Security Assessment Report', pageWidth / 2, margin + 35, { align: 'center' });
    
    // Subtitle
    pdf.setTextColor(colors.textMuted);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Human Firewall Intelligence Platform', pageWidth / 2, margin + 42, { align: 'center' });
  };

  // Helper function to add participant info
  const addParticipantInfo = (y: number) => {
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(margin, y, pageWidth - margin * 2, 35, 5, 5, 'F');
    
    pdf.setTextColor(colors.text);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PARTICIPANT', margin + 10, y + 10);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.text(participant.name, margin + 10, y + 22);
    
    pdf.setTextColor(colors.textMuted);
    pdf.setFontSize(9);
    pdf.text(`Generated: ${new Date(generated_at).toLocaleString()}`, margin + 10, y + 30);
    
    // Verification code
    pdf.setTextColor(colors.primary);
    pdf.setFontSize(9);
    pdf.text(`Verification: ${verification_code}`, pageWidth - margin - 10, y + 30, { align: 'right' });
    
    return y + 45;
  };

  // Helper function to add score section
  const addScoreSection = (y: number) => {
    const boxWidth = (pageWidth - margin * 2 - 10) / 2;
    
    // Score box
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(margin, y, boxWidth, 60, 5, 5, 'F');
    
    pdf.setTextColor(colors.textMuted);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('OVERALL SCORE', margin + 10, y + 12);
    
    pdf.setTextColor(colors.text);
    pdf.setFontSize(36);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${scoreResult.total_score}%`, margin + 10, y + 40);
    
    // Category badge
    const categoryColors: Record<string, string> = {
      'High Risk': colors.danger,
      'Moderate Risk': colors.warning,
      'Low Risk': colors.success,
      'Human Firewall': colors.primary,
    };
    
    pdf.setFillColor(0, 0, 0);
    const categoryColor = categoryColors[scoreResult.category] || colors.text;
    pdf.setTextColor(categoryColor);
    pdf.setFontSize(12);
    pdf.text(scoreResult.category, margin + 10, y + 55);
    
    // Stats box
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(margin + boxWidth + 10, y, boxWidth, 60, 5, 5, 'F');
    
    pdf.setTextColor(colors.textMuted);
    pdf.setFontSize(10);
    pdf.text('KEY METRICS', margin + boxWidth + 20, y + 12);
    
    const metrics = [
      { label: 'Accuracy', value: `${scoreResult.metrics.decision_accuracy}%` },
      { label: 'Avg Response', value: `${Math.round(scoreResult.metrics.avg_response_time / 1000)}s` },
      { label: 'Hesitations', value: scoreResult.metrics.hesitation_patterns.toString() },
    ];
    
    let metricY = y + 25;
    metrics.forEach((metric) => {
      pdf.setTextColor(colors.text);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(metric.value, margin + boxWidth + 20, metricY);
      
      pdf.setTextColor(colors.textMuted);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(metric.label, margin + boxWidth + 20, metricY + 5);
      
      metricY += 18;
    });
    
    return y + 70;
  };

  // Helper function to add vulnerability breakdown
  const addVulnerabilityBreakdown = (y: number) => {
    pdf.setTextColor(colors.text);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Vulnerability Analysis', margin, y);
    
    const breakdown = scoreResult.metrics.vulnerability_breakdown;
    const items = [
      { label: 'Urgency Manipulation', value: breakdown.urgency_manipulation },
      { label: 'Authority Bias', value: breakdown.authority_bias },
      { label: 'Reward Bait', value: breakdown.reward_bait },
      { label: 'Emotional Triggers', value: breakdown.emotional_trigger },
      { label: 'Curiosity Traps', value: breakdown.curiosity_trap },
    ];
    
    let itemY = y + 15;
    const barWidth = pageWidth - margin * 2 - 60;
    
    items.forEach((item) => {
      // Label
      pdf.setTextColor(colors.text);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(item.label, margin, itemY);
      
      // Value
      pdf.setTextColor(colors.primary);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${item.value}%`, pageWidth - margin, itemY, { align: 'right' });
      
      // Bar background
      pdf.setFillColor(30, 41, 59);
      pdf.roundedRect(margin, itemY + 3, barWidth, 6, 2, 2, 'F');
      
      // Bar fill
      const fillWidth = (item.value / 100) * barWidth;
      pdf.setFillColor(6, 182, 212);
      pdf.roundedRect(margin, itemY + 3, fillWidth, 6, 2, 2, 'F');
      
      itemY += 18;
    });
    
    return itemY + 10;
  };

  // Helper function to add recommendations
  const addRecommendations = (y: number) => {
    pdf.setTextColor(colors.text);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommendations', margin, y);
    
    let recY = y + 12;
    
    scoreResult.recommendations.slice(0, 4).forEach((rec) => {
      // Bullet point
      pdf.setFillColor(6, 182, 212);
      pdf.circle(margin + 2, recY - 1, 1.5, 'F');
      
      // Text
      pdf.setTextColor(colors.textMuted);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      // Wrap text
      const maxWidth = pageWidth - margin * 2 - 15;
      const lines = pdf.splitTextToSize(rec, maxWidth);
      pdf.text(lines, margin + 8, recY);
      
      recY += (lines.length * 4) + 6;
    });
    
    return recY + 10;
  };

  // Helper function to add footer
  const addFooter = () => {
    const footerY = pageHeight - 25;
    
    pdf.setDrawColor(30, 41, 59);
    pdf.line(margin, footerY, pageWidth - margin, footerY);
    
    pdf.setTextColor(colors.textMuted);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      'This report was generated by Human Firewall Intelligence Platform.',
      pageWidth / 2,
      footerY + 8,
      { align: 'center' }
    );
    pdf.text(
      'For verification, visit: humanfirewall.io/verify',
      pageWidth / 2,
      footerY + 13,
      { align: 'center' }
    );
  };

  // Build the PDF
  addBackground();
  addHeader();
  
  let currentY = margin + 55;
  currentY = addParticipantInfo(currentY);
  currentY = addScoreSection(currentY);
  currentY = addVulnerabilityBreakdown(currentY);
  currentY = addRecommendations(currentY);
  addFooter();

  // Save the PDF
  const fileName = `HumanFirewall_Report_${participant.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

// Generate verification code
export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HF-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3) code += '-';
  }
  return code;
}

// Export report data for sharing
export function generateShareText(data: PDFReportData): string {
  const { participant, scoreResult } = data;
  
  return `🔒 Human Firewall Assessment Complete!

👤 Name: ${participant.name}
📊 Score: ${scoreResult.total_score}%
🏆 Category: ${scoreResult.category}

I just completed the Human Firewall Intelligence Platform assessment. Test your cybersecurity awareness at humanfirewall.io!

#Cybersecurity #HumanFirewall #SecurityAwareness`;
}
