import { ReportData } from '@/pages/Index';

interface ReportPreviewProps {
  reportData: ReportData;
}

const ReportPreview = ({ reportData }: ReportPreviewProps) => {
  return (
    <div className="w-full overflow-x-auto bg-gradient-to-br from-slate-100 to-slate-200 p-4 rounded-2xl shadow-inner">
      <div 
        id="report-preview" 
        className="bg-white mx-auto shadow-2xl rounded-lg overflow-hidden" 
        style={{ 
          width: '794px', 
          minWidth: '300px',
          minHeight: '1123px', 
          padding: '40px',
          fontSize: '14px'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8 relative">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-lg"></div>
          
          <div className="pt-6 pb-6 border-b-4 border-gradient-to-r from-blue-600 to-indigo-600">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl">📊</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 leading-tight px-4">
              {reportData.title}
            </h1>
            
            <div className="space-y-2 px-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <p className="font-semibold text-blue-700 text-sm sm:text-base">
                  {reportData.address}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <p className="font-semibold text-indigo-700 text-sm sm:text-base">
                  {reportData.company}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 px-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">📅</span>
              <div className="font-semibold text-blue-900 text-sm">Periode</div>
            </div>
            <div className="text-slate-700 font-medium">{reportData.period}</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👤</span>
              <div className="font-semibold text-green-900 text-sm">Karyawan</div>
            </div>
            <div className="text-slate-700 font-medium">{reportData.employee || 'Belum diisi'}</div>
          </div>
        </div>

        {/* Main Content Table */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-t-xl">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-xl">📋</span>
              Data Collection
            </h2>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-b-xl border-2 border-t-0 border-blue-200">
            <table className="w-full border-collapse" style={{ minWidth: '600px' }}>
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="border border-blue-700 p-4 text-center font-semibold text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🔢</span>
                      Jumlah Cash Pick Up (NOA)
                    </div>
                  </th>
                  <th className="border border-blue-700 p-4 text-center font-semibold text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">📸</span>
                      Foto (Struk Terakhir)
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.items.map((item, index) => (
                  <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-blue-50 transition-colors duration-200`}>
                    <td className="border border-slate-300 p-6 text-center align-middle">
                      <div className="space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                          <span className="text-2xl sm:text-3xl font-bold text-white">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-600 font-medium px-2">
                          {item.name || 'Unnamed Item'}
                        </div>
                      </div>
                    </td>
                    <td className="border border-slate-300 p-6 text-center align-middle">
                      {item.image ? (
                        <div className="flex justify-center items-center">
                          <div className="relative group">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-w-full max-h-40 object-contain rounded-xl shadow-lg border-2 border-white group-hover:shadow-xl transition-all duration-300"
                              style={{ maxWidth: '200px' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                          <div className="text-center px-4">
                            <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center mx-auto mb-2">
                              <span className="text-xl">📷</span>
                            </div>
                            <div className="text-slate-500 text-sm font-medium">No Image</div>
                            <div className="text-slate-400 text-xs">Available</div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Empty state */}
                {reportData.items.length === 0 && (
                  <tr>
                    <td className="border border-slate-300 p-8 text-center align-middle">
                      <div className="space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl shadow-lg">
                          <span className="text-2xl font-bold text-white">0</span>
                        </div>
                        <div className="text-sm text-slate-500 font-medium">No items added</div>
                      </div>
                    </td>
                    <td className="border border-slate-300 p-8 text-center align-middle">
                      <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                        <div className="text-center px-4">
                          <div className="w-12 h-12 bg-slate-300 rounded-xl flex items-center justify-center mx-auto mb-2">
                            <span className="text-xl">📷</span>
                          </div>
                          <div className="text-slate-500 text-sm font-medium">No Image</div>
                          <div className="text-slate-400 text-xs">Available</div>
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
        <div className="mt-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-t-xl">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <span className="text-xl">📊</span>
              Summary Report
            </h2>
          </div>
          
          <div className="overflow-x-auto bg-white rounded-b-xl border-2 border-t-0 border-green-200">
            <table className="w-full border-collapse" style={{ minWidth: '400px' }}>
              <tbody>
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                  <td className="border border-blue-700 p-4 font-semibold text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">💰</span>
                      Pembukaan Tabungan (NOA)
                    </div>
                  </td>
                  <td className="border border-blue-700 p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                      <span className="font-bold text-xl">{reportData.summary.total}</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300">
                  <td className="border border-indigo-700 p-4 font-semibold text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">🏦</span>
                      Pembukaan Deposit (NOA)
                    </div>
                  </td>
                  <td className="border border-indigo-700 p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                      <span className="font-bold text-xl">{reportData.summary.deposits}</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300">
                  <td className="border border-purple-700 p-4 font-semibold text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">📈</span>
                      Rekomendasi Kredit
                    </div>
                  </td>
                  <td className="border border-purple-700 p-4 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                      <span className="font-bold text-xl">{reportData.summary.recommendations}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center px-4">
          <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 rounded-xl border border-slate-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">⏰</span>
              <span className="font-semibold text-slate-700">Laporan dibuat pada:</span>
            </div>
            <p className="text-slate-600 font-medium">
              {new Date().toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;