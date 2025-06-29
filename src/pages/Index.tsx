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

  // Robust download function with multiple fallbacks
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    
    try {
      toast.info("🔄 Memproses laporan...", {
        description: "Menyiapkan konten untuk download."
      });

      // Method 1: Try using existing preview element first
      const existingElement = document.getElementById('report-preview');
      if (existingElement) {
        try {
          const canvas = await html2canvas(existingElement, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: 794,
            height: Math.max(1123, existingElement.scrollHeight),
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794,
            windowHeight: Math.max(1123, existingElement.scrollHeight),
            imageTimeout: 5000,
            removeContainer: false,
            foreignObjectRendering: false
          });

          if (canvas && canvas.width > 0 && canvas.height > 0) {
            const dataUrl = canvas.toDataURL('image/png', 0.9);
            
            // Verify the canvas is not blank
            if (dataUrl && dataUrl.length > 1000) {
              downloadImage(dataUrl, 'existing-element');
              return;
            }
          }
        } catch (error) {
          console.warn('Method 1 failed, trying method 2:', error);
        }
      }

      // Method 2: Create dedicated download element
      toast.info("📋 Membuat konten download...", {
        description: "Menggunakan metode alternatif."
      });

      const downloadElement = createDownloadElement();
      document.body.appendChild(downloadElement);

      // Wait for rendering and images
      await new Promise(resolve => setTimeout(resolve, 1000));
      await waitForAllImages(downloadElement);

      const canvas = await html2canvas(downloadElement, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: downloadElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: downloadElement.scrollHeight,
        imageTimeout: 5000,
        removeContainer: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Ensure all styles are applied
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
            }
            img {
              max-width: 100% !important;
              height: auto !important;
            }
            table {
              border-collapse: collapse !important;
              width: 100% !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      document.body.removeChild(downloadElement);

      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        
        if (dataUrl && dataUrl.length > 1000) {
          downloadImage(dataUrl, 'dedicated-element');
          return;
        }
      }

      // Method 3: Fallback to simple HTML content
      toast.info("🔄 Menggunakan metode fallback...", {
        description: "Mencoba pendekatan sederhana."
      });

      const simpleElement = createSimpleDownloadElement();
      document.body.appendChild(simpleElement);

      await new Promise(resolve => setTimeout(resolve, 500));

      const simpleCanvas = await html2canvas(simpleElement, {
        scale: 1,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: false,
        allowTaint: false
      });

      document.body.removeChild(simpleElement);

      if (simpleCanvas && simpleCanvas.width > 0 && simpleCanvas.height > 0) {
        const dataUrl = simpleCanvas.toDataURL('image/png', 0.9);
        downloadImage(dataUrl, 'simple-fallback');
        return;
      }

      throw new Error('All download methods failed');

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
    link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const fileSizeKB = Math.round((dataUrl.length * 0.75) / 1024);
    
    toast.success("✅ Download berhasil!", {
      description: `File PNG berhasil didownload (~${fileSizeKB}KB) menggunakan ${method}.`
    });
  };

  // Create dedicated download element
  const createDownloadElement = (): HTMLElement => {
    const element = document.createElement('div');
    element.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: 794px;
      background: white;
      font-family: Arial, sans-serif;
      z-index: -1;
      padding: 30px;
      box-sizing: border-box;
    `;

    element.innerHTML = generateReportHTML();
    return element;
  };

  // Create simple fallback element
  const createSimpleDownloadElement = (): HTMLElement => {
    const element = document.createElement('div');
    element.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: 794px;
      background: white;
      font-family: Arial, sans-serif;
      z-index: -1;
      padding: 30px;
      box-sizing: border-box;
    `;

    // Simple HTML without complex styling
    element.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px solid #2563eb; padding-bottom: 15px;">
        <h1 style="font-size: 18px; font-weight: bold; color: #1e3a8a; margin: 0 0 12px 0;">
          ${reportData.title}
        </h1>
        <p style="color: #1d4ed8; font-size: 12px; margin: 2px 0;">${reportData.address}</p>
        <p style="color: #1d4ed8; font-size: 12px; margin: 2px 0;">${reportData.company}</p>
      </div>

      <div style="margin-bottom: 20px; font-size: 10px;">
        <p><strong>Periode:</strong> ${reportData.period}</p>
        <p><strong>Karyawan:</strong> ${reportData.employee}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #2563eb; color: white;">
            <th style="border: 1px solid #ccc; padding: 10px; font-size: 12px;">Jumlah Cash Pick Up (NOA)</th>
            <th style="border: 1px solid #ccc; padding: 10px; font-size: 12px;">Foto (Struk Terakhir)</th>
          </tr>
        </thead>
        <tbody>
          ${reportData.items.length > 0 ? reportData.items.map(item => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; color: #2563eb;">
                ${item.quantity || '-'}
              </td>
              <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">
                ${item.image ? `<div style="width: 100px; height: 80px; background: #f0f0f0; margin: 0 auto;">Image</div>` : 'No Image'}
              </td>
            </tr>
          `).join('') : `
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; color: #2563eb;">-</td>
              <td style="border: 1px solid #ccc; padding: 10px; text-align: center;">No Image</td>
            </tr>
          `}
          <tr style="background: #2563eb; color: white;">
            <td style="border: 1px solid #ccc; padding: 8px; font-size: 10px;">Pembukaan Tabungan (NOA)</td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 12px;">${reportData.summary.total || '-'}</td>
          </tr>
          <tr style="background: #2563eb; color: white;">
            <td style="border: 1px solid #ccc; padding: 8px; font-size: 10px;">Pembukaan Deposit (NOA)</td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 12px;">${reportData.summary.deposits || '-'}</td>
          </tr>
          <tr style="background: #2563eb; color: white;">
            <td style="border: 1px solid #ccc; padding: 8px; font-size: 10px;">Rekomendasi Kredit</td>
            <td style="border: 1px solid #ccc; padding: 8px; text-align: center; font-size: 12px;">${reportData.summary.recommendations || '-'}</td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: center; font-size: 9px; color: #666; margin-top: 20px;">
        <p>Laporan dibuat pada: ${new Date().toLocaleString('id-ID')}</p>
      </div>
    `;

    return element;
  };

  // Generate complete report HTML
  const generateReportHTML = (): string => {
    const itemsHTML = reportData.items.length > 0 
      ? reportData.items.map((item, index) => `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 12px; text-align: center; background: white; vertical-align: middle;">
              <div style="font-size: 36px; font-weight: bold; color: #2563eb; margin-bottom: 4px; line-height: 1;">
                ${item.quantity || '-'}
              </div>
            </td>
            <td style="padding: 12px; text-align: center; background: white; vertical-align: middle;">
              ${item.image ? `
                <img
                  src="${item.image}"
                  alt="Item ${index + 1}"
                  style="max-width: 100%; max-height: 100px; object-fit: contain; border-radius: 4px; border: 1px solid #d1d5db;"
                  crossorigin="anonymous"
                />
              ` : `
                <div style="width: 100%; height: 100px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; border: 1px solid #d1d5db;">
                  No Image
                </div>
              `}
            </td>
          </tr>
        `).join('')
      : `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 12px; text-align: center; background: white; vertical-align: middle;">
              <div style="font-size: 36px; font-weight: bold; color: #2563eb; margin-bottom: 4px; line-height: 1;">-</div>
              <div style="font-size: 10px; color: #6b7280;">No items</div>
            </td>
            <td style="padding: 12px; text-align: center; background: white; vertical-align: middle;">
              <div style="width: 100%; height: 100px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; border: 1px solid #d1d5db;">
                No Image
              </div>
            </td>
          </tr>
        `;

    return `
      <div style="width: 794px; background: white; font-family: Arial, sans-serif; overflow: visible;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px solid #2563eb; padding-bottom: 15px;">
          <h1 style="font-size: 18px; font-weight: bold; color: #1e3a8a; margin-bottom: 12px; line-height: 1.2; margin-top: 0;">
            ${reportData.title}
          </h1>
          <div style="color: #1d4ed8; line-height: 1.3;">
            <p style="font-weight: 600; font-size: 12px; margin: 2px 0;">${reportData.address}</p>
            <p style="font-weight: 600; font-size: 12px; margin: 2px 0;">${reportData.company}</p>
          </div>
        </div>

        <!-- Report Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; font-size: 10px;">
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
        <div style="margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border-radius: 6px; overflow: hidden; border: 1px solid #d1d5db;">
            <thead>
              <tr style="background: #2563eb; color: white;">
                <th style="border-right: 1px solid #6b7280; padding: 10px; text-align: center; font-weight: 600; font-size: 12px;">
                  Jumlah Cash Pick Up (NOA)
                </th>
                <th style="padding: 10px; text-align: center; font-weight: 600; font-size: 12px;">
                  Foto (Struk Terakhir)
                </th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              
              <!-- Summary -->
              <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                <td style="border-right: 1px solid #6b7280; padding: 8px; font-weight: 600; text-align: left; font-size: 10px;">
                  Pembukaan Tabungan (NOA)
                </td>
                <td style="padding: 8px; text-align: center; font-weight: bold; font-size: 12px;">
                  ${reportData.summary.total || '-'}
                </td>
              </tr>
              <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                <td style="border-right: 1px solid #6b7280; padding: 8px; font-weight: 600; text-align: left; font-size: 10px;">
                  Pembukaan Deposit (NOA)
                </td>
                <td style="padding: 8px; text-align: center; font-weight: bold; font-size: 12px;">
                  ${reportData.summary.deposits || '-'}
                </td>
              </tr>
              <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                <td style="border-right: 1px solid #6b7280; padding: 8px; font-weight: 600; text-align: left; font-size: 10px;">
                  Rekomendasi Kredit
                </td>
                <td style="padding: 8px; text-align: center; font-weight: bold; font-size: 12px;">
                  ${reportData.summary.recommendations || '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div style="margin-top: 20px; text-align: center; font-size: 9px; color: #6b7280;">
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
            <title>Laporan - ${reportData.employee || 'Collection'}</title>
            <style>
              @page { 
                size: A4; 
                margin: 0; 
              }
              body { 
                margin: 0; 
                padding: 30px;
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
            ${generateReportHTML()}
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
            Sistem Laporan Dinamis
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Platform modern untuk membuat, melihat preview, dan mendownload laporan profesional dalam format PNG
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-700">Download Robust</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Multi-Method</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Fallback System</span>
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
                <p className="text-slate-600">Download dengan sistem robust - multiple fallback methods</p>
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
                  onClick={downloadViaPrint}
                  disabled={isDownloading}
                  className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg h-12 px-6 font-semibold transition-all duration-200"
                >
                  <Download className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Print PDF</span>
                  <span className="sm:hidden">Print</span>
                </Button>
              </div>
            </div>

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Sistem Download Robust</h4>
                  <p className="text-blue-700 text-sm">
                    Sistem menggunakan 3 metode download berbeda untuk memastikan file PNG berhasil didownload:
                    <br />• Method 1: Direct preview capture
                    <br />• Method 2: Dedicated download element  
                    <br />• Method 3: Simple fallback system
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
                  <span className="text-sm font-medium text-slate-600">Preview Mode - Robust download system</span>
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