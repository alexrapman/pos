// mobile/pages/index.js
import React from 'react';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bienvenido a la App del Restaurante</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/menu">
                    <a className="p-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
                        Ver Menú
                    </a>
                </Link>
                <Link href="/order">
                    <a className="p-4 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
                        Realizar Pedido
                    </a>
                </Link>
                <Link href="/reservations">
                    <a className="p-4 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600">
                        Reservar Mesa
                    </a>
                </Link>
                <Link href="/payment">
                    <a className="p-4 bg-red-500 text-white rounded-lg shadow hover:bg-red-600">
                        Realizar Pago
                    </a>
                </Link>
            </div>
        </div>
    );
}