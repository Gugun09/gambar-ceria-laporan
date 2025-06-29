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
          {/* Content Container with A4 Standard Padding */}
          <div className="w-full h-full" style={{ padding: '40px 60px' }}>
            
            {/* Header Section - MATCHING REFERENCE */}
            <div className="text-center mb-8">
              {/* Blue Header Bar */}
              <div className="bg-blue-700 text-white py-4 px-6 mb-6 rounded-lg">
                <h1 className="text-2xl font-bold leading-tight">
                  {reportData.title}
                </h1>
              </div>
              
              {/* Company Info */}
              <div className="text-gray-700 space-y-1 mb-6">
                <p className="font-medium text-base">{reportData.address}</p>
                <p className="font-medium text-base">{reportData.company}</p>
              </div>
              
              {/* Horizontal Line */}
              <div className="border-b-2 border-gray-400 mb-6"></div>
            </div>

            {/* Report Info Section - MATCHING REFERENCE FORMAT */}
            <div className="mb-8 text-base">
              <div className="flex items-center mb-3">
                <span className="font-bold text-blue-700 min-w-24">Periode</span>
                <span className="mx-3 font-bold">:</span>
                <span>{reportData.period}</span>
              </div>
              <div className="flex items-center mb-6">
                <span className="font-bold text-blue-700 min-w-24">Karyawan</span>
                <span className="mx-3 font-bold">:</span>
                <span>{reportData.employee}</span>
              </div>
            </div>

            {/* Main Table Section - EXACTLY MATCHING REFERENCE */}
            <div className="mb-6">
              <table className="w-full border-collapse border-2 border-gray-800">
                {/* Table Header - MATCHING REFERENCE COLORS */}
                <thead>
                  <tr className="bg-blue-700 text-white">
                    <th className="border border-gray-800 py-4 px-4 text-center font-bold text-base">
                      Jumlah Cash Pick Up (NOA)
                    </th>
                    <th className="border border-gray-800 py-4 px-4 text-center font-bold text-base">
                      Foto (Struk Terakhir)
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body - MATCHING REFERENCE LAYOUT */}
                <tbody>
                  {reportData.items.length > 0 ? (
                    reportData.items.map((item, index) => (
                      <tr key={item.id} className="border border-gray-800">
                        {/* Quantity Column - LARGE BLUE NUMBERS LIKE REFERENCE */}
                        <td className="border border-gray-800 text-center bg-white" style={{ height: '200px', verticalAlign: 'middle' }}>
                          <div className="flex items-center justify-center h-full">
                            <div className="text-8xl font-bold text-blue-700 leading-none">
                              {item.quantity || '0'}
                            </div>
                          </div>
                        </td>
                        {/* Image Column - MATCHING REFERENCE SIZE */}
                        <td className="border border-gray-800 text-center bg-white" style={{ height: '200px', verticalAlign: 'middle' }}>
                          <div className="flex items-center justify-center h-full p-4">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={`Item ${index + 1}`}
                                className="max-w-full max-h-full object-contain"
                                style={{ maxWidth: '180px', maxHeight: '160px' }}
                              />
                            ) : (
                              <div 
                                className="bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 text-sm"
                                style={{ width: '180px', height: '160px' }}
                              >
                                No Image
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border border-gray-800">
                      <td className="border border-gray-800 text-center bg-white" style={{ height: '200px', verticalAlign: 'middle' }}>
                        <div className="flex items-center justify-center h-full">
                          <div className="text-8xl font-bold text-blue-700 leading-none">0</div>
                        </div>
                      </td>
                      <td className="border border-gray-800 text-center bg-white" style={{ height: '200px', verticalAlign: 'middle' }}>
                        <div className="flex items-center justify-center h-full p-4">
                          <div 
                            className="bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 text-sm"
                            style={{ width: '180px', height: '160px' }}
                          >
                            No Image
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary Table - EXACTLY MATCHING REFERENCE */}
            <div className="mt-8">
              <table className="w-full border-collapse border-2 border-gray-800">
                <tbody>
                  <tr className="bg-blue-700 text-white border border-gray-800">
                    <td className="border border-gray-800 py-4 px-4 font-bold text-center text-base">
                      Pembukaan Tabungan (NOA)
                    </td>
                    <td className="border border-gray-800 py-4 px-4 text-center font-bold text-2xl">
                      {reportData.summary.total || '1'}
                    </td>
                  </tr>
                  <tr className="bg-blue-700 text-white border border-gray-800">
                    <td className="border border-gray-800 py-4 px-4 font-bold text-center text-base">
                      Pembukaan Deposit (NOA)
                    </td>
                    <td className="border border-gray-800 py-4 px-4 text-center font-bold text-2xl">
                      {reportData.summary.deposits || '0'}
                    </td>
                  </tr>
                  <tr className="bg-blue-700 text-white border border-gray-800">
                    <td className="border border-gray-800 py-4 px-4 font-bold text-center text-base">
                      Rekomendasi Kredit
                    </td>
                    <td className="border border-gray-800 py-4 px-4 text-center font-bold text-2xl">
                      {reportData.summary.recommendations || '0'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;