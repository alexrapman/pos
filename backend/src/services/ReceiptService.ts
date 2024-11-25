// backend/src/services/ReceiptService.ts
import PDFDocument from 'pdfkit';
import { Order } from '../models/Order';
import fs from 'fs';
import path from 'path';

export class ReceiptService {
    private readonly TAX_RATE = 0.21; // 21% IVA

    async generateReceipt(order: Order): Promise<string> {
        const doc = new PDFDocument();
        const fileName = `receipt-${order.id}-${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../temp', fileName);

        return new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Encabezado
            doc.fontSize(20).text('Restaurante TPV', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Pedido #${order.id}`);
            doc.text(`Mesa: ${order.tableNumber}`);
            doc.text(`Fecha: ${new Date().toLocaleString()}`);
            doc.moveDown();

            // Detalles del pedido
            doc.text('Detalles del Pedido:', { underline: true });
            let subtotal = 0;

            order.items.forEach(item => {
                const lineTotal = item.price * item.quantity;
                subtotal += lineTotal;
                doc.text(`${item.quantity}x ${item.name} - ${lineTotal.toFixed(2)}€`);
            });

            // Totales
            const tax = subtotal * this.TAX_RATE;
            const total = subtotal + tax;

            doc.moveDown();
            doc.text('─'.repeat(40));
            doc.text(`Subtotal: ${subtotal.toFixed(2)}€`);
            doc.text(`IVA (21%): ${tax.toFixed(2)}€`);
            doc.fontSize(14).text(`Total: ${total.toFixed(2)}€`, { bold: true });

            // Pie de página
            doc.moveDown();
            doc.fontSize(10).text('Gracias por su visita', { align: 'center' });

            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        });
    }
}