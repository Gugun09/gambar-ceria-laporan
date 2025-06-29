import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, Upload, CalendarIcon, Building, MapPin, User, FileText, Camera, Hash } from 'lucide-react';
import { ReportData } from '@/pages/Index';
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

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
    toast.success("Item baru ditambahkan!", {
      description: "Silakan isi detail item yang baru ditambahkan."
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
    toast.info("Item dihapus", {
      description: "Item telah berhasil dihapus dari laporan."
    });
  };

  const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File terlalu besar!", {
          description: "Ukuran file maksimal 5MB. Silakan pilih file yang lebih kecil."
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        updateItem(id, 'image', e.target?.result as string);
        toast.success("Gambar berhasil diupload!", {
          description: "Gambar telah ditambahkan ke item."
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gradient-to-r from-blue-200 to-indigo-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Informasi Dasar</h3>
            <p className="text-sm text-slate-600">Data utama laporan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Label htmlFor="title" className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Judul Laporan
            </Label>
            <Input
              id="title"
              value={reportData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="Masukkan judul laporan"
            />
          </div>
          
          <div>
            <Label htmlFor="company" className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-blue-500" />
              Nama Perusahaan
            </Label>
            <Input
              id="company"
              value={reportData.company}
              onChange={(e) => updateField('company', e.target.value)}
              className="h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="Nama perusahaan"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              Alamat
            </Label>
            <Input
              id="address"
              value={reportData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="Alamat perusahaan"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              Periode
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4 text-blue-500" />
                  <span className="truncate">
                    {selectedDate ? format(selectedDate, "PPP") : "Pilih tanggal"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-2xl" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="p-4"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="employee" className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-500" />
              Nama Karyawan
            </Label>
            <Input
              id="employee"
              value={reportData.employee}
              onChange={(e) => updateField('employee', e.target.value)}
              className="h-12 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="Nama karyawan"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-4 border-b border-gradient-to-r from-blue-200 to-indigo-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Item Collection</h3>
              <p className="text-sm text-slate-600">{reportData.items.length} item ditambahkan</p>
            </div>
          </div>
          
          <Button 
            onClick={addItem} 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg rounded-xl h-12 px-6 font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Item
          </Button>
        </div>

        <div className="space-y-4">
          {reportData.items.length === 0 && (
            <Card className="p-8 text-center bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-slate-600 mb-2">Belum ada item</h4>
              <p className="text-slate-500">Klik "Tambah Item" untuk menambahkan item pertama Anda</p>
            </Card>
          )}
          
          {reportData.items.map((item, index) => (
            <Card key={item.id} className="p-6 bg-white/80 backdrop-blur-sm border-2 border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-slate-800">Item #{index + 1}</h4>
                  </div>
                  <Button
                    onClick={() => removeItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="h-9 px-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Hapus</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Nama Item
                    </Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Contoh: Whiskas Cat Food"
                      className="h-11 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      Jumlah
                    </Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="h-11 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
                    <Camera className="w-4 h-4 text-blue-500" />
                    Upload Gambar
                  </Label>
                  <div>
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
                      className="w-full h-11 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-blue-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {item.image ? 'Ganti Gambar' : 'Pilih Gambar'}
                    </Button>
                  </div>
                </div>
                
                {item.image && (
                  <div className="flex justify-center">
                    <div className="relative group">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-xl border-2 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                      />
                      <Button
                        onClick={() => updateItem(item.id, 'image', '')}
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
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
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-blue-200">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <Hash className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Summary</h3>
            <p className="text-sm text-slate-600">Ringkasan data laporan</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-green-500" />
              Pembukaan Tabungan (NOA)
            </Label>
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
              className="h-11 border-2 border-slate-200 focus:border-green-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-blue-500" />
              Pembukaan Deposit (NOA)
            </Label>
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
              className="h-11 border-2 border-slate-200 focus:border-blue-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <Label className="text-slate-700 font-semibold flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-purple-500" />
              Rekomendasi Kredit
            </Label>
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
              className="h-11 border-2 border-slate-200 focus:border-purple-500 rounded-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
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