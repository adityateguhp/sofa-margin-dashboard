import React, { useState } from "react";
import Card from "./components/Card";
import Input from "./components/Input";
import Button from "./components/Button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const initialItems = [
  {
    name: "Contoh Sofa",
    hargaJual: 60000000,
    diskon: 200000,
    modal: 46600000,
    ongkir: 750000,
  },
];

export default function SofaMarginDashboard() {
  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState({ name: "", hargaJual: 0, diskon: 0, modal: 0, ongkir: 0 });

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: Number(e.target.value) || e.target.value });
  };

  const addItem = () => {
    setItems([...items, newItem]);
    setNewItem({ name: "", hargaJual: 0, diskon: 0, modal: 0, ongkir: 0 });
  };

  const data = items.map((item) => {
    const hargaSetelahDiskon = item.hargaJual - item.diskon;
    const totalBiaya = item.modal + item.ongkir;
    const labaBersih = hargaSetelahDiskon - totalBiaya;
    const margin = (labaBersih / hargaSetelahDiskon) * 100;
    return { ...item, margin: parseFloat(margin.toFixed(2)) };
  });

  const total = data.reduce(
    (acc, item) => {
      acc.totalJual += item.hargaJual;
      acc.totalDiskon += item.diskon;
      acc.totalModal += item.modal;
      acc.totalOngkir += item.ongkir;
      acc.totalLaba += item.hargaJual - item.diskon - (item.modal + item.ongkir);
      return acc;
    },
    { totalJual: 0, totalDiskon: 0, totalModal: 0, totalOngkir: 0, totalLaba: 0 }
  );

  return (
    <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Tambah Item</h2>
          <Input placeholder="Nama Barang" name="name" value={newItem.name} onChange={handleChange} />
          <Input placeholder="Harga Jual" name="hargaJual" type="number" value={newItem.hargaJual} onChange={handleChange} />
          <Input placeholder="Diskon" name="diskon" type="number" value={newItem.diskon} onChange={handleChange} />
          <Input placeholder="Modal" name="modal" type="number" value={newItem.modal} onChange={handleChange} />
          <Input placeholder="Ongkir" name="ongkir" type="number" value={newItem.ongkir} onChange={handleChange} />
          <Button onClick={addItem}>Tambah</Button>
        </div>
      </Card>

      <Card>
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Dashboard Ringkas</h2>
          <p>Total Penjualan: Rp{total.totalJual.toLocaleString()}</p>
          <p>Total Diskon: Rp{total.totalDiskon.toLocaleString()}</p>
          <p>Total Modal: Rp{total.totalModal.toLocaleString()}</p>
          <p>Total Ongkir: Rp{total.totalOngkir.toLocaleString()}</p>
          <p>Laba Bersih Total: Rp{total.totalLaba.toLocaleString()}</p>
          <p>Margin Rata-rata: {(
            data.reduce((sum, item) => sum + item.margin, 0) / data.length
          ).toFixed(2)}%</p>
        </div>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <div>
          <h2 className="text-xl font-bold mb-2">Grafik Margin per Item</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="margin" fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
