import { ReportData } from '@/pages/Index';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, MapPin, Calendar, User, Hash, Camera, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';

interface ReportPreviewProps {
  reportData: ReportData;
}

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  return (
    <div className="w-full">
      {/* Responsive Container */}
      <div className="w-full max-w-4xl mx-auto">
        {/* A4 Preview - Responsive on screen, fixed for download */}
        <div 
          id="report-preview" 
          className="bg-white mx-auto shadow-lg"
          style={{ 
            // Fixed dimensions for download (A4 at 96 DPI)
            width: '794px', 
            minHeight: '1123px',
            // Make it responsive on screen
            maxWidth: '100%',
            transform: 'scale(1)',
            transformOrigin: 'top center'
          }}
        >
          {/* Scale down on mobile for better viewing */}
          <div className="w-full h-full p-4 sm:p-6 lg:p-10">
            
            {/* Professional Header Card */}
            <Card className="mb-6 border-2 border-blue-600 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 leading-tight">
                    {reportData.title}
                  </h1>
                  <div className="space-y-1 text-sm sm:text-base opacity-90">
                    <p className="font-semibold flex items-center justify-center gap-2">
                      <Building className="w-4 h-4" />
                      {reportData.company}
                    </p>
                    <p className="font-medium flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {reportData.address}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Report Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Periode Laporan</p>
                      <p className="font-semibold text-slate-900 text-sm break-words">{reportData.period}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">Penanggung Jawab</p>
                      <p className="font-semibold text-slate-900 text-sm break-words">{reportData.employee || 'Belum diisi'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Data Table Card */}
            <Card className="mb-6 border border-slate-200 shadow-lg">
              <CardHeader className="bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Data Collection</h3>
                    <p className="text-sm text-slate-600">Detail item yang dikumpulkan</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {reportData.items.length} Item
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200">
                        <th className="text-left p-3 sm:p-4 font-semibold text-slate-700 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Jumlah (NOA)
                          </div>
                        </th>
                        <th className="text-left p-3 sm:p-4 font-semibold text-slate-700 text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Dokumentasi
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                                {item.quantity}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{item.name || `Item #${index + 1}`}</p>
                                <p className="text-xs text-slate-500">Cash Pick Up</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            {item.image ? (
                              <div className="flex justify-start">
                                <div className="relative">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-slate-200 shadow-sm"
                                  />
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <Camera className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center">
                                <div className="text-center">
                                  <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                                  <p className="text-xs text-slate-400">No Image</p>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      
                      {/* Empty state */}
                      {reportData.items.length === 0 && (
                        <tr>
                          <td colSpan={2} className="p-8 text-center">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                <Hash className="w-8 h-8 text-slate-400" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-600">Belum ada data</p>
                                <p className="text-sm text-slate-500">Tambahkan item untuk melihat data di sini</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                      <PiggyBank className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Tabungan</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.summary.total}</p>
                      <p className="text-xs text-blue-600">NOA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Deposit</p>
                      <p className="text-2xl font-bold text-green-900">{reportData.summary.deposits}</p>
                      <p className="text-xs text-green-600">NOA</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">Kredit</p>
                      <p className="text-2xl font-bold text-purple-900">{reportData.summary.recommendations}</p>
                      <p className="text-xs text-purple-600">Rekomendasi</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-6" />

            {/* Footer Card */}
            <Card className="border border-slate-200 bg-slate-50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Laporan dibuat secara otomatis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;