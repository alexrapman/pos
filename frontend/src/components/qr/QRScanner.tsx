// frontend/src/components/qr/QRScanner.tsx
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useRouter } from 'next/router';
import { QRCodeService } from '../../services/QRCodeService';

export const QRScanner: React.FC = () => {
  const [error, setError] = useState<string>();
  const router = useRouter();
  const qrService = QRCodeService.getInstance();

  const handleScan = async (data: string | null) => {
    if (data) {
      const qrData = await qrService.validateQRCode(data);
      if (qrData) {
        router.push(`/table/${qrData.tableId}/menu`);
      } else {
        setError('Invalid QR code');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <QrReader
          onResult={(result) => {
            if (result) {
              handleScan(result.getText());
            }
          }}
          constraints={{ facingMode: 'environment' }}
          className="w-full"
        />
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};