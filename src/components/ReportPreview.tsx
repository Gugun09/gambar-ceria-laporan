import { ReportData } from '@/pages/Index';

interface ReportPreviewProps {
  reportData: ReportData;
}

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  return (
    <div className="w-full overflow-x-auto bg-gray-100 p-2 sm:p-4 rounded-lg">
      <div 
        id="report-preview" 
        className="bg-white mx-auto shadow-lg" 
        style={{ 
          width: '794px', 
          minWidth: '300px',
          minHeight: '1123px', 
          padding: '20px',
          fontSize: '14px'
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 border-b-4 border-blue-600 pb-4 sm:pb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 mb-3 sm:mb-4 px-2 leading-tight">
            {reportData.title}
          </h1>
          <div className="text-blue-700 space-y-1 px-2">
            <p className="font-semibold text-sm sm:text-base break-words leading-relaxed">
              {reportData.address}
            </p>
            <p className="font-semibold text-sm sm:text-base break-words leading-relaxed">
              {reportData.company}
            </p>
          </div>
        </div>

        {/* Report Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 text-sm px-2">
          <div className="space-y-2">
            <div className="font-semibold text-blue-900">Periode :</div>
            <div className="break-words leading-relaxed">{reportData.period}</div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-blue-900">Karyawan :</div>
            <div className="break-words leading-relaxed">{reportData.employee || '-'}</div>
          </div>
        </div>

        {/* Main Content Table */}
        <div className="mb-6 sm:mb-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '600px' }}>
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-blue-800 p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm leading-tight">
                    Jumlah Cash Pick Up (NOA)
                  </th>
                  <th className="border border-blue-800 p-2 sm:p-3 text-center font-semibold text-xs sm:text-sm leading-tight">
                    Foto (Struk Terakhir)
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.items.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="border border-gray-300 p-3 sm:p-4 lg:p-6 text-center align-middle">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-blue-600 mb-2 leading-none">
                        {item.quantity}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 break-words px-1 leading-relaxed">
                        {item.name || 'Unnamed Item'}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-3 sm:p-4 lg:p-6 text-center align-middle">
                      {item.image ? (
                        <div className="flex justify-center items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-w-full max-h-32 sm:max-h-40 lg:max-h-48 object-contain rounded shadow-sm"
                            style={{ maxWidth: '200px' }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 sm:h-32 lg:h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs sm:text-sm border-2 border-dashed border-gray-300">
                          <div className="text-center px-2">
                            <div>No Image</div>
                            <div className="text-xs mt-1">Available</div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Empty state */}
                {reportData.items.length === 0 && (
                  <tr>
                    <td className="border border-gray-300 p-3 sm:p-4 lg:p-6 text-center align-middle">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-blue-600 mb-2 leading-none">
                        0
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">No items added</div>
                    </td>
                    <td className="border border-gray-300 p-3 sm:p-4 lg:p-6 text-center align-middle">
                      <div className="w-full h-24 sm:h-32 lg:h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs sm:text-sm border-2 border-dashed border-gray-300">
                        <div className="text-center px-2">
                          <div>No Image</div>
                          <div className="text-xs mt-1">Available</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Table */}
        <div className="mt-6 sm:mt-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: '400px' }}>
              <tbody>
                <tr className="bg-blue-600 text-white">
                  <td className="border border-blue-800 p-3 sm:p-4 font-semibold text-center text-xs sm:text-sm leading-tight">
                    Pembukaan Tabungan (NOA)
                  </td>
                  <td className="border border-blue-800 p-3 sm:p-4 text-center font-bold text-lg sm:text-xl lg:text-2xl">
                    {reportData.summary.total}
                  </td>
                </tr>
                <tr className="bg-blue-600 text-white">
                  <td className="border border-blue-800 p-3 sm:p-4 font-semibold text-center text-xs sm:text-sm leading-tight">
                    Pembukaan Deposit (NOA)
                  </td>
                  <td className="border border-blue-800 p-3 sm:p-4 text-center font-bold text-lg sm:text-xl lg:text-2xl">
                    {reportData.summary.deposits}
                  </td>
                </tr>
                <tr className="bg-blue-600 text-white">
                  <td className="border border-blue-800 p-3 sm:p-4 font-semibold text-center text-xs sm:text-sm leading-tight">
                    Rekomendasi Kredit
                  </td>
                  <td className="border border-blue-800 p-3 sm:p-4 text-center font-bold text-lg sm:text-xl lg:text-2xl">
                    {reportData.summary.recommendations}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-600 px-2 border-t border-gray-200 pt-4">
          <p className="leading-relaxed">
            Laporan dibuat pada: {new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;