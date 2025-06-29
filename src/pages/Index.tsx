import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { Download, FileText, CheckCircle2, Zap, Shield, FileImage, File as FilePdf } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import jsPDF from 'jspdf';

export interface ReportData {
  title: string;
  company: string;
  address: string;
  period: string;
  employee: string;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    image?: string;
  }>;
  summary: {
    total: number;
    deposits: number;
    recommendations: number;
  };
}

const Index = () => {
  const [reportData, setReportData] = useState<ReportData>({
    title: 'LAPORAN HARIAN COLLECTION',
    company: 'PT. BPR BANK BULUNGAN (Perseroda)',
    address: 'KANTOR PUSAT',
    period: new Date().toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    employee: '',
    items: [],
    summary: {
      total: 0,
      deposits: 0,
      recommendations: 0
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);

  // Method 1: Generate PDF using jsPDF
  const downloadAsPDF = async () => {
    setIsDownloading(true);
    try {
      toast.info("Memproses laporan PDF...", {
        description: "Sedang menggenerate file PDF, mohon tunggu sebentar."
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Set font
      pdf.setFont('helvetica');
      
      // Header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(reportData.title, pageWidth / 2, 30, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(reportData.company, pageWidth / 2, 40, { align: 'center' });
      pdf.text(reportData.address, pageWidth / 2, 50, { align: 'center' });
      
      // Line separator
      pdf.setLineWidth(0.5);
      pdf.line(20, 60, pageWidth - 20, 60);
      
      // Report info
      pdf.setFontSize(10);
      pdf.text(`Periode: ${reportData.period}`, 20, 75);
      pdf.text(`Karyawan: ${reportData.employee}`, 20, 85);
      
      // Table header
      let yPosition = 100;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('No.', 20, yPosition);
      pdf.text('Nama Item', 40, yPosition);
      pdf.text('Jumlah', 120, yPosition);
      pdf.text('Keterangan', 150, yPosition);
      
      // Table content
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      yPosition += 10;
      
      reportData.items.forEach((item, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 30;
        }
        
        pdf.text((index + 1).toString(), 20, yPosition);
        pdf.text(item.name || 'N/A', 40, yPosition);
        pdf.text(item.quantity.toString(), 120, yPosition);
        pdf.text(item.image ? 'Ada gambar' : 'Tidak ada gambar', 150, yPosition);
        yPosition += 10;
      });
      
      // Summary
      yPosition += 20;
      pdf.setFont('helvetica', 'bold');
      pdf.text('SUMMARY:', 20, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total Items: ${reportData.summary.total}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Pembukaan Tabungan: ${reportData.summary.deposits}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Rekomendasi Kredit: ${reportData.summary.recommendations}`, 20, yPosition);
      
      // Footer
      pdf.setFontSize(8);
      pdf.text(`Laporan dibuat pada: ${new Date().toLocaleString('id-ID')}`, 20, pageHeight - 20);
      
      // Save PDF
      const fileName = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success("Download PDF berhasil!", {
        description: "Laporan telah berhasil didownload dalam format PDF."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Download PDF gagal!", {
        description: "Terjadi kesalahan saat menggenerate laporan PDF."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Method 2: Generate PNG using Canvas API (without html2canvas)
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      toast.info("Memproses laporan PNG...", {
        description: "Sedang menggenerate file PNG, mohon tunggu sebentar."
      });

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set A4 dimensions (794x1123 pixels at 96 DPI)
      canvas.width = 794;
      canvas.height = 1123;
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text properties
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      
      // Header
      ctx.font = 'bold 24px Arial';
      ctx.fillText(reportData.title, canvas.width / 2, 60);
      
      ctx.font = '16px Arial';
      ctx.fillText(reportData.company, canvas.width / 2, 90);
      ctx.fillText(reportData.address, canvas.width / 2, 115);
      
      // Line separator
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(50, 140);
      ctx.lineTo(canvas.width - 50, 140);
      ctx.stroke();
      
      // Report info
      ctx.textAlign = 'left';
      ctx.font = '14px Arial';
      ctx.fillText(`Periode: ${reportData.period}`, 50, 170);
      ctx.fillText(`Karyawan: ${reportData.employee}`, 50, 195);
      
      // Table header
      let yPos = 240;
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(50, yPos - 20, canvas.width - 100, 30);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Jumlah Cash Pick Up (NOA)', 200, yPos - 5);
      ctx.fillText('Foto (Struk Terakhir)', 550, yPos - 5);
      
      // Table content
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      yPos += 40;
      
      if (reportData.items.length === 0) {
        // Empty state
        ctx.strokeStyle = '#d1d5db';
        ctx.strokeRect(50, yPos, canvas.width - 100, 80);
        
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#2563eb';
        ctx.textAlign = 'center';
        ctx.fillText('0', 200, yPos + 50);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.fillText('No items', 200, yPos + 70);
        
        ctx.fillText('No Image', 550, yPos + 45);
        yPos += 100;
      } else {
        reportData.items.forEach((item, index) => {
          // Draw table row
          ctx.strokeStyle = '#d1d5db';
          ctx.strokeRect(50, yPos, canvas.width - 100, 80);
          ctx.strokeRect(350, yPos, 1, 80); // Vertical separator
          
          // Item quantity
          ctx.font = 'bold 36px Arial';
          ctx.fillStyle = '#2563eb';
          ctx.textAlign = 'center';
          ctx.fillText(item.quantity.toString(), 200, yPos + 50);
          
          // Item name
          ctx.font = '12px Arial';
          ctx.fillStyle = '#6b7280';
          ctx.fillText(item.name || 'No name', 200, yPos + 70);
          
          // Image placeholder
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(450, yPos + 10, 100, 60);
          ctx.fillStyle = '#9ca3af';
          ctx.font = '10px Arial';
          ctx.fillText(item.image ? 'Image' : 'No Image', 500, yPos + 45);
          
          yPos += 100;
        });
      }
      
      // Summary table
      yPos += 30;
      const summaryData = [
        ['Pembukaan Tabungan (NOA)', reportData.summary.total.toString()],
        ['Pembukaan Deposit (NOA)', reportData.summary.deposits.toString()],
        ['Rekomendasi Kredit', reportData.summary.recommendations.toString()]
      ];
      
      summaryData.forEach(([label, value]) => {
        // Summary row background
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(50, yPos, canvas.width - 100, 40);
        
        // Summary text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, 70, yPos + 25);
        
        ctx.textAlign = 'center';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(value, 600, yPos + 25);
        
        yPos += 50;
      });
      
      // Footer
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Laporan dibuat pada: ${new Date().toLocaleString('id-ID')}`, canvas.width / 2, canvas.height - 30);
      
      // Download
      const link = document.createElement('a');
      link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast.success("Download PNG berhasil!", {
        description: "Laporan telah berhasil didownload dalam format PNG."
      });
    } catch (error) {
      console.error('Error generating PNG:', error);
      toast.error("Download PNG gagal!", {
        description: "Terjadi kesalahan saat menggenerate laporan PNG."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Method 3: Print to PDF (using browser's print function)
  const printToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const reportElement = document.getElementById('report-preview');
      if (reportElement) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Laporan - ${reportData.employee || 'Collection'}</title>
              <style>
                @page { 
                  size: A4; 
                  margin: 0; 
                }
                body { 
                  margin: 0; 
                  font-family: Arial, sans-serif; 
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .no-print { display: none !important; }
              </style>
            </head>
            <body>
              ${reportElement.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Sistem Laporan Dinamis
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Platform modern untuk membuat, melihat preview, dan mendownload laporan profesional dalam berbagai format
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Cepat & Mudah</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Aman & Terpercaya</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Multi Format</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="form" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-sm border border-slate-200 h-12 p-1">
              <TabsTrigger 
                value="form" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white font-medium transition-all duration-200"
              >
                📝 Form Input
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white font-medium transition-all duration-200"
              >
                👁️ Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="form" className="space-y-6">
            <Card className="bg-white shadow-lg border border-slate-200">
              <div className="bg-slate-900 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    📋
                  </div>
                  Input Data Laporan
                </h2>
                <p className="text-slate-300 mt-2">Isi form di bawah untuk membuat laporan Anda</p>
              </div>
              <div className="p-6">
                <ReportForm reportData={reportData} setReportData={setReportData} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Preview Laporan
                </h2>
                <p className="text-slate-600">Lihat hasil laporan sebelum didownload</p>
              </div>
              
              {/* Download Options */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={downloadAsPDF}
                  disabled={isDownloading}
                  className="bg-red-600 hover:bg-red-700 text-white shadow-lg h-12 px-6 font-semibold transition-all duration-200"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FilePdf className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Download PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </>
                  )}
                </Button>

                <Button 
                  onClick={downloadAsPNG}
                  disabled={isDownloading}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 px-6 font-semibold transition-all duration-200"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FileImage className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Download PNG</span>
                      <span className="sm:hidden">PNG</span>
                    </>
                  )}
                </Button>

                <Button 
                  onClick={printToPDF}
                  disabled={isDownloading}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg h-12 px-6 font-semibold transition-all duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Print PDF</span>
                  <span className="sm:hidden">Print</span>
                </Button>
              </div>
            </div>
            
            <Card className="bg-white shadow-lg border border-slate-200">
              <div className="bg-slate-50 p-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-600">Preview Mode - Responsive</span>
                </div>
              </div>
              <div className="p-2 sm:p-4 lg:p-6">
                <ReportPreview reportData={reportData} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;