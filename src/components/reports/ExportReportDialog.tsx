import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

interface ExportReportDialogProps {
    open: boolean;
    onClose: () => void;
    onExport: (format: string) => void;
}

const ExportReportDialog: React.FC<ExportReportDialogProps> = ({
    open,
    onClose,
    onExport,
}) => {
    const [exportFormat, setExportFormat] = React.useState('pdf');

    const handleExport = () => {
        onExport(exportFormat);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Export Report</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Export Format</InputLabel>
                    <Select
                        value={exportFormat}
                        label="Export Format"
                        onChange={(e) => setExportFormat(e.target.value)}
                    >
                        <MenuItem value="pdf">PDF</MenuItem>
                        <MenuItem value="excel">Excel</MenuItem>
                        <MenuItem value="csv">CSV</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleExport} variant="contained" color="primary">
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportReportDialog;
import ExportReportDialog from './components/reports/ExportReportDialog';

// Inside your parent component:
const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

const handleExport = (format: string) => {
    // Implement your export logic here
    console.log(`Exporting in ${format} format`);
};

// In your JSX:
<ExportReportDialog
    open={isExportDialogOpen}
    onClose={() => setIsExportDialogOpen(false)}
    onExport={handleExport}
/>