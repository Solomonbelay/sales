import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard({ onLogout }) {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({ customerName: '', customerEmail: '', productService: '', salesValue: '', status: 'Lead' });
  const [error, setError] = useState('');

  const fetchSalesData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales', { withCredentials: true });
      setSales(res.data);
    } catch (err) {
      setError('Session expired or access unauthorized');
    }
  };

  useEffect(() => { fetchSalesData(); }, []);

  const handleCreateSale = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/sales', form, { withCredentials: true });
      setForm({ customerName: '', customerEmail: '', productService: '', salesValue: '', status: 'Lead' });
      fetchSalesData();
    } catch (err) {
      setError('Form submission structural block error.');
    }
  };

  const totalValue = sales.reduce((sum, item) => sum + Number(item.salesValue || 0), 0);

  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Sales Operational Framework</h1>
            <p className="text-sm text-slate-500">Live MVP Pipeline Overview Management Panel</p>
          </div>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition">System Decoupled Exit</button>
        </div>

        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg opacity-90 font-medium">Aggregated Pipeline Evaluation</h3>
            <p className="text-4xl font-black mt-2">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-emerald-600 text-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg opacity-90 font-medium">Active Registered Opportunities</h3>
            <p className="text-4xl font-black mt-2">{sales.length} Account Profiles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Register New Conversion Target</h2>
            <form onSubmit={handleCreateSale} className="space-y-4">
              <input type="text" placeholder="Customer / Entity Name" required className="w-full border p-2 rounded-lg" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} />
              <input type="email" placeholder="Contact Verification Email" required className="w-full border p-2 rounded-lg" value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} />
              <input type="text" placeholder="Product / Service Matrix ID" required className="w-full border p-2 rounded-lg" value={form.productService} onChange={e => setForm({...form, productService: e.target.value})} />
              <input type="number" placeholder="Estimated Deal Valuation Value ($)" required className="w-full border p-2 rounded-lg" value={form.salesValue} onChange={e => setForm({...form, salesValue: e.target.value})} />
              <select className="w-full border p-2 rounded-lg" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'].map(st => <option key={st} value={st}>{st}</option>)}
              </select>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg transition">Push Pipeline Object</button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Current Pipeline Tracker Metrics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 text-slate-600 text-xs font-bold uppercase">
                    <th className="p-3">Client Target</th>
                    <th className="p-3">Product Profile</th>
                    <th className="p-3">Valuation</th>
                    <th className="p-3">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm text-slate-700">
                  {sales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">{sale.customerName}</td>
                      <td className="p-3">{sale.productService}</td>
                      <td className="p-3 font-bold text-slate-900">${Number(sale.salesValue).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${sale.status === 'Won' ? 'bg-emerald-100 text-emerald-800' : sale.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{sale.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}