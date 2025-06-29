import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { Download, FileText, CheckCircle2, Zap, Shield, FileImage } from 'lucide-react';
import { toast } from "@/components/ui/sonner";

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
    total: string;
    deposits: string;
    recommendations: string;
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
      total: '',
      deposits: '',
      recommendations: ''
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);

  // Helper function to load image and return as canvas-drawable format
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Helper function to wrap text
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Download PNG with unified table format
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      toast.info("Memproses laporan PNG...", {
        description: "Sedang menggenerate file PNG dengan tabel yang terpadu."
      });

      // Create canvas with A4 dimensions (794x1123 pixels at 96 DPI)
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      canvas.width = 794;
      canvas.height = 1123;
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set default text properties
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'top';
      
      let yPosition = 40;
      const leftMargin = 40;
      const rightMargin = canvas.width - 40;
      const contentWidth = rightMargin - leftMargin;

      // Header Section
      ctx.textAlign = 'center';
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#1e3a8a'; // blue-900
      ctx.fillText(reportData.title, canvas.width / 2, yPosition);
      yPosition += 35;

      ctx.font = '16px Arial';
      ctx.fillStyle = '#1d4ed8'; // blue-700
      ctx.fillText(reportData.address, canvas.width / 2, yPosition);
      yPosition += 25;
      ctx.fillText(reportData.company, canvas.width / 2, yPosition);
      yPosition += 35;

      // Header border line
      ctx.strokeStyle = '#2563eb'; // blue-600
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(leftMargin, yPosition);
      ctx.lineTo(rightMargin, yPosition);
      ctx.stroke();
      yPosition += 25;

      // Report Info Section
      ctx.textAlign = 'left';
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#1e3a8a'; // blue-900
      ctx.fillText('Periode :', leftMargin, yPosition);
      yPosition += 20;
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#000000';
      const periodLines = wrapText(ctx, reportData.period, contentWidth / 2 - 20);
      periodLines.forEach(line => {
        ctx.fillText(line, leftMargin, yPosition);
        yPosition += 18;
      });

      // Employee info (right side)
      const employeeY = yPosition - (periodLines.length * 18) - 20;
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#1e3a8a'; // blue-900
      ctx.fillText('Karyawan :', canvas.width / 2 + 20, employeeY);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#000000';
      const employeeLines = wrapText(ctx, reportData.employee || 'N/A', contentWidth / 2 - 20);
      let empY = employeeY + 20;
      employeeLines.forEach(line => {
        ctx.fillText(line, canvas.width / 2 + 20, empY);
        empY += 18;
      });

      yPosition += 30;

      // Unified Table with rounded corners and shadow effect
      const tableStartY = yPosition;
      const tableWidth = contentWidth;
      const col1Width = tableWidth / 2;
      const col2Width = tableWidth / 2;
      const cornerRadius = 8;

      // Draw table shadow (offset background)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(leftMargin + 3, yPosition + 3, tableWidth, 40);

      // Draw rounded table background
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(leftMargin, yPosition, tableWidth, 40, cornerRadius);
      ctx.fill();

      // Table header with rounded top corners
      ctx.fillStyle = '#2563eb'; // blue-600
      ctx.beginPath();
      ctx.roundRect(leftMargin, yPosition, tableWidth, 40, [cornerRadius, cornerRadius, 0, 0]);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Jumlah Cash Pick Up (NOA)', leftMargin + col1Width / 2, yPosition + 15);
      ctx.fillText('Foto (Struk Terakhir)', leftMargin + col1Width + col2Width / 2, yPosition + 15);
      
      // Draw header borders with gray color
      ctx.strokeStyle = '#d1d5db'; // gray-300
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(leftMargin, yPosition, tableWidth, 40, [cornerRadius, cornerRadius, 0, 0]);
      ctx.stroke();
      
      // Vertical separator
      ctx.beginPath();
      ctx.moveTo(leftMargin + col1Width, yPosition);
      ctx.lineTo(leftMargin + col1Width, yPosition + 40);
      ctx.stroke();
      
      yPosition += 40;

      // Table content
      if (reportData.items.length === 0) {
        // Empty state
        const rowHeight = 120;
        
        // Draw row background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(leftMargin, yPosition, tableWidth, rowHeight);
        
        // Draw borders
        ctx.strokeStyle = '#d1d5db'; // gray-300
        ctx.lineWidth = 1;
        ctx.strokeRect(leftMargin, yPosition, tableWidth, rowHeight);
        ctx.strokeRect(leftMargin + col1Width, yPosition, 1, rowHeight); // Vertical separator
        
        // Left column - quantity
        ctx.fillStyle = '#2563eb'; // blue-600
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('0', leftMargin + col1Width / 2, yPosition + 30);
        
        ctx.fillStyle = '#6b7280'; // gray-500
        ctx.font = '12px Arial';
        ctx.fillText('No items', leftMargin + col1Width / 2, yPosition + 85);
        
        // Right column - image placeholder with rounded corners
        ctx.fillStyle = '#f3f4f6'; // gray-100
        ctx.beginPath();
        ctx.roundRect(leftMargin + col1Width + 20, yPosition + 20, col2Width - 40, 80, 8);
        ctx.fill();
        
        ctx.fillStyle = '#9ca3af'; // gray-400
        ctx.font = '12px Arial';
        ctx.fillText('No Image', leftMargin + col1Width + col2Width / 2, yPosition + 55);
        
        yPosition += rowHeight;
      } else {
        // Render items
        for (const item of reportData.items) {
          const rowHeight = 120;
          
          // Draw row background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(leftMargin, yPosition, tableWidth, rowHeight);
          
          // Draw borders
          ctx.strokeStyle = '#d1d5db'; // gray-300
          ctx.lineWidth = 1;
          ctx.strokeRect(leftMargin, yPosition, tableWidth, rowHeight);
          ctx.strokeRect(leftMargin + col1Width, yPosition, 1, rowHeight); // Vertical separator
          
          // Left column - quantity only (no name)
          ctx.fillStyle = '#2563eb'; // blue-600
          ctx.font = 'bold 48px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(item.quantity.toString(), leftMargin + col1Width / 2, yPosition + 40);
          
          // Right column - image with rounded corners
          const imageArea = {
            x: leftMargin + col1Width + 20,
            y: yPosition + 20,
            width: col2Width - 40,
            height: 80
          };
          
          if (item.image) {
            try {
              const img = await loadImage(item.image);
              
              // Calculate aspect ratio and fit image
              const imgAspect = img.width / img.height;
              const areaAspect = imageArea.width / imageArea.height;
              
              let drawWidth, drawHeight, drawX, drawY;
              
              if (imgAspect > areaAspect) {
                // Image is wider
                drawWidth = imageArea.width;
                drawHeight = imageArea.width / imgAspect;
                drawX = imageArea.x;
                drawY = imageArea.y + (imageArea.height - drawHeight) / 2;
              } else {
                // Image is taller
                drawHeight = imageArea.height;
                drawWidth = imageArea.height * imgAspect;
                drawX = imageArea.x + (imageArea.width - drawWidth) / 2;
                drawY = imageArea.y;
              }
              
              // Draw image with rounded corners
              ctx.save();
              ctx.beginPath();
              ctx.roundRect(drawX, drawY, drawWidth, drawHeight, 8);
              ctx.clip();
              ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
              ctx.restore();
            } catch (error) {
              // Fallback if image fails to load
              ctx.fillStyle = '#f3f4f6'; // gray-100
              ctx.beginPath();
              ctx.roundRect(imageArea.x, imageArea.y, imageArea.width, imageArea.height, 8);
              ctx.fill();
              
              ctx.fillStyle = '#9ca3af'; // gray-400
              ctx.font = '12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('Image Error', imageArea.x + imageArea.width / 2, imageArea.y + imageArea.height / 2);
            }
          } else {
            // No image placeholder with rounded corners
            ctx.fillStyle = '#f3f4f6'; // gray-100
            ctx.beginPath();
            ctx.roundRect(imageArea.x, imageArea.y, imageArea.width, imageArea.height, 8);
            ctx.fill();
            
            ctx.fillStyle = '#9ca3af'; // gray-400
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No Image', imageArea.x + imageArea.width / 2, imageArea.y + imageArea.height / 2);
          }
          
          yPosition += rowHeight;
        }
      }

      // Summary Section - Integrated without header
      const summaryData = [
        ['Pembukaan Tabungan (NOA)', reportData.summary.total || '-'],
        ['Pembukaan Deposit (NOA)', reportData.summary.deposits || '-'],
        ['Rekomendasi Kredit', reportData.summary.recommendations || '-']
      ];
      
      summaryData.forEach(([label, value], index) => {
        const rowHeight = 40;
        const isLastRow = index === summaryData.length - 1;
        
        // Summary row background
        ctx.fillStyle = '#2563eb'; // blue-600
        if (isLastRow) {
          // Last row with rounded bottom corners
          ctx.beginPath();
          ctx.roundRect(leftMargin, yPosition, tableWidth, rowHeight, [0, 0, cornerRadius, cornerRadius]);
          ctx.fill();
        } else {
          ctx.fillRect(leftMargin, yPosition, tableWidth, rowHeight);
        }
        
        // Summary text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label, leftMargin + 20, yPosition + 15);
        
        ctx.textAlign = 'center';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(value, leftMargin + tableWidth * 0.8, yPosition + 12);
        
        // Draw summary row border
        ctx.strokeStyle = '#d1d5db'; // gray-300
        if (isLastRow) {
          ctx.beginPath();
          ctx.roundRect(leftMargin, yPosition, tableWidth, rowHeight, [0, 0, cornerRadius, cornerRadius]);
          ctx.stroke();
        } else {
          ctx.strokeRect(leftMargin, yPosition, tableWidth, rowHeight);
        }
        ctx.strokeRect(leftMargin + tableWidth * 0.65, yPosition, 1, rowHeight); // Vertical separator
        
        yPosition += rowHeight;
      });

      // Draw final table border with rounded corners
      ctx.strokeStyle = '#d1d5db'; // gray-300
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(leftMargin, tableStartY, tableWidth, yPosition - tableStartY, cornerRadius);
      ctx.stroke();

      // Footer
      yPosition = canvas.height - 50;
      ctx.fillStyle = '#6b7280'; // gray-500
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Laporan dibuat pada: ${new Date().toLocaleString('id-ID')}`, canvas.width / 2, yPosition);
      
      // Download
      const link = document.createElement('a');
      link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      toast.success("Download PNG berhasil!", {
        description: "Laporan dengan tabel terpadu telah berhasil didownload."
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

  // Print function for browser native print
  const printReport = () => {
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
            Platform modern untuk membuat, melihat preview, dan mendownload laporan profesional dalam format PNG
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
              <span className="text-sm font-medium text-slate-700">Input Manual</span>
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
                <p className="text-slate-600">Lihat hasil laporan dengan tabel yang terpadu dan modern</p>
              </div>
              
              {/* Download Options */}
              <div className="flex flex-col sm:flex-row gap-3">
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
                  onClick={printReport}
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
                  <span className="text-sm font-medium text-slate-600">Preview Mode - Summary input manual</span>
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