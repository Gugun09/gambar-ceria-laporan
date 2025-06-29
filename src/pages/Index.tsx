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

  // Enhanced download function with dynamic height calculation
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      toast.info("🔄 Memproses laporan PNG...", {
        description: "Menghitung ukuran optimal dan menggenerate file PNG berkualitas tinggi."
      });

      // Create a dedicated download container with dynamic height
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

      // Create the report content for download
      const reportContent = createDownloadContent(reportData);
      downloadContainer.innerHTML = reportContent;
      
      document.body.appendChild(downloadContainer);

      // Wait for images to load and calculate actual height
      await waitForImages(downloadContainer);
      
      // Calculate the actual content height
      const actualHeight = Math.max(downloadContainer.scrollHeight, 1123);
      downloadContainer.style.height = `${actualHeight}px`;

      // Small delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 800));

      toast.info("📸 Mengambil screenshot...", {
        description: "Sedang menggenerate gambar dengan resolusi tinggi."
      });

      // Generate canvas with dynamic height
      const canvas = await html2canvas(downloadContainer, {
        width: 794,
        height: actualHeight,
        scale: 2, // High DPI for quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: actualHeight,
        logging: false,
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 5000,
        onclone: (clonedDoc, element) => {
          // Force styles in cloned document
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
            .report-container {
              width: 794px !important;
              background: white !important;
              overflow: visible !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Clean up
      document.body.removeChild(downloadContainer);

      // Download the image
      const link = document.createElement('a');
      link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("✅ Download PNG berhasil!", {
        description: `Laporan berhasil didownload dengan ukuran ${canvas.width}x${canvas.height}px.`
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

  // Function to create download-optimized content
  const createDownloadContent = (data: ReportData) => {
    const itemsHtml = data.items.length > 0 
      ? data.items.map((item, index) => `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 32px; text-align: center; background: white; vertical-align: middle;">
              <div style="font-size: 120px; font-weight: bold; color: #2563eb; margin-bottom: 12px; line-height: 1;">
                ${item.quantity || '-'}
              </div>
            </td>
            <td style="padding: 32px; text-align: center; background: white; vertical-align: middle;">
              ${item.image ? `
                <div style="display: flex; justify-content: center; align-items: center;">
                  <img
                    src="${item.image}"
                    alt="Item ${index + 1}"
                    style="max-width: 100%; max-height: 350px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #d1d5db;"
                  />
                </div>
              ` : `
                <div style="width: 100%; height: 350px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 16px; border: 1px solid #d1d5db;">
                  No Image
                </div>
              `}
            </td>
          </tr>
        `).join('')
      : `
          <tr style="border-bottom: 1px solid #d1d5db;">
            <td style="border-right: 1px solid #d1d5db; padding: 32px; text-align: center; background: white; vertical-align: middle;">
              <div style="font-size: 120px; font-weight: bold; color: #2563eb; margin-bottom: 12px; line-height: 1;">-</div>
              <div style="font-size: 16px; color: #6b7280;">No items</div>
            </td>
            <td style="padding: 32px; text-align: center; background: white; vertical-align: middle;">
              <div style="width: 100%; height: 350px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 16px; border: 1px solid #d1d5db;">
                No Image
              </div>
            </td>
          </tr>
        `;

    return `
      <div class="report-container" style="width: 794px; background: white; padding: 40px; box-sizing: border-box; font-family: Arial, sans-serif; overflow: visible;">
        
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
          <div style="box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden; border: 1px solid #d1d5db;">
            <table style="width: 100%; border-collapse: collapse;">
              <!-- Table Header -->
              <thead>
                <tr style="background: #2563eb; color: white;">
                  <th style="border-right: 1px solid #6b7280; padding: 16px; text-align: center; font-weight: 600; font-size: 18px;">
                    Jumlah Cash Pick Up (NOA)
                  </th>
                  <th style="padding: 16px; text-align: center; font-weight: 600; font-size: 18px;">
                    Foto (Struk Terakhir)
                  </th>
                </tr>
              </thead>
              
              <!-- Table Body -->
              <tbody>
                ${itemsHtml}
                
                <!-- Summary Rows -->
                <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                  <td style="border-right: 1px solid #6b7280; padding: 16px; font-weight: 600; text-align: left; font-size: 16px;">
                    Pembukaan Tabungan (NOA)
                  </td>
                  <td style="padding: 16px; text-align: center; font-weight: bold; font-size: 20px;">
                    ${data.summary.total || '-'}
                  </td>
                </tr>
                <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                  <td style="border-right: 1px solid #6b7280; padding: 16px; font-weight: 600; text-align: left; font-size: 16px;">
                    Pembukaan Deposit (NOA)
                  </td>
                  <td style="padding: 16px; text-align: center; font-weight: bold; font-size: 20px;">
                    ${data.summary.deposits || '-'}
                  </td>
                </tr>
                <tr style="background: #2563eb; color: white; border-top: 1px solid #6b7280;">
                  <td style="border-right: 1px solid #6b7280; padding: 16px; font-weight: 600; text-align: left; font-size: 16px;">
                    Rekomendasi Kredit
                  </td>
                  <td style="padding: 16px; text-align: center; font-weight: bold; font-size: 20px;">
                    ${data.summary.recommendations || '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Section -->
        <div style="margin-top: 48px; text-align: center; font-size: 14px; color: #6b7280;">
          <p style="margin: 0;">Laporan dibuat pada: ${new Date().toLocaleString('id-ID')}</p>
        </div>
        
      </div>
    `;
  };

  // Function to wait for all images to load
  const waitForImages = (container: HTMLElement): Promise<void> => {
    const images = container.querySelectorAll('img');
    const promises = Array.from(images).map(img => {
      if (img.complete && img.naturalHeight !== 0) {
        return Promise.resolve();
      }
      
      return new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          console.warn('Image load timeout:', img.src);
          resolve();
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          console.warn('Image load error:', img.src);
          resolve();
        };
      });
    });

    return Promise.all(promises).then(() => {});
  };

  // Alternative download method using print-to-PDF approach
  const downloadViaPrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const reportContent = createDownloadContent(reportData);
      
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
              .report-container {
                width: 794px;
                background: white;
                overflow: visible;
              }
              table {
                border-collapse: collapse;
                width: 100%;
              }
              img {
                max-width: 100%;
                height: auto;
              }
              .no-print { 
                display: none !important; 
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
              <span className="text-sm font-medium text-slate-700">Cepat & Mudah</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-slate-700">Tidak Terpotong</span>
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
                <p className="text-slate-600">Hasil download akan persis sama dengan preview - tidak terpotong</p>
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
                  <h4 className="font-semibold text-blue-900 mb-1">Download Responsif & Tidak Terpotong</h4>
                  <p className="text-blue-700 text-sm">
                    Sistem otomatis menghitung tinggi konten dan menyesuaikan ukuran download agar semua konten termasuk gambar tidak terpotong.
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
                  <span className="text-sm font-medium text-slate-600">Preview Mode - Foto dan font diperbesar</span>
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