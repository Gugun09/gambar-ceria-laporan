import { ReportData } from '@/pages/Index';

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
          className="bg-white mx-auto"
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
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8 border-b-2 sm:border-b-4 border-blue-600 pb-4 sm:pb-6">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-2 sm:mb-4 leading-tight">
                {reportData.title}
              </h1>
              <div className="text-blue-700 space-y-1 text-sm sm:text-base">
                <p className="font-semibold">{reportData.address}</p>
                <p className="font-semibold">{reportData.company}</p>
              </div>
            </div>

            {/* Report Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8 text-xs sm:text-sm">
              <div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-900">Periode :</div>
                  <div className="break-words">{reportData.period}</div>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-900">Karyawan :</div>
                  <div className="break-words">{reportData.employee}</div>
                </div>
              </div>
            </div>

            {/* Unified Table - Main Content + Summary */}
            <div className="mb-6 sm:mb-8 overflow-x-auto">
              <table className="w-full border-collapse min-w-full border border-gray-300">
                {/* Main Content Header */}
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border border-blue-800 p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm">
                      Jumlah Cash Pick Up (NOA)
                    </th>
                    <th className="border border-blue-800 p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm">
                      Foto (Struk Terakhir)
                    </th>
                  </tr>
                </thead>
                
                {/* Main Content Body */}
                <tbody>
                  {reportData.items.length > 0 ? (
                    reportData.items.map((item, index) => (
                      <tr key={item.id} className="border-b">
                        <td className="border border-gray-300 p-3 sm:p-6 text-center bg-white">
                          <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-blue-600 mb-1 sm:mb-2">
                            {item.quantity}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 break-words">{item.name}</div>
                        </td>
                        <td className="border border-gray-300 p-3 sm:p-6 text-center bg-white">
                          {item.image ? (
                            <div className="flex justify-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-w-full h-24 sm:h-32 lg:h-48 object-contain rounded"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-20 sm:h-24 lg:h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                              No Image
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-gray-300 p-3 sm:p-6 text-center bg-white">
                        <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-blue-600 mb-1 sm:mb-2">0</div>
                        <div className="text-xs sm:text-sm text-gray-600">No items</div>
                      </td>
                      <td className="border border-gray-300 p-3 sm:p-6 text-center bg-white">
                        <div className="w-full h-20 sm:h-24 lg:h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                          No Image
                        </div>
                      </td>
                    </tr>
                  )}
                  
                  {/* Summary Section - Integrated into the same table */}
                  <tr>
                    <td colSpan={2} className="border border-gray-300 p-0">
                      {/* Summary Header */}
                      <div className="bg-blue-700 text-white p-2 sm:p-3 text-center">
                        <h3 className="font-bold text-sm sm:text-base">RINGKASAN LAPORAN</h3>
                      </div>
                      
                      {/* Summary Content */}
                      <div className="bg-white">
                        <table className="w-full">
                          <tbody>
                            <tr className="bg-blue-600 text-white">
                              <td className="border-r border-blue-800 p-3 sm:p-4 font-semibold text-left text-xs sm:text-sm lg:text-base w-2/3">
                                Pembukaan Tabungan (NOA)
                              </td>
                              <td className="p-3 sm:p-4 text-center font-bold text-lg sm:text-xl w-1/3">
                                {reportData.summary.total}
                              </td>
                            </tr>
                            <tr className="bg-blue-600 text-white">
                              <td className="border-r border-blue-800 p-3 sm:p-4 font-semibold text-left text-xs sm:text-sm lg:text-base">
                                Pembukaan Deposit (NOA)
                              </td>
                              <td className="p-3 sm:p-4 text-center font-bold text-lg sm:text-xl">
                                {reportData.summary.deposits}
                              </td>
                            </tr>
                            <tr className="bg-blue-600 text-white">
                              <td className="border-r border-blue-800 p-3 sm:p-4 font-semibold text-left text-xs sm:text-sm lg:text-base">
                                Rekomendasi Kredit
                              </td>
                              <td className="p-3 sm:p-4 text-center font-bold text-lg sm:text-xl">
                                {reportData.summary.recommendations}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-600">
              <p>Laporan dibuat pada: {new Date().toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;