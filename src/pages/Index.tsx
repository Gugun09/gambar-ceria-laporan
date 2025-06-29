
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-2 flex-wrap">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="break-words">Sistem Laporan Dinamis</span>
          </h1>
          <p className="text-blue-700 text-sm sm:text-base lg:text-lg break-words px-2">
            Buat, Preview, dan Download Laporan dalam Format PNG
          </p>
        </div>

        <Tabs defaultValue="form" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/70 backdrop-blur-sm mx-2 sm:mx-0">
            <TabsTrigger 
              value="form" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
            >
              Form Input
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm"
            >
              Preview & Download
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4 sm:space-y-6 mx-2 sm:mx-0">
            <Card className="p-3 sm:p-6 shadow-lg bg-white/80 backdrop-blur-sm">
              <ReportForm reportData={reportData} setReportData={setReportData} />
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 sm:space-y-6 mx-2 sm:mx-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-900">Preview Laporan</h2>
              <Button 
                onClick={downloadReport}
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg w-full sm:w-auto"
                size="lg"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Download PNG (A4)</span>
              </Button>
            </div>
            
            <div className="bg-white p-2 sm:p-4 lg:p-8 rounded-lg shadow-2xl overflow-hidden">
              <ReportPreview reportData={reportData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
