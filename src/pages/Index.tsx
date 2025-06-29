import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { Download, FileText, Sparkles, Zap, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
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

  const downloadReport = async () => {
    const element = document.getElementById('report-preview');
    if (element) {
      setIsDownloading(true);
      try {
        toast.info("Memproses laporan...", {
          description: "Sedang menggenerate file PNG, mohon tunggu sebentar."
        });

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123,
        });
        
        const link = document.createElement('a');
        link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        toast.success("Download berhasil!", {
          description: "Laporan telah berhasil didownload dalam format PNG.",
          action: {
            label: "OK",
            onClick: () => {}
          }
        });
      } catch (error) {
        console.error('Error generating PNG:', error);
        toast.error("Download gagal!", {
          description: "Terjadi kesalahan saat menggenerate laporan. Silakan coba lagi."
        });
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-xl shadow-blue-500/25 animate-bounce">
              <FileText className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight">
              Sistem Laporan
              <span className="block">Dinamis</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Platform modern untuk membuat, melihat preview, dan mendownload laporan profesional dalam format PNG
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-slate-700">Cepat & Mudah</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-slate-700">Desain Modern</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-slate-700">Kualitas Tinggi</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="form" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/80 backdrop-blur-sm shadow-xl border border-white/20 h-14 p-1 rounded-2xl">
                <TabsTrigger 
                  value="form" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-300"
                >
                  <span className="hidden sm:inline">📝 Form Input</span>
                  <span className="sm:hidden">📝 Form</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-medium transition-all duration-300"
                >
                  <span className="hidden sm:inline">👁️ Preview</span>
                  <span className="sm:hidden">👁️ View</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="form" className="space-y-6 animate-in fade-in-50 duration-500">
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20 rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      📋
                    </div>
                    Input Data Laporan
                  </h2>
                  <p className="text-blue-100 mt-2">Isi form di bawah untuk membuat laporan Anda</p>
                </div>
                <div className="p-6 sm:p-8">
                  <ReportForm reportData={reportData} setReportData={setReportData} />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Preview Laporan
                  </h2>
                  <p className="text-slate-600">Lihat hasil laporan sebelum didownload</p>
                </div>
                
                <Button 
                  onClick={downloadReport}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl shadow-green-500/25 rounded-2xl h-14 px-8 font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  size="lg"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-3" />
                      <span>Download PNG (A4)</span>
                    </>
                  )}
                </Button>
              </div>
              
              <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20 rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600">Preview Mode</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <ReportPreview reportData={reportData} />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;