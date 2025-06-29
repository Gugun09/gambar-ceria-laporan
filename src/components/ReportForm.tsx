
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from 'lucide-react';
import { ReportData } from '@/pages/Index';

interface ReportFormProps {
  reportData: ReportData;
  setReportData: (data: ReportData) => void;
}

const ReportForm = ({ reportData, setReportData }: ReportFormProps) => {
  const updateField = (field: keyof ReportData, value: any) => {
    setReportData({ ...reportData, [field]: value });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      quantity: 0,
      image: ''
    };
    setReportData({
      ...reportData,
      items: [...reportData.items, newItem]
    });
  };

  const updateItem = (id: number, field: string, value: any) => {
    const updatedItems = reportData.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setReportData({ ...reportData, items: updatedItems });
    
    // Update summary
    const total = updatedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setReportData({
      ...reportData,
      items: updatedItems,
      summary: {
        ...reportData.summary,
        total
      }
    });
  };

  const removeItem = (id: number) => {
    const updatedItems = reportData.items.filter(item => item.id !== id);
    const total = updatedItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setReportData({
      ...reportData,
      items: updatedItems,
      summary: {
        ...reportData.summary,
        total
      }
    });
  };

  const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateItem(id, 'image', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-blue-900 font-semibold">Judul Laporan</Label>
            <Input
              id="title"
              value={reportData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="company" className="text-blue-900 font-semibold">Nama Perusahaan</Label>
            <Input
              id="company"
              value={reportData.company}
              onChange={(e) => updateField('company', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-blue-900 font-semibold">Alamat</Label>
            <Input
              id="address"
              value={reportData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="employee" className="text-blue-900 font-semibold">Nama Karyawan</Label>
            <Input
              id="employee"
              value={reportData.employee}
              onChange={(e) => updateField('employee', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-blue-900">Item Collection</h3>
          <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Item
          </Button>
        </div>

        <div className="space-y-4">
          {reportData.items.map((item) => (
            <Card key={item.id} className="p-4 border-2 border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label className="text-blue-900 font-semibold">Nama Item</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="Contoh: Whiskas Cat Food"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-blue-900 font-semibold">Jumlah</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label className="text-blue-900 font-semibold">Upload Gambar</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(item.id, e)}
                      className="hidden"
                      id={`image-${item.id}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById(`image-${item.id}`)?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={() => removeItem(item.id)}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {item.image && (
                <div className="mt-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded border"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-blue-900 font-semibold">Pembukaan Tabungan (NOA)</Label>
            <Input
              type="number"
              value={reportData.summary.deposits}
              onChange={(e) => setReportData({
                ...reportData,
                summary: {
                  ...reportData.summary,
                  deposits: parseInt(e.target.value) || 0
                }
              })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-blue-900 font-semibold">Pembukaan Deposit (NOA)</Label>
            <Input
              type="number"
              value={reportData.summary.deposits}
              onChange={(e) => setReportData({
                ...reportData,
                summary: {
                  ...reportData.summary,
                  deposits: parseInt(e.target.value) || 0
                }
              })}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-blue-900 font-semibold">Rekomendasi Kredit</Label>
            <Input
              type="number"
              value={reportData.summary.recommendations}
              onChange={(e) => setReportData({
                ...reportData,
                summary: {
                  ...reportData.summary,
                  recommendations: parseInt(e.target.value) || 0
                }
              })}
              className="mt-1"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportForm;
