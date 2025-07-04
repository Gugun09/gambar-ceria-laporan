import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { Download, FileText, CheckCircle2, Zap, Shield, FileImage, Printer } from 'lucide-react';
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
        description: "Menyiapkan konten dengan format yang sesuai referensi."
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
            td, th {
              text-align: center !important;
              vertical-align: middle !important;
            }
            .a4-container {
              width: ${A4_CONFIG.width}px !important;
              height: ${A4_CONFIG.height}px !important;
              padding: 40px 60px !important;
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
      description: `File PNG A4 berhasil didownload (~${fileSizeKB}KB) sesuai referensi.`
    });
  };

  // Create A4 standard element with proper padding - MATCHING REFERENCE IMAGE EXACTLY
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
      padding: 40px 60px;
      box-sizing: border-box;
      overflow: hidden;
    `;

    element.innerHTML = generateA4ReportHTML();
    return element;
  };

  // Generate A4 optimized report HTML - MATCHING REFERENCE IMAGE EXACTLY
  const generateA4ReportHTML = (): string => {
    const itemsHTML = reportData.items.length > 0 
      ? reportData.items.map((item, index) => `
          <tr style="border: 2px solid #374151;">
            <td style="border: 2px solid #374151; text-align: center; background: white; vertical-align: middle; width: 50%; height: 200px;">
              <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <div style="font-size: 96px; font-weight: bold; color: #1d4ed8; line-height: 1; font-family: Arial, sans-serif;">
                  ${item.quantity || '0'}
                </div>
              </div>
            </td>
            <td style="border: 2px solid #374151; text-align: center; background: white; vertical-align: middle; width: 50%; height: 200px;">
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 16px;">
                ${item.image ? `
                  <img
                    src="${item.image}"
                    alt="Item ${index + 1}"
                    style="max-width: 180px; max-height: 160px; object-fit: contain;"
                    crossorigin="anonymous"
                  />
                ` : `
                  <div style="width: 180px; height: 160px; background: #f3f4f6; border: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 14px;">
                    No Image
                  </div>
                `}
              </div>
            </td>
          </tr>
        `).join('')
      : `
          <tr style="border: 2px solid #374151;">
            <td style="border: 2px solid #374151; text-align: center; background: white; vertical-align: middle; height: 200px;">
              <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <div style="font-size: 96px; font-weight: bold; color: #1d4ed8; line-height: 1; font-family: Arial, sans-serif;">0</div>
              </div>
            </td>
            <td style="border: 2px solid #374151; text-align: center; background: white; vertical-align: middle; height: 200px;">
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding: 16px;">
                <div style="width: 180px; height: 160px; background: #f3f4f6; border: 1px solid #d1d5db; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 14px;">
                  No Image
                </div>
              </div>
            </td>
          </tr>
        `;

    return `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; font-family: Arial, sans-serif;">
        
        <!-- Header - EXACTLY MATCHING REFERENCE -->
        <div style="text-align: center; margin-bottom: 32px;">
          <!-- Blue Header Bar -->
          <div style="background: #1d4ed8; color: white; padding: 16px 24px; margin-bottom: 24px; border-radius: 8px;">
            <h1 style="font-size: 24px; font-weight: bold; margin: 0; line-height: 1.2; font-family: Arial, sans-serif;">
              ${reportData.title}
            </h1>
          </div>
          
          <!-- Company Info -->
          <div style="color: #374151; margin-bottom: 24px; font-family: Arial, sans-serif;">
            <p style="font-weight: 500; font-size: 16px; margin: 4px 0;">${reportData.address}</p>
            <p style="font-weight: 500; font-size: 16px; margin: 4px 0;">${reportData.company}</p>
          </div>
          
          <!-- Horizontal Line -->
          <div style="border-bottom: 2px solid #6b7280; margin-bottom: 24px;"></div>
        </div>

        <!-- Report Info - MATCHING REFERENCE FORMAT -->
        <div style="margin-bottom: 32px; font-size: 16px; font-family: Arial, sans-serif;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="font-weight: 700; color: #1d4ed8; min-width: 96px; font-family: Arial, sans-serif;">Periode</span>
            <span style="margin: 0 12px; font-weight: 700; font-family: Arial, sans-serif;">:</span>
            <span style="font-family: Arial, sans-serif;">${reportData.period}</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 24px;">
            <span style="font-weight: 700; color: #1d4ed8; min-width: 96px; font-family: Arial, sans-serif;">Karyawan</span>
            <span style="margin: 0 12px; font-weight: 700; font-family: Arial, sans-serif;">:</span>
            <span style="font-family: Arial, sans-serif;">${reportData.employee}</span>
          </div>
        </div>

        <!-- Main Table - EXACTLY MATCHING REFERENCE -->
        <div style="margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #374151;">
            <thead>
              <tr style="background: #1d4ed8; color: white;">
                <th style="border: 2px solid #374151; padding: 16px; text-align: center; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">
                  Jumlah Cash Pick Up (NOA)
                </th>
                <th style="border: 2px solid #374151; padding: 16px; text-align: center; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">
                  Foto (Struk Terakhir)
                </th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
        </div>

        <!-- Summary Table - EXACTLY MATCHING REFERENCE -->
        <div style="margin-top: 32px;">
          <table style="width: 100%; border-collapse: collapse; border: 2px solid #374151;">
            <tbody>
              <tr style="background: #1d4ed8; color: white; border: 2px solid #374151;">
                <td style="border: 2px solid #374151; padding: 16px; font-weight: bold; text-align: center; font-size: 16px; font-family: Arial, sans-serif;">
                  Pembukaan Tabungan (NOA)
                </td>
                <td style="border: 2px solid #374151; padding: 16px; text-align: center; font-weight: bold; font-size: 24px; font-family: Arial, sans-serif;">
                  ${reportData.summary.total || '1'}
                </td>
              </tr>
              <tr style="background: #1d4ed8; color: white; border: 2px solid #374151;">
                <td style="border: 2px solid #374151; padding: 16px; font-weight: bold; text-align: center; font-size: 16px; font-family: Arial, sans-serif;">
                  Pembukaan Deposit (NOA)
                </td>
                <td style="border: 2px solid #374151; padding: 16px; text-align: center; font-weight: bold; font-size: 24px; font-family: Arial, sans-serif;">
                  ${reportData.summary.deposits || '0'}
                </td>
              </tr>
              <tr style="background: #1d4ed8; color: white; border: 2px solid #374151;">
                <td style="border: 2px solid #374151; padding: 16px; font-weight: bold; text-align: center; font-size: 16px; font-family: Arial, sans-serif;">
                  Rekomendasi Kredit
                </td>
                <td style="border: 2px solid #374151; padding: 16px; text-align: center; font-weight: bold; font-size: 24px; font-family: Arial, sans-serif;">
                  ${reportData.summary.recommendations || '0'}
                </td>
              </tr>
            </tbody>
          </table>
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
              td, th {
                text-align: center !important;
                vertical-align: middle !important;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Professional Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl mb-8 shadow-xl">
            <FileText className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent mb-6">
            Professional Report System
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Sistem laporan profesional dengan format yang sesuai referensi. 
            <br />
            <span className="font-semibold text-blue-700">Layout dan styling yang presisi untuk hasil yang sempurna</span>
          </p>

          {/* Professional Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Format Referensi</h3>
              <p className="text-sm text-slate-600">Layout sesuai dengan gambar referensi yang diberikan</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Styling Presisi</h3>
              <p className="text-sm text-slate-600">Warna, font, dan ukuran yang tepat</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Print Ready</h3>
              <p className="text-sm text-slate-600">Siap cetak dengan kualitas tinggi</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="form" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-2 bg-white shadow-lg border border-slate-200 h-14 p-1 rounded-2xl">
              <TabsTrigger 
                value="form" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white font-semibold transition-all duration-300 rounded-xl"
              >
                <FileText className="w-4 h-4 mr-2" />
                Form Input
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white font-semibold transition-all duration-300 rounded-xl"
              >
                <FileImage className="w-4 h-4 mr-2" />
                Preview & Download
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="form" className="space-y-6">
            <Card className="bg-white shadow-xl border border-slate-200 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  Input Data Laporan
                </h2>
                <p className="text-blue-100 mt-3 text-lg">Lengkapi form di bawah untuk membuat laporan sesuai referensi</p>
              </div>
              <div className="p-8">
                <ReportForm reportData={reportData} setReportData={setReportData} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent mb-3">
                  Preview Laporan
                </h2>
                <p className="text-lg text-slate-600">Download dengan format sesuai referensi</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Format Referensi</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Layout Presisi</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Styling Akurat</span>
                </div>
              </div>
              
              {/* Professional Download Options */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={downloadAsPNG}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl h-14 px-8 font-bold transition-all duration-300 rounded-2xl"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FileImage className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="text-sm font-bold">Download PNG</div>
                        <div className="text-xs opacity-90">Sesuai Referensi</div>
                      </div>
                    </>
                  )}
                </Button>

                <Button 
                  onClick={downloadViaPrint}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-slate-950 text-white shadow-xl h-14 px-8 font-bold transition-all duration-300 rounded-2xl"
                >
                  <Printer className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-bold">Print</div>
                    <div className="text-xs opacity-90">Direct Print</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Professional Info Panel */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900 mb-3">Format Sesuai Referensi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                    <div>
                      <h5 className="font-semibold mb-2">🎨 Visual Elements</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Header:</strong> Blue bar dengan title</li>
                        <li>• <strong>Layout:</strong> Company info + line</li>
                        <li>• <strong>Colors:</strong> Blue theme matching</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold mb-2">📊 Table Structure</h5>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Numbers:</strong> Large blue font (96px)</li>
                        <li>• <strong>Images:</strong> 180x160px container</li>
                        <li>• <strong>Summary:</strong> Blue background rows</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white/70 rounded-xl">
                    <p className="text-sm text-blue-700">
                      <strong>🎯 Output:</strong> File PNG dengan layout dan styling yang persis sama dengan gambar referensi yang Anda berikan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="bg-white shadow-2xl border border-slate-200 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 border-b border-slate-300">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Preview Mode</span>
                    <span className="text-slate-600 ml-2">Format Referensi • Layout Presisi</span>
                  </div>
                </div>
              </div>
              <div className="p-2 sm:p-4 lg:p-8 bg-slate-50">
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