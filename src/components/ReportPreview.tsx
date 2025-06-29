import { ReportData } from '@/pages/Index';

interface ReportPreviewProps {
  reportData: ReportData;
}

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  return (
    <div className="w-full">
      {/* Responsive Container for Screen View */}
      <div className="w-full max-w-4xl mx-auto">
        {/* A4 Preview Container */}
        <div 
          id="report-preview" 
          className="bg-white mx-auto shadow-lg rounded-lg overflow-hidden"
          style={{ 
            // Base A4 dimensions (794x1123px at 96 DPI)
            width: '794px', 
            minHeight: '1123px',
            // Responsive scaling for screen viewing
            maxWidth: '100%',
            aspectRatio: '794/1123'
          }}
        >
          {/* Content Container with Reduced Padding */}
          <div className="w-full h-full" style={{ padding: '30px' }}>
            
            {/* Header Section - Reduced Sizes */}
            <div className="text-center mb-6 border-b-3 border-blue-600 pb-4">
              <h1 className="text-xl font-bold text-blue-900 mb-3 leading-tight">
                {reportData.title}
              </h1>
              <div className="text-blue-700 space-y-1">
                <p className="font-semibold text-sm">{reportData.address}</p>
                <p className="font-semibold text-sm">{reportData.company}</p>
              </div>
            </div>

            {/* Report Info Section - Reduced Spacing */}
            <div className="grid grid-cols-2 gap-6 mb-6 text-xs">
              <div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-900">Periode :</div>
                  <div>{reportData.period}</div>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <div className="font-semibold text-blue-900">Karyawan :</div>
                  <div>{reportData.employee}</div>
                </div>
              </div>
            </div>

            {/* Main Table Section - Compact Design */}
            <div className="mb-6">
              <div className="shadow-lg rounded-lg overflow-hidden border border-gray-300">
                <table className="w-full border-collapse">
                  {/* Table Header - Smaller Text */}
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border-r border-gray-400 p-3 text-center font-semibold text-sm">
                        Jumlah Cash Pick Up (NOA)
                      </th>
                      <th className="p-3 text-center font-semibold text-sm">
                        Foto (Struk Terakhir)
                      </th>
                    </tr>
                  </thead>
                  
                  {/* Table Body - Items with Reduced Sizes */}
                  <tbody>
                    {reportData.items.length > 0 ? (
                      reportData.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-300">
                          {/* Quantity Column - Much Smaller Text */}
                          <td className="border-r border-gray-300 p-4 text-center bg-white">
                            <div className="text-4xl font-bold text-blue-600 mb-1 leading-none">
                              {item.quantity || '-'}
                            </div>
                          </td>
                          {/* Image Column - Smaller Images */}
                          <td className="p-4 text-center bg-white">
                            {item.image ? (
                              <div className="flex justify-center">
                                <img
                                  src={item.image}
                                  alt={`Item ${index + 1}`}
                                  className="max-w-full h-32 object-contain rounded-lg shadow-md border border-gray-200"
                                  style={{ maxHeight: '128px' }}
                                />
                              </div>
                            ) : (
                              <div 
                                className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shadow-inner border border-gray-200"
                                style={{ height: '128px' }}
                              >
                                No Image
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-300">
                        <td className="border-r border-gray-300 p-4 text-center bg-white">
                          <div className="text-4xl font-bold text-blue-600 mb-1 leading-none">-</div>
                          <div className="text-xs text-gray-600">No items</div>
                        </td>
                        <td className="p-4 text-center bg-white">
                          <div 
                            className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs shadow-inner border border-gray-200"
                            style={{ height: '128px' }}
                          >
                            No Image
                          </div>
                        </td>
                      </tr>
                    )}
                    
                    {/* Summary Rows - Compact Design */}
                    <tr className="bg-blue-600 text-white border-t border-gray-400">
                      <td className="border-r border-gray-400 p-3 font-semibold text-left text-xs">
                        Pembukaan Tabungan (NOA)
                      </td>
                      <td className="p-3 text-center font-bold text-sm">
                        {reportData.summary.total || '-'}
                      </td>
                    </tr>
                    <tr className="bg-blue-600 text-white border-t border-gray-400">
                      <td className="border-r border-gray-400 p-3 font-semibold text-left text-xs">
                        Pembukaan Deposit (NOA)
                      </td>
                      <td className="p-3 text-center font-bold text-sm">
                        {reportData.summary.deposits || '-'}
                      </td>
                    </tr>
                    <tr className="bg-blue-600 text-white border-t border-gray-400">
                      <td className="border-r border-gray-400 p-3 font-semibold text-left text-xs">
                        Rekomendasi Kredit
                      </td>
                      <td className="p-3 text-center font-bold text-sm">
                        {reportData.summary.recommendations || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Section - Smaller Text */}
            <div className="mt-8 text-center text-xs text-gray-600">
              <p>Laporan dibuat pada: {new Date().toLocaleString('id-ID')}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;