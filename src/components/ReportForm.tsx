import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Upload, CalendarIcon } from 'lucide-react';
import { ReportData } from '@/pages/Index';
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReportFormProps {
  reportData: ReportData;
  setReportData: (data: ReportData) => void;
}

const ReportForm = ({ reportData, setReportData }: ReportFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const updateField = (field: keyof ReportData, value: any) => {
    setReportData({ ...reportData, [field]: value });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const formattedDate = date.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      updateField('period', formattedDate);
    }
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
    <div className="space-y-4 sm:space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-900 border-b border-blue-200 pb-2">
          Informasi Dasar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title" className="text-blue-900 font-semibold text-sm">Judul Laporan</Label>
            <Input
              id="title"
              value={reportData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="mt-1 h-10 sm:h-11"
              placeholder="Masukkan judul laporan"
            />
          </div>
          
          <div>
            <Label htmlFor="company" className="text-blue-900 font-semibold text-sm">Nama Perusahaan</Label>
            <Input
              id="company"
              value={reportData.company}
              onChange={(e) => updateField('company', e.target.value)}
              className="mt-1 h-10 sm:h-11"
              placeholder="Nama perusahaan"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-blue-900 font-semibold text-sm">Alamat</Label>
            <Input
              id="address"
              value={reportData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="mt-1 h-10 sm:h-11"
              placeholder="Alamat perusahaan"
            />
          </div>
          
          <div>
            <Label className="text-blue-900 font-semibold text-sm">Periode</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1 h-10 sm:h-11",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-sm">
                    {selectedDate ? format(selectedDate, "PPP") : "Pilih tanggal"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="employee" className="text-blue-900 font-semibold text-sm">Nama Karyawan</Label>
            <Input
              id="employee"
              value={reportData.employee}
              onChange={(e) => updateField('employee', e.target.value)}
              className="mt-1 h-10 sm:h-11"
              placeholder="Nama karyawan"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-blue-200 pb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-900">Item Collection</h3>
          <Button 
            onClick={addItem} 
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-10 sm:h-11"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm">Tambah Item</span>
          </Button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {reportData.items.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <p className="text-sm sm:text-base">Belum ada item. Klik "Tambah Item" untuk menambahkan.</p>
            </div>
          )}
          
          {reportData.items.map((item, index) => (
            <Card key={item.id} className="p-3 sm:p-4 border-2 border-blue-200">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-blue-900 text-sm sm:text-base">
                    Item #{index + 1}
                  </h4>
                  <Button
                    onClick={() => removeItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Hapus</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-blue-900 font-semibold text-sm">Nama Item</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Contoh: Whiskas Cat Food"
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-blue-900 font-semibold text-sm">Jumlah</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="mt-1 h-10 sm:h-11"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-blue-900 font-semibold text-sm">Upload Gambar</Label>
                  <div className="mt-1">
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
                      className="w-full h-10 sm:h-11"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {item.image ? 'Ganti Gambar' : 'Pilih Gambar'}
                      </span>
                    </Button>
                  </div>
                </div>
                
                {item.image && (
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border shadow-sm"
                      />
                      <Button
                        onClick={() => updateItem(item.id, 'image', '')}
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      <Card className="p-3 sm:p-4 bg-blue-50 border-blue-200">
        <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-3 sm:mb-4 border-b border-blue-200 pb-2">
          Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <Label className="text-blue-900 font-semibold text-sm">Pembukaan Tabungan (NOA)</Label>
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
              className="mt-1 h-10 sm:h-11"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <Label className="text-blue-900 font-semibold text-sm">Pembukaan Deposit (NOA)</Label>
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
              className="mt-1 h-10 sm:h-11"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <Label className="text-blue-900 font-semibold text-sm">Rekomendasi Kredit</Label>
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
              className="mt-1 h-10 sm:h-11"
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportForm;