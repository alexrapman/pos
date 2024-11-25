// frontend/src/services/QRCodeService.ts
import QRCode from 'qrcode';

interface QRCodeData {
  tableId: number;
  restaurantId: string;
  timestamp: number;
}

export class QRCodeService {
  private static instance: QRCodeService;

  static getInstance(): QRCodeService {
    if (!this.instance) {
      this.instance = new QRCodeService();
    }
    return this.instance;
  }

  async generateTableQR(tableId: number): Promise<string> {
    const data: QRCodeData = {
      tableId,
      restaurantId: process.env.RESTAURANT_ID!,
      timestamp: Date.now()
    };

    const qrDataString = JSON.stringify(data);
    return await QRCode.toDataURL(qrDataString, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300
    });
  }

  async validateQRCode(qrData: string): Promise<QRCodeData | null> {
    try {
      const data: QRCodeData = JSON.parse(qrData);
      if (!data.tableId || !data.restaurantId) {
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }
}
