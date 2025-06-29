import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportForm from '@/components/ReportForm';
import ReportPreview from '@/components/ReportPreview';
import { Download, FileText } from 'lucide-react';
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

  const downloadReport = async () => {
    const element = document.getElementById('report-preview');
    if (element) {
      try {
        // Set A4 dimensions in pixels (at 300 DPI)
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794, // A4 width at 96 DPI
          height: 1123, // A4 height at 96 DPI
        });
        
        const link = document.createElement('a');
        link.download = `laporan-${reportData.employee || 'collection'}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating PNG:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8 px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-2 flex-wrap">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex-shrink-0" />
            <span className="break-words leading-tight">Sistem Laporan Dinamis</span>
          </h1>
          <p className="text-blue-700 text-xs sm:text-sm md:text-base lg:text-lg break-words px-2 leading-relaxed">
            Buat, Preview, dan Download Laporan dalam Format PNG
          </p>
        </div>

        <Tabs defaultValue="form" className="space-y-3 sm:space-y-4 lg:space-y-6">
          <div className="px-2 sm:px-0">
            <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm h-10 sm:h-12">
              <TabsTrigger 
                value="form" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm md:text-base px-2 py-1"
              >
                <span className="hidden sm:inline">Form Input</span>
                <span className="sm:hidden">Form</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm md:text-base px-2 py-1"
              >
                <span className="hidden sm:inline">Preview & Download</span>
                <span className="sm:hidden">Preview</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="form" className="space-y-3 sm:space-y-4 lg:space-y-6 px-2 sm:px-0">
            <Card className="p-3 sm:p-4 lg:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
              <ReportForm reportData={reportData} setReportData={setReportData} />
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-3 sm:space-y-4 lg:space-y-6 px-2 sm:px-0">
            <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:justify-between lg:items-center">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-900 break-words">
                Preview Laporan
              </h2>
              <Button 
                onClick={downloadReport}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg w-full lg:w-auto min-h-[44px] sm:min-h-[48px]"
                size="lg"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base whitespace-nowrap">Download PNG (A4)</span>
              </Button>
            </div>
            
            <div className="bg-white p-1 sm:p-2 lg:p-4 xl:p-8 rounded-lg shadow-2xl overflow-hidden">
              <ReportPreview reportData={reportData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;