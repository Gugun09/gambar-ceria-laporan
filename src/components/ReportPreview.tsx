import { ReportData } from '@/pages/Index';

interface ReportPreviewProps {
  reportData: ReportData;
}

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  return (
    <div id="report-preview" className="bg-white" style={{ width: '794px', minHeight: '1123px', margin: '0 auto', padding: '40px' }}>
      {/* Header */}
      <div className="text-center mb-8 border-b-4 border-blue-600 pb-6">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">
          {reportData.title}
        </h1>
        <div className="text-blue-700 space-y-1">
          <p className="font-semibold">{reportData.address}</p>
          <p className="font-semibold">{reportData.company}</p>
        </div>
      </div>

      {/* Report Info */}
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

      {/* Main Content Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-blue-800 p-3 text-center font-semibold">
                Jumlah Cash Pick Up (NOA)
              </th>
              <th className="border border-blue-800 p-3 text-center font-semibold">
                Foto (Struk Terakhir)
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.items.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="border border-gray-300 p-6 text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {item.quantity}
                  </div>
                  <div className="text-sm text-gray-600">{item.name}</div>
                </td>
                <td className="border border-gray-300 p-6 text-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-48 mx-auto object-contain rounded"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </td>
              </tr>
            ))}
            
            {/* Empty rows to maintain structure */}
            {reportData.items.length === 0 && (
              <tr>
                <td className="border border-gray-300 p-6 text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">0</div>
                  <div className="text-sm text-gray-600">No items</div>
                </td>
                <td className="border border-gray-300 p-6 text-center">
                  <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Table */}
      <div className="mt-8">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="bg-blue-600 text-white">
              <td className="border border-blue-800 p-4 font-semibold text-center">
                Pembukaan Tabungan (NOA)
              </td>
              <td className="border border-blue-800 p-4 text-center font-bold text-xl">
                {reportData.summary.total}
              </td>
            </tr>
            <tr className="bg-blue-600 text-white">
              <td className="border border-blue-800 p-4 font-semibold text-center">
                Pembukaan Deposit (NOA)
              </td>
              <td className="border border-blue-800 p-4 text-center font-bold text-xl">
                {reportData.summary.deposits}
              </td>
            </tr>
            <tr className="bg-blue-600 text-white">
              <td className="border border-blue-800 p-4 font-semibold text-center">
                Rekomendasi Kredit
              </td>
              <td className="border border-blue-800 p-4 text-center font-bold text-xl">
                {reportData.summary.recommendations}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-600">
        <p>Laporan dibuat pada: {new Date().toLocaleString('id-ID')}</p>
      </div>
    </div>
  );
};

export default ReportPreview;
