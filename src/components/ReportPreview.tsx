
import { ReportData } from '@/pages/Index';

interface ReportPreviewProps {
  reportData: ReportData;
}

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      <div 
        id="report-preview" 
        className="bg-white mx-auto" 
        style={{ 
          width: '794px', 
          minWidth: '320px',
          minHeight: '1123px', 
          padding: '20px',
        }}
      >
        {/* Header */}
        <div className="text-center mb-6 border-b-4 border-blue-600 pb-4">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-900 mb-3 px-2">
            {reportData.title}
          </h1>
          <div className="text-blue-700 space-y-1 px-2">
            <p className="font-semibold text-sm sm:text-base break-words">{reportData.address}</p>
            <p className="font-semibold text-sm sm:text-base break-words">{reportData.company}</p>
          </div>
        </div>

        {/* Report Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 text-sm px-2">
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

        {/* Main Content Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
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
            <tbody>
              {reportData.items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="border border-gray-300 p-3 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-blue-600 mb-2">
                      {item.quantity}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 break-words px-1">{item.name}</div>
                  </td>
                  <td className="border border-gray-300 p-3 sm:p-6 text-center">
                    {item.image ? (
                      <div className="flex justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-32 sm:max-h-48 object-contain rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 sm:h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                        No Image
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              
              {/* Empty rows to maintain structure */}
              {reportData.items.length === 0 && (
                <tr>
                  <td className="border border-gray-300 p-3 sm:p-6 text-center">
                    <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-blue-600 mb-2">0</div>
                    <div className="text-xs sm:text-sm text-gray-600">No items</div>
                  </td>
                  <td className="border border-gray-300 p-3 sm:p-6 text-center">
                    <div className="w-full h-24 sm:h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                      No Image
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
            <tbody>
              <tr className="bg-blue-600 text-white">
                <td className="border border-blue-800 p-3 sm:p-4 font-semibold text-center text-xs sm:text-sm">
                  Pembukaan Tabungan (NOA)
                </td>
                <td className="border border-blue-800 p-3 sm:p-4 text-center font-bold text-lg sm:text-xl">
                  {reportData.summary.total}
                </td>
              </tr>
              <tr className="bg-blue-600 text-white">
                <td className="border border-blue-800 p-3 sm:p-4 font-semibold text-center text-xs sm:text-sm">
                  Pembukaan Deposit (NOA)
                </td>
                <td className="border border-blue-800 p-3 sm:p-4 text-center font-bold text-lg sm:text-xl">
                  {reportData.summary.deposits}
                </td>
              </tr>
              <tr className="bg-blue-600 text-white">
                <td className="border border-blue-800 p-3 sm:p-4 font-semibold text-center text-xs sm:text-sm">
                  Rekomendasi Kredit
                </td>
                <td className="border border-blue-800 p-3 sm:p-4 text-center font-bold text-lg sm:text-xl">
                  {reportData.summary.recommendations}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-gray-600 px-2">
          <p>Laporan dibuat pada: {new Date().toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
