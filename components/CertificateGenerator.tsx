
import React from 'react';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';

interface CertificateGeneratorProps {
    studentName: string;
    courseName: string;
    scorePercentage: number;
    completionDate: string;
    onDownloadStart?: () => void;
    onDownloadComplete?: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
    studentName,
    courseName,
    scorePercentage,
    completionDate,
    onDownloadStart,
    onDownloadComplete
}) => {

    // Generate a verification hash
    // Encode certificate data into a verification code that can be decoded
    const generateVerificationCode = () => {
        const data = `${studentName}|${courseName}|${scorePercentage}|${completionDate}`;
        // Base64 encode, then make URL-safe and compact
        const encoded = btoa(unescape(encodeURIComponent(data)));
        return encoded;
    };

    const verificationCode = generateVerificationCode();

    const handleDownload = () => {
        if (onDownloadStart) onDownloadStart();

        try {
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const w = pdf.internal.pageSize.getWidth();  // 297
            const h = pdf.internal.pageSize.getHeight(); // 210
            const cx = w / 2;

            // Background
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, w, h, 'F');

            // Outer border (double effect)
            pdf.setDrawColor(217, 119, 6); // amber-600
            pdf.setLineWidth(2);
            pdf.rect(8, 8, w - 16, h - 16);
            pdf.setLineWidth(0.5);
            pdf.rect(12, 12, w - 24, h - 24);

            // Corner decorations (L-shapes)
            const cornerLen = 20;
            const cornerInset = 16;
            pdf.setLineWidth(1.5);
            pdf.setDrawColor(217, 119, 6);

            // Top-left
            pdf.line(cornerInset, cornerInset, cornerInset + cornerLen, cornerInset);
            pdf.line(cornerInset, cornerInset, cornerInset, cornerInset + cornerLen);
            // Top-right
            pdf.line(w - cornerInset, cornerInset, w - cornerInset - cornerLen, cornerInset);
            pdf.line(w - cornerInset, cornerInset, w - cornerInset, cornerInset + cornerLen);
            // Bottom-left
            pdf.line(cornerInset, h - cornerInset, cornerInset + cornerLen, h - cornerInset);
            pdf.line(cornerInset, h - cornerInset, cornerInset, h - cornerInset - cornerLen);
            // Bottom-right
            pdf.line(w - cornerInset, h - cornerInset, w - cornerInset - cornerLen, h - cornerInset);
            pdf.line(w - cornerInset, h - cornerInset, w - cornerInset, h - cornerInset - cornerLen);

            // Award icon placeholder (star shape)
            pdf.setFillColor(245, 158, 11); // amber-500
            const starY = 38;
            pdf.setFontSize(28);
            pdf.setTextColor(245, 158, 11);
            pdf.text('\u2605', cx, starY, { align: 'center' }); // Unicode star

            // Title
            pdf.setFontSize(36);
            pdf.setTextColor(15, 23, 42); // slate-900
            pdf.setFont('helvetica', 'bold');
            pdf.text('OKLEV\u00c9L', cx, 55, { align: 'center' });

            // Decorative line
            pdf.setDrawColor(245, 158, 11);
            pdf.setLineWidth(0.8);
            pdf.line(cx - 40, 60, cx + 40, 60);

            // "Ezennel igazoljuk, hogy"
            pdf.setFontSize(14);
            pdf.setTextColor(71, 85, 105); // slate-600  
            pdf.setFont('helvetica', 'italic');
            pdf.text('Ezennel igazoljuk, hogy', cx, 75, { align: 'center' });

            // Student Name
            pdf.setFontSize(28);
            pdf.setTextColor(217, 119, 6); // amber-600
            pdf.setFont('helvetica', 'bolditalic');
            pdf.text(studentName, cx, 90, { align: 'center' });

            // "sikeresen teljesítette"
            pdf.setFontSize(14);
            pdf.setTextColor(71, 85, 105);
            pdf.setFont('helvetica', 'italic');
            pdf.text('sikeresen teljes\u00edtette az al\u00e1bbi modult:', cx, 105, { align: 'center' });

            // Course Name
            pdf.setFontSize(22);
            pdf.setTextColor(30, 41, 59); // slate-800
            pdf.setFont('helvetica', 'bold');
            pdf.text(courseName, cx, 118, { align: 'center' });

            // Stats
            const statsY = 138;
            // Score
            pdf.setFontSize(10);
            pdf.setTextColor(100, 116, 139); // slate-500
            pdf.setFont('helvetica', 'normal');
            pdf.text('EREDM\u00c9NY', cx - 35, statsY, { align: 'center' });
            pdf.setFontSize(20);
            pdf.setTextColor(217, 119, 6);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${scorePercentage}%`, cx - 35, statsY + 10, { align: 'center' });

            // Date
            pdf.setFontSize(10);
            pdf.setTextColor(100, 116, 139);
            pdf.setFont('helvetica', 'normal');
            pdf.text('D\u00c1TUM', cx + 35, statsY, { align: 'center' });
            pdf.setFontSize(20);
            pdf.setTextColor(51, 65, 85); // slate-700
            pdf.setFont('helvetica', 'bold');
            pdf.text(completionDate, cx + 35, statsY + 10, { align: 'center' });

            // Footer - Verification
            pdf.setFontSize(7);
            pdf.setTextColor(148, 163, 184); // slate-400
            pdf.setFont('helvetica', 'normal');
            pdf.text('HITELES\u00cdT\u00c9SI K\u00d3D', 25, h - 28);

            pdf.setFontSize(6);
            pdf.setTextColor(100, 116, 139);
            pdf.setFont('courier', 'normal');
            // Split long code into multiple lines if needed
            const maxLineLen = 55;
            const codeLine1 = verificationCode.substring(0, maxLineLen);
            const codeLine2 = verificationCode.substring(maxLineLen);
            pdf.text(codeLine1, 25, h - 22);
            if (codeLine2) {
                pdf.text(codeLine2, 25, h - 18);
            }

            // Footer - Signature
            pdf.setFontSize(16);
            pdf.setTextColor(217, 119, 6);
            pdf.setFont('helvetica', 'bolditalic');
            pdf.text('Matekverzum', w - 25, h - 25, { align: 'right' });

            pdf.setDrawColor(203, 213, 225);
            pdf.setLineWidth(0.3);
            pdf.line(w - 70, h - 23, w - 25, h - 23);

            pdf.setFontSize(7);
            pdf.setTextColor(148, 163, 184);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Digit\u00e1lis al\u00e1\u00edr\u00e1s', w - 25, h - 19, { align: 'right' });

            // Save
            pdf.save(`oklevel_${studentName.replace(/\s+/g, '_')}_${courseName.replace(/\s+/g, '_')}.pdf`);

            if (onDownloadComplete) onDownloadComplete();

        } catch (error) {
            console.error('Certificate generation failed:', error);
            alert('Hiba t\u00f6rt\u00e9nt az oklev\u00e9l gener\u00e1l\u00e1sa k\u00f6zben. K\u00e9rlek pr\u00f3b\u00e1ld \u00fajra!');
            if (onDownloadComplete) onDownloadComplete();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
                <Download className="w-5 h-5" />
                Oklevél Letöltése (PDF)
            </button>
        </div>
    );
};

export default CertificateGenerator;
