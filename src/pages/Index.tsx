import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { Download, FileText, CheckCircle2, Zap, Shield, FileImage, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import html2canvas from 'html2canvas';

export interface ReportData {
  title: string;
  company: string;
  address: string;
  period: string;
  employee: string;
  items: Array<{
    id: number;
    name: string;
    quantity: string;
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

  // A4 dimensions and padding calculations
  const A4_CONFIG = {
    // A4 dimensions in pixels at 96 DPI
    width: 794,
    height: 1123,
    // Standard A4 padding: 3cm top/bottom, 4cm left/right
    // At 96 DPI: 1cm = ~37.8px
    padding: {
      top: 113,    // 3cm = 113px
      bottom: 113, // 3cm = 113px  
      left: 151,   // 4cm = 151px
      right: 151   // 4cm = 151px
    },
    // Content area after padding
    contentWidth: 492,  // 794 - 151 - 151 = 492px
    contentHeight: 897  // 1123 - 113 - 113 = 897px
  };

  // Robust download function with A4 standard padding
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    
    try {
      toast.info("🔄 Memproses laporan A4...", {
        description: "Menyiapkan konten dengan padding standar 3:4."
      });

      // Create A4 standard element
      const a4Element = createA4StandardElement();
      document.body.appendChild(a4Element);

      // Wait for rendering and images
      await new Promise(resolve => setTimeout(resolve, 1000));
      await waitForAllImages(a4Element);

      const canvas = await html2canvas(a4Element, {
        scale: 2, // High quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: A4_CONFIG.width,
        height: A4_CONFIG.height,
        scrollX: 0,
        scrollY: 0,
        windowWidth: A4_CONFIG.width,
        windowHeight: A4_CONFIG.height,
        imageTimeout: 5000,
        removeContainer: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Inject A4 specific styles
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              font-family: Arial, sans-serif !important;
              background: white !important;
            }
            img {
              max-width: 100% !important;
              height: auto !important;
              object-fit: contain !important;
            }
            table {
              border-collapse: collapse !important;
              width: 100% !important;
            }
            .a4-container {
              width: ${A4_CONFIG.width}px !important;
              height: ${A4_CONFIG.height}px !important;
              padding: ${A4_CONFIG.padding.top}px ${A4_CONFIG.padding.right}px ${A4_CONFIG.padding.bottom}px ${A4_CONFIG.padding.left}px !important;
              background: white !important;
              overflow: hidden !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      document.body.removeChild(a4Element);

      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const dataUrl = canvas.toDataURL('image/png', 0.95);
        
        if (dataUrl && dataUrl.length > 1000) {
          downloadImage(dataUrl, 'a4-standard');
          return;
        }
      }

      throw new Error('A4 download failed');

    } catch (error) {
      console.error('Download error:', error);
      toast.error("❌ Download gagal!", {
        description: "Terjadi kesalahan. Silakan coba refresh halaman dan coba lagi."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to download image
  const downloadImage = (dataUrl: string, method: string) => {
    const link = document.createElement('a');
    link.download = `laporan-a4-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const fileSizeKB = Math.round((dataUrl.length * 0.75) / 1024);
    
    toast.success("✅ Download A4 berhasil!", {
      description: `File PNG A4 berhasil didownload (~${fileSizeKB}KB) dengan padding standar 3:4.`
    });
  };

  // Create A4 standard element with proper padding
  const createA4StandardElement = (): HTMLElement => {
    const element = document.createElement('div');
    element.className = 'a4-container';
    element.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: ${A4_CONFIG.width}px;
      height: ${A4_CONFIG.height}px;
      background: white;
      font-family: Arial, sans-serif;
      z-index: -1;
      padding: ${A4_CONFIG.padding.top}px ${A4_CONFIG.padding.right}px ${A4_CONFIG.padding.bottom}px ${A4_CONFIG.padding.left}px;
      box-sizing: border-box;
      overflow: hidden;
    `;

    element.innerHTML = generateA4ReportHTML();
    return element;
  };

  // Generate A4 optimized report HTML
  const generateA4ReportHTML = (): string => {
    const itemsHTML = reportData.items.length > 0 
      ? reportData.items.map((item, index) => `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 8px; text-align: center; background: white; vertical-align: middle; width: 50%;">
              <div style="font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 2px; line-height: 1;">
                ${item.quantity || '-'}
              </div>
            </td>
            <td style="padding: 8px; text-align: center; background: white; vertical-align: middle; width: 50%;">
              ${item.image ? `
                <img
                  src="${item.image}"
                  alt="Item ${index + 1}"
                  style="max-width: 100%; max-height: 80px; object-fit: contain; border-radius: 4px; border: 1px solid #d1d5db;"
                  crossorigin="anonymous"
                />
              ` : `
                <div style="width: 100%; height: 80px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; border: 1px solid #d1d5db;">
                  No Image
                </div>
              `}
            </td>
          </tr>
        `).join('')
      : `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 8px; text-align: center; background: white; vertical-align: middle;">
              <div style="font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 2px; line-height: 1;">-</div>
              <div style="font-size: 9px; color: #6b7280;">No items</div>
            </td>
            <td style="padding: 8px; text-align: center; background: white; vertical-align: middle;">
              <div style="width: 100%; height: 80px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; border: 1px solid #d1d5db;">
                No Image
              </div>
            </td>
          </tr>
        `;

    return `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 16px; border-bottom: 2px solid #2563eb; padding-bottom: 12px; flex-shrink: 0;">
          <h1 style="font-size: 16px; font-weight: bold; color: #1e3a8a; margin-bottom: 8px; line-height: 1.2; margin-top: 0;">
            ${reportData.title}
          </h1>
          <div style="color: #1d4ed8; line-height: 1.3;">
            <p style="font-weight: 600; font-size: 11px; margin: 1px 0;">${reportData.address}</p>
            <p style="font-weight: 600; font-size: 11px; margin: 1px 0;">${reportData.company}</p>
          </div>
        </div>

        <!-- Report Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 9px; flex-shrink: 0;">
          <div>
            <div style="margin-bottom: 2px; font-weight: 600; color: #1e3a8a;">Periode :</div>
            <div>${reportData.period}</div>
          </div>
          <div>
            <div style="margin-bottom: 2px; font-weight: 600; color: #1e3a8a;">Karyawan :</div>
            <div>${reportData.employee}</div>
          </div>
        </div>

        <!-- Main Table -->
        <div style="flex: 1; display: flex; flex-direction: column;">
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; border-radius: 6px; overflow: hidden; flex: 1;">
            <thead>
              <tr style="background: #2563eb; color: white;">
                <th style="border-right: 1px solid #6b7280; padding: 8px; text-align: center; font-weight: 600; font-size: 11px; width: 50%;">
                  Jumlah Cash Pick Up (NOA)
                </th>
                <th style="padding: 8px; text-align: center; font-weight: 600; font-size: 11px; width: 50%;">
                  Foto (Struk Terakhir)
                </th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              
              <!-- Summary -->
              <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                <td style="border-right: 1px solid #6b7280; padding: 6px; font-weight: 600; text-align: left; font-size: 9px;">
                  Pembukaan Tabungan (NOA)
                </td>
                <td style="padding: 6px; text-align: center; font-weight: bold; font-size: 10px;">
                  ${reportData.summary.total || '-'}
                </td>
              </tr>
              <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                <td style="border-right: 1px solid #6b7280; padding: 6px; font-weight: 600; text-align: left; font-size: 9px;">
                  Pembukaan Deposit (NOA)
                </td>
                <td style="padding: 6px; text-align: center; font-weight: bold; font-size: 10px;">
                  ${reportData.summary.deposits || '-'}
                </td>
              </tr>
              <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                <td style="border-right: 1px solid #6b7280; padding: 6px; font-weight: 600; text-align: left; font-size: 9px;">
                  Rekomendasi Kredit
                </td>
                <td style="padding: 6px; text-align: center; font-weight: bold; font-size: 10px;">
                  ${reportData.summary.recommendations || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="margin-top: 12px; text-align: center; font-size: 8px; color: #6b7280; flex-shrink: 0;">
          <p style="margin: 0;">Laporan dibuat pada: ${new Date().toLocaleString('id-ID')}</p>
        </div>
        
      </div>
    `;
  };

  // Wait for all images to load
  const waitForAllImages = (container: HTMLElement): Promise<void> => {
    const images = container.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
      if (img.complete && img.naturalHeight !== 0) {
        return Promise.resolve();
      }
      
      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 3000);
        
        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          resolve();
        };
      });
    });

    return Promise.all(promises).then(() => {});
  };

  // Alternative print method
  const downloadViaPrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Laporan A4 - ${reportData.employee || 'Collection'}</title>
            <style>
              @page { 
                size: A4; 
                margin: 3cm 4cm; 
              }
              body { 
                margin: 0; 
                padding: 0;
                font-family: Arial, sans-serif; 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                color-adjust: exact;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            ${generateA4ReportHTML()}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
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
            Sistem Laporan A4 Standard
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Platform dengan padding standar A4 (3cm top/bottom, 4cm left/right) untuk hasil download yang presisi
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">A4 Standard</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Padding 3:4</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">794x1123px</span>
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
                <p className="text-slate-300 mt-2">Isi form di bawah untuk membuat laporan A4 standard</p>
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
                  Preview Laporan A4
                </h2>
                <p className="text-slate-600">Download dengan padding standar A4: 3cm top/bottom, 4cm left/right</p>
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
                      <span className="hidden sm:inline">Download A4 PNG</span>
                      <span className="sm:hidden">A4 PNG</span>
                    </>
                  )}
                </Button>

                <Button 
                  onClick={downloadViaPrint}
                  disabled={isDownloading}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg h-12 px-6 font-semibold transition-all duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Print A4</span>
                  <span className="sm:hidden">Print</span>
                </Button>
              </div>
            </div>

            {/* A4 Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Standar A4 Professional</h4>
                  <p className="text-blue-700 text-sm">
                    Download menggunakan ukuran A4 standar (794x1123px) dengan padding profesional:
                    <br />• <strong>Top/Bottom:</strong> 3cm (113px) - Standar margin atas/bawah
                    <br />• <strong>Left/Right:</strong> 4cm (151px) - Standar margin kiri/kanan  
                    <br />• <strong>Content Area:</strong> 492x897px - Area konten optimal
                    <br />• <strong>Scale:</strong> 2x untuk kualitas tinggi
                  </p>
                </div>
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
                  <span className="text-sm font-medium text-slate-600">Preview Mode - A4 Standard (794x1123px)</span>
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