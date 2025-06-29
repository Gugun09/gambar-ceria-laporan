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

  // Optimized download function with proper sizing
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      toast.info("🔄 Memproses laporan PNG...", {
        description: "Mengoptimalkan ukuran dan kualitas gambar."
      });

      // Create optimized download container
      const downloadContainer = document.createElement('div');
      downloadContainer.style.cssText = `
        position: fixed;
        top: -20000px;
        left: -20000px;
        width: 794px;
        background: white;
        font-family: Arial, sans-serif;
        overflow: visible;
        z-index: -1;
        box-sizing: border-box;
      `;

      // Create optimized report content
      const reportContent = createOptimizedContent(reportData);
      downloadContainer.innerHTML = reportContent;
      
      document.body.appendChild(downloadContainer);

      // Wait for images and calculate optimal height
      await waitForImages(downloadContainer);
      
      // Calculate content height with proper margins
      const contentHeight = calculateOptimalHeight(downloadContainer);
      downloadContainer.style.height = `${contentHeight}px`;

      // Small delay for rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.info("📸 Menggenerate PNG...", {
        description: "Membuat file dengan ukuran optimal."
      });

      // Generate canvas with optimized settings
      const canvas = await html2canvas(downloadContainer, {
        width: 794,
        height: contentHeight,
        scale: 1.5, // Reduced scale for smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: contentHeight,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 3000, // Reduced timeout
        onclone: (clonedDoc, element) => {
          // Optimize cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              width: 794px !important;
              overflow: visible !important;
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

      // Clean up
      document.body.removeChild(downloadContainer);

      // Convert to optimized PNG
      const optimizedDataUrl = canvas.toDataURL('image/png', 0.9); // Slight compression
      
      // Download the image
      const link = document.createElement('a');
      link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = optimizedDataUrl;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Calculate file size for user info
      const fileSizeKB = Math.round((optimizedDataUrl.length * 0.75) / 1024);

      toast.success("✅ Download PNG berhasil!", {
        description: `File berhasil didownload (${canvas.width}x${canvas.height}px, ~${fileSizeKB}KB).`
      });
    } catch (error) {
      console.error('Error generating PNG:', error);
      toast.error("❌ Download PNG gagal!", {
        description: "Terjadi kesalahan saat menggenerate laporan PNG. Silakan coba lagi."
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Calculate optimal height based on content
  const calculateOptimalHeight = (container: HTMLElement): number => {
    const baseHeight = 600; // Header + basic content
    const itemHeight = 400; // Height per item row
    const summaryHeight = 200; // Summary section height
    const footerHeight = 100; // Footer height
    const padding = 80; // Top and bottom padding
    
    const itemCount = reportData.items.length || 1; // At least 1 row for "no items"
    
    return baseHeight + (itemCount * itemHeight) + summaryHeight + footerHeight + padding;
  };

  // Create optimized content for download
  const createOptimizedContent = (data: ReportData) => {
    const itemsHtml = data.items.length > 0 
      ? data.items.map((item, index) => `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 24px; text-align: center; background: white; vertical-align: middle;">
              <div style="font-size: 72px; font-weight: bold; color: #2563eb; margin-bottom: 8px; line-height: 1;">
                ${item.quantity || '-'}
              </div>
            </td>
            <td style="padding: 24px; text-align: center; background: white; vertical-align: middle;">
              ${item.image ? `
                <div style="display: flex; justify-content: center; align-items: center;">
                  <img
                    src="${item.image}"
                    alt="Item ${index + 1}"
                    style="max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 6px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border: 1px solid #d1d5db;"
                  />
                </div>
              ` : `
                <div style="width: 100%; height: 250px; background: #f3f4f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 14px; border: 1px solid #d1d5db;">
                  No Image
                </div>
              `}
            </td>
          </tr>
        `).join('')
      : `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 24px; text-align: center; background: white; vertical-align: middle;">
              <div style="font-size: 72px; font-weight: bold; color: #2563eb; margin-bottom: 8px; line-height: 1;">-</div>
              <div style="font-size: 14px; color: #6b7280;">No items</div>
            </td>
            <td style="padding: 24px; text-align: center; background: white; vertical-align: middle;">
              <div style="width: 100%; height: 250px; background: #f3f4f6; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 14px; border: 1px solid #d1d5db;">
                No Image
              </div>
            </td>
          </tr>
        `;

    return `
      <div style="width: 794px; background: white; padding: 40px; box-sizing: border-box; font-family: Arial, sans-serif; overflow: visible;">
        
        <!-- Header Section -->
        <div style="text-center; margin-bottom: 32px; border-bottom: 4px solid #2563eb; padding-bottom: 24px;">
          <h1 style="font-size: 24px; font-weight: bold; color: #1e3a8a; margin-bottom: 16px; line-height: 1.2; margin-top: 0;">
            ${data.title}
          </h1>
          <div style="color: #1d4ed8; line-height: 1.4;">
            <p style="font-weight: 600; font-size: 16px; margin: 4px 0;">${data.address}</p>
            <p style="font-weight: 600; font-size: 16px; margin: 4px 0;">${data.company}</p>
          </div>
        </div>

        <!-- Report Info Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; font-size: 14px;">
          <div>
            <div style="margin-bottom: 4px; font-weight: 600; color: #1e3a8a;">Periode :</div>
            <div>${data.period}</div>
          </div>
          <div>
            <div style="margin-bottom: 4px; font-weight: 600; color: #1e3a8a;">Karyawan :</div>
            <div>${data.employee}</div>
          </div>
        </div>

        <!-- Main Table Section -->
        <div style="margin-bottom: 32px;">
          <div style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden; border: 1px solid #d1d5db;">
            <table style="width: 100%; border-collapse: collapse;">
              <!-- Table Header -->
              <thead>
                <tr style="background: #2563eb; color: white;">
                  <th style="border-right: 1px solid #6b7280; padding: 16px; text-align: center; font-weight: 600; font-size: 16px;">
                    Jumlah Cash Pick Up (NOA)
                  </th>
                  <th style="padding: 16px; text-align: center; font-weight: 600; font-size: 16px;">
                    Foto (Struk Terakhir)
                  </th>
                </tr>
              </thead>
              
              <!-- Table Body -->
              <tbody>
                ${itemsHtml}
                
                <!-- Summary Rows -->
                <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                  <td style="border-right: 1px solid #6b7280; padding: 16px; font-weight: 600; text-align: left; font-size: 14px;">
                    Pembukaan Tabungan (NOA)
                  </td>
                  <td style="padding: 16px; text-align: center; font-weight: bold; font-size: 18px;">
                    ${data.summary.total || '-'}
                  </td>
                </tr>
                <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                  <td style="border-right: 1px solid #6b7280; padding: 16px; font-weight: 600; text-align: left; font-size: 14px;">
                    Pembukaan Deposit (NOA)
                  </td>
                  <td style="padding: 16px; text-align: center; font-weight: bold; font-size: 18px;">
                    ${data.summary.deposits || '-'}
                  </td>
                </tr>
                <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                  <td style="border-right: 1px solid #6b7280; padding: 16px; font-weight: 600; text-align: left; font-size: 14px;">
                    Rekomendasi Kredit
                  </td>
                  <td style="padding: 16px; text-align: center; font-weight: bold; font-size: 18px;">
                    ${data.summary.recommendations || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="margin-top: 32px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">Laporan dibuat pada: ${new Date().toLocaleString('id-ID')}</p>
        </div>
        
      </div>
    `;
  };

  // Optimized image loading function
  const waitForImages = (container: HTMLElement): Promise<void> => {
    const images = container.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
      if (img.complete && img.naturalHeight !== 0) {
        return Promise.resolve();
      }
      
      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          resolve();
        }, 3000); // Reduced timeout

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
      const reportContent = createOptimizedContent(reportData);
      
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
            ${reportContent}
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
              <span className="text-sm font-medium text-slate-700">Ukuran Optimal</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Kualitas Tinggi</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-slate-700">Responsif</span>
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
                <p className="text-slate-600">Download dengan ukuran optimal - tidak terlalu besar</p>
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
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Download Ukuran Optimal</h4>
                  <p className="text-blue-700 text-sm">
                    Sistem mengoptimalkan ukuran file PNG agar tidak terlalu besar namun tetap berkualitas tinggi. 
                    Ukuran file sekitar 200-800KB tergantung jumlah item dan gambar.
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
                  <span className="text-sm font-medium text-slate-600">Preview Mode - Ukuran optimal untuk download</span>
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