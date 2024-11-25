// frontend/src/components/tables/TableManagement.tsx
import React, { useState, useEffect } from 'react';
import { QRCodeService } from '../../services/QRCodeService';
import { useSocket } from '../../hooks/useSocket';

interface Table {
  id: number;
  number: string;
  status: 'available' | 'occupied' | 'reserved';
  currentOrderId?: number;
  qrCode?: string;
}

export const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const qrService = QRCodeService.getInstance();

  useSocket('table-updates', (data) => {
    updateTableStatus(data.tableId, data.status);
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const response = await fetch('/api/tables');
    const tablesData = await response.json();
    
    // Generate QR codes for each table
    const tablesWithQR = await Promise.all(
      tablesData.map(async (table: Table) => ({
        ...table,
        qrCode: await qrService.generateTableQR(table.id)
      }))
    );
    
    setTables(tablesWithQR);
  };

  const updateTableStatus = async (tableId: number, status: Table['status']) => {
    await fetch(`/api/tables/${tableId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    setTables(prev => 
      prev.map(table => 
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tables.map(table => (
          <div 
            key={table.id}
            className={`
              p-4 rounded-lg shadow-lg 
              ${table.status === 'available' ? 'bg-green-50' :
                table.status === 'occupied' ? 'bg-red-50' : 'bg-yellow-50'}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">Table {table.number}</h3>
                <p className="text-sm capitalize">{table.status}</p>
              </div>
              <select
                value={table.status}
                onChange={(e) => updateTableStatus(table.id, e.target.value as Table['status'])}
                className="border rounded p-1"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            {table.qrCode && (
              <div className="flex flex-col items-center">
                <img 
                  src={table.qrCode} 
                  alt={`QR Code for Table ${table.number}`}
                  className="w-32 h-32"
                />
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.download = `table-${table.number}-qr.png`;
                    link.href = table.qrCode!;
                    link.click();
                  }}
                  className="mt-2 text-blue-600 text-sm"
                >
                  Download QR Code
                </button>
              </div>
            )}

            {table.currentOrderId && (
              <div className="mt-4 p-2 bg-white rounded">
                <p className="text-sm">
                  Current Order: #{table.currentOrderId}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};