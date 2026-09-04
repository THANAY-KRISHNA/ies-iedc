import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { SiteSettings } from '../../types';
import { INITIAL_SITE_SETTINGS } from '../../data/initialData';
import { Save, Check } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      await api.adminUpdateSettings(settings);
      setSuccessMsg('Global settings saved successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6 font-sans">
        {/* Header */}
        <div className="pb-4 border-b border-[#D8D8D3]">
          <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Website Settings</h1>
          <p className="text-xs text-[#777777] mt-1">
            Configure global website information, official contact details, social media links, and footer texts.
          </p>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* GENERAL */}
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider pb-2 border-b border-[#EBEBE8]">
              1. General Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Institution Name</label>
                <input
                  type="text"
                  value={settings.institutionName}
                  onChange={e => setSettings({ ...settings, institutionName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">IEDC Unit Name</label>
                <input
                  type="text"
                  value={settings.iedcName}
                  onChange={e => setSettings({ ...settings, iedcName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[#242424]">Website Tagline / Description</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* CONTACT DETAILS */}
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider pb-2 border-b border-[#EBEBE8]">
              2. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Official Email</label>
                <input
                  type="email"
                  value={settings.officialEmail}
                  onChange={e => setSettings({ ...settings, officialEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Official Phone</label>
                <input
                  type="text"
                  value={settings.officialPhone}
                  onChange={e => setSettings({ ...settings, officialPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[#242424]">Campus Office Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-6 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider pb-2 border-b border-[#EBEBE8]">
              3. Social Media Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={settings.instagramUrl || ''}
                  onChange={e => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={settings.linkedinUrl || ''}
                  onChange={e => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="font-semibold text-[#242424]">KSUM Portal Link</label>
                <input
                  type="url"
                  placeholder="https://startupmission.kerala.gov.in/..."
                  value={settings.ksumUrl || ''}
                  onChange={e => setSettings({ ...settings, ksumUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};
