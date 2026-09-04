import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { api } from '../../services/api';
import { SiteSettings } from '../../types';
import { INITIAL_SITE_SETTINGS } from '../../data/initialData';
import { Settings, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

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
    setSaved(false);
    try {
      await api.adminUpdateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const isSuperAdmin = user?.role === 'Super Admin';

  return (
    <div className="max-w-4xl space-y-8">
      <div className="pb-6 border-b border-[#D8D8D3]">
        <h1 className="text-2xl font-black text-[#161616] tracking-tight">
          Institutional Site Settings
        </h1>
        <p className="text-xs text-[#777777] mt-1">
          Configure core institutional data, nodal officer metadata, and campus coordination details.
        </p>
      </div>

      {!isSuperAdmin && (
        <div className="p-4 bg-[#FFF3E0] border border-[#F3C287] rounded-xl flex items-center gap-3 text-xs text-[#8C4A00]">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>
            Note: Site configuration can only be permanently updated by the <strong>Super Admin</strong> (Prof. Shahaziya Parvez). Read-only mode active for your current role.
          </span>
        </div>
      )}

      {saved && (
        <div className="p-4 bg-[#EFEFEA] border border-[#C5D5C5] rounded-xl text-xs text-[#1E3A1E] flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Institutional settings updated successfully and logged in audit trail.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="neu-raised rounded-2xl p-8 border border-[#D8D8D3] space-y-6 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-[#242424]">Institution / Cell Name</label>
          <input
            type="text"
            disabled={!isSuperAdmin}
            value={settings.institutionName || 'IES College of Engineering'}
            onChange={e => setSettings({ ...settings, institutionName: e.target.value })}
            className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-[#242424]">Institutional Vision Statement</label>
          <textarea
            rows={3}
            disabled={!isSuperAdmin}
            value={settings.vision || ''}
            onChange={e => setSettings({ ...settings, vision: e.target.value })}
            className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-[#242424]">Institutional Mission Statement</label>
          <textarea
            rows={3}
            disabled={!isSuperAdmin}
            value={settings.mission || ''}
            onChange={e => setSettings({ ...settings, mission: e.target.value })}
            className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-[#242424]">Faculty Nodal Officer</label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={settings.nodalOfficerName || 'Prof. Shahaziya Parvez'}
              onChange={e => setSettings({ ...settings, nodalOfficerName: e.target.value })}
              className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#242424]">Assistant Nodal Officer</label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={settings.assistantNodalOfficerName || 'Er. Febin M F'}
              onChange={e => setSettings({ ...settings, assistantNodalOfficerName: e.target.value })}
              className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-[#242424]">Contact Email</label>
            <input
              type="email"
              disabled={!isSuperAdmin}
              value={settings.officialEmail || 'iedc@iesce.info'}
              onChange={e => setSettings({ ...settings, officialEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-[#242424]">Contact Phone</label>
            <input
              type="text"
              disabled={!isSuperAdmin}
              value={settings.officialPhone || '0487 230 9999'}
              onChange={e => setSettings({ ...settings, officialPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-[#242424]">Campus Postal Address</label>
          <input
            type="text"
            disabled={!isSuperAdmin}
            value={settings.address || 'Chittilappilly, Thrissur, Kerala, 680551'}
            onChange={e => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-3.5 py-2.5 neu-inset rounded-lg text-xs"
          />
        </div>

        {isSuperAdmin && (
          <div className="pt-2">
            <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
              Save Institutional Configuration
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
