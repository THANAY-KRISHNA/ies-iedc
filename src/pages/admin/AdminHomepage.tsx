import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { SiteSettings } from '../../types';
import { Save, Eye, Check, RefreshCw } from 'lucide-react';

export const AdminHomepage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Failed to load site settings:', err);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccessMsg(null);
    try {
      await api.adminUpdateSettings(settings);
      setSuccessMsg('Homepage content updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to save homepage settings:', err);
      alert('Failed to save homepage settings. Please check server logs.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <AdminLayout>
        <div className="py-12 text-center text-xs text-[#777777]">Loading homepage editor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 font-sans pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D8D3] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] tracking-tight">Homepage Editor</h1>
            <p className="text-xs text-[#777777] mt-1">
              Edit public homepage sections, hero text, vision, mission, and featured highlights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 bg-[#F0F0ED] hover:bg-[#EBEBE8] border border-[#D8D8D3] rounded text-xs font-semibold text-[#242424] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4 text-[#4A4A4A]" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* HERO SECTION */}
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider pb-2 border-b border-[#EBEBE8]">
              1. Hero Section
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Hero Main Heading</label>
                <input
                  type="text"
                  value={settings.heroHeading}
                  onChange={e => setSettings({ ...settings, heroHeading: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Hero Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="font-semibold text-[#242424]">Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={settings.heroCtaText}
                  onChange={e => setSettings({ ...settings, heroCtaText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Secondary CTA Button Text</label>
                <input
                  type="text"
                  value={settings.heroSecondaryCtaText}
                  onChange={e => setSettings({ ...settings, heroSecondaryCtaText: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>
            </div>
          </div>

          {/* VISION & MISSION */}
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider pb-2 border-b border-[#EBEBE8]">
              2. Vision & Mission Statements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Official Vision</label>
                <textarea
                  rows={4}
                  value={settings.vision}
                  onChange={e => setSettings({ ...settings, vision: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Official Mission</label>
                <textarea
                  rows={4}
                  value={settings.mission}
                  onChange={e => setSettings({ ...settings, mission: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>
            </div>
          </div>

          {/* SECTION VISIBILITY CONTROL */}
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider pb-2 border-b border-[#EBEBE8]">
              3. Homepage Section Controls
            </h2>
            <p className="text-xs text-[#777777]">
              Toggle visibility for individual sections on the public homepage.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
              {Object.entries(settings.sectionVisibility).map(([key, isVisible]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-3 bg-[#F5F5F3] border border-[#D8D8D3] rounded cursor-pointer hover:bg-[#EBEBE8] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        sectionVisibility: {
                          ...settings.sectionVisibility,
                          [key]: e.target.checked
                        }
                      })
                    }
                    className="w-4 h-4 rounded text-[#161616] focus:ring-0 cursor-pointer"
                  />
                  <span className="capitalize font-medium text-[#242424]">{key}</span>
                </label>
              ))}
            </div>
          </div>

          {/* FOOTER & CONTACT INFO */}
          <div className="bg-[#FFFFFF] border border-[#D8D8D3] rounded p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider pb-2 border-b border-[#EBEBE8]">
              4. Contact & Footer Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Official Email</label>
                <input
                  type="email"
                  value={settings.officialEmail}
                  onChange={e => setSettings({ ...settings, officialEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#242424]">Official Phone</label>
                <input
                  type="text"
                  value={settings.officialPhone}
                  onChange={e => setSettings({ ...settings, officialPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="font-semibold text-[#242424]">Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={e => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F5F5F3] border border-[#D8D8D3] rounded text-xs text-[#242424] focus:outline-none focus:border-[#161616]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#161616] hover:bg-[#242424] text-white rounded text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

        {/* Live Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded border border-[#D8D8D3] w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#EBEBE8] pb-3">
                <h3 className="font-bold text-base text-[#161616]">Homepage Content Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-3 py-1 bg-[#F0F0ED] rounded text-xs font-semibold text-[#242424]"
                >
                  Close
                </button>
              </div>

              <div className="space-y-6 text-xs text-[#242424]">
                <div className="p-6 bg-[#F5F5F3] rounded border border-[#D8D8D3] space-y-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777] px-2 py-0.5 bg-[#EBEBE8] rounded">
                    {settings.tagline}
                  </span>
                  <h1 className="text-xl font-bold text-[#161616]">{settings.heroHeading}</h1>
                  <p className="text-xs text-[#4A4A4A] max-w-lg mx-auto">{settings.heroSubtitle}</p>
                  <div className="flex justify-center gap-3 pt-2">
                    <span className="px-4 py-2 bg-[#161616] text-white rounded font-medium">{settings.heroCtaText}</span>
                    <span className="px-4 py-2 bg-[#EBEBE8] text-[#161616] rounded font-medium">{settings.heroSecondaryCtaText}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FFFFFF] border border-[#D8D8D3] rounded space-y-1">
                    <h4 className="font-bold text-xs text-[#161616]">Vision</h4>
                    <p className="text-xs text-[#4A4A4A]">{settings.vision}</p>
                  </div>
                  <div className="p-4 bg-[#FFFFFF] border border-[#D8D8D3] rounded space-y-1">
                    <h4 className="font-bold text-xs text-[#161616]">Mission</h4>
                    <p className="text-xs text-[#4A4A4A]">{settings.mission}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
