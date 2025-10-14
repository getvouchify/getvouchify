import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface ExportButtonProps {
  data: any[];
  filename: string;
  sheetName: string;
}

export const ExportButton = ({ data, filename, sheetName }: ExportButtonProps) => {
  const handleExport = () => {
    try {
      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      const timestamp = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `${filename}-${timestamp}.xlsx`);
      
      toast.success("Excel file exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export to Excel
    </Button>
  );
};
