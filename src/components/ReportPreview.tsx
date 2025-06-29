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
          {/* Content Container with Proper Padding */}
          <div className="w-full h-full" style={{ padding: '40px' }}>
            
            {/* Header Section */}
            <div className="text-center mb-8 border-b-4 border-blue-600 pb-6">
              <h1 className="text-2xl font-bold text-blue-900 mb-4 leading-tight">
                {reportData.title}
              </h1>
              <div className="text-blue-700 space-y-1">
                <p className="font-semibold text-base">{reportData.address}</p>
                <p className="font-semibold text-base">{reportData.company}</p>
              </div>
            </div>

            {/* Report Info Section */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
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

            {/* Main Table Section */}
            <div className="mb-8">
              <div className="shadow-lg rounded-lg overflow-hidden border border-gray-300">
                <table className="w-full border-collapse">
                  {/* Table Header */}
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border-r border-gray-400 p-4 text-center font-semibold text-lg">
                        Jumlah Cash Pick Up (NOA)
                      </th>
                      <th className="p-4 text-center font-semibold text-lg">
                        Foto (Struk Terakhir)
                      </th>
                    </tr>
                  </thead>
                  
                  {/* Table Body - Items */}
                  <tbody>
                    {reportData.items.length > 0 ? (
                      reportData.items.map((item, index) => (
                        <tr key={item.id} className="border-b border-gray-300">
                          {/* Quantity Column */}
                          <td className="border-r border-gray-300 p-8 text-center bg-white">
                            <div className="text-9xl font-bold text-blue-600 mb-3 leading-none">
                              {item.quantity || '-'}
                            </div>
                          </td>
                          {/* Image Column */}
                          <td className="p-8 text-center bg-white">
                            {item.image ? (
                              <div className="flex justify-center">
                                <img
                                  src={item.image}
                                  alt={`Item ${index + 1}`}
                                  className="max-w-full h-72 object-contain rounded-lg shadow-md border border-gray-200"
                                  style={{ maxHeight: '288px' }}
                                />
                              </div>
                            ) : (
                              <div 
                                className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-base shadow-inner border border-gray-200"
                                style={{ height: '288px' }}
                              >
                                No Image
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-300">
                        <td className="border-r border-gray-300 p-8 text-center bg-white">
                          <div className="text-9xl font-bold text-blue-600 mb-3 leading-none">-</div>
                          <div className="text-base text-gray-600">No items</div>
                        </td>
                        <td className="p-8 text-center bg-white">
                          <div 
                            className="w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-base shadow-inner border border-gray-200"
                            style={{ height: '288px' }}
                          >
                            No Image
                          </div>
                        </td>
                      </tr>
                    )}
                    
                    {/* Summary Rows */}
                    <tr className="bg-blue-600 text-white border-t border-gray-400">
                      <td className="border-r border-gray-400 p-4 font-semibold text-left text-base">
                        Pembukaan Tabungan (NOA)
                      </td>
                      <td className="p-4 text-center font-bold text-xl">
                        {reportData.summary.total || '-'}
                      </td>
                    </tr>
                    <tr className="bg-blue-600 text-white border-t border-gray-400">
                      <td className="border-r border-gray-400 p-4 font-semibold text-left text-base">
                        Pembukaan Deposit (NOA)
                      </td>
                      <td className="p-4 text-center font-bold text-xl">
                        {reportData.summary.deposits || '-'}
                      </td>
                    </tr>
                    <tr className="bg-blue-600 text-white border-t border-gray-400">
                      <td className="border-r border-gray-400 p-4 font-semibold text-left text-base">
                        Rekomendasi Kredit
                      </td>
                      <td className="p-4 text-center font-bold text-xl">
                        {reportData.summary.recommendations || '-'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-12 text-center text-sm text-gray-600">
              <p>Laporan dibuat pada: {new Date().toLocaleString('id-ID')}</p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;