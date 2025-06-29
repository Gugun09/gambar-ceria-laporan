import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { Download, FileText, CheckCircle2, Zap, Shield, FileImage } from 'lucide-react';
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
    quantity: string; // Changed to string
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

  // Download PNG using html2canvas - same as preview
  const downloadAsPNG = async () => {
    setIsDownloading(true);
    try {
      toast.info("Memproses laporan PNG...", {
        description: "Sedang menggenerate file PNG dengan foto dan font yang lebih besar."
      });

      const element = document.getElementById('report-preview');
      if (!element) {
        throw new Error('Report preview element not found');
      }

      // Create a temporary container with fixed A4 dimensions for download
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px';
      tempContainer.style.height = '1123px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      
      // Clone the preview element
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Reset any responsive scaling for download
      clonedElement.style.width = '794px';
      clonedElement.style.height = '1123px';
      clonedElement.style.maxWidth = 'none';
      clonedElement.style.transform = 'none';
      clonedElement.style.transformOrigin = 'none';
      
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Wait for images to load
      const images = tempContainer.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          // Set a timeout to avoid hanging
          setTimeout(resolve, 3000);
        });
      }));

      // Generate canvas with high quality settings
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794,
        windowHeight: 1123,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the cloned document
          const clonedContainer = clonedDoc.querySelector('[id="report-preview"]');
          if (clonedContainer) {
            // Force specific styles for download consistency
            (clonedContainer as HTMLElement).style.width = '794px';
            (clonedContainer as HTMLElement).style.height = '1123px';
            (clonedContainer as HTMLElement).style.maxWidth = 'none';
            (clonedContainer as HTMLElement).style.transform = 'none';
          }
        }
      });

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      // Download the image
      const link = document.createElement('a');
      link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();

      toast.success("Download PNG berhasil!", {
        description: "Laporan dengan foto dan font yang lebih besar telah berhasil didownload."
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
                /* Ensure consistent styling for print */
                #report-preview {
                  width: 794px !important;
                  height: 1123px !important;
                  max-width: none !important;
                  transform: none !important;
                }
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
                <p className="text-slate-600">Lihat hasil laporan dengan foto dan font yang lebih besar</p>
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