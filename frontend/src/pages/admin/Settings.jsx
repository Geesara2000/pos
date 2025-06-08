import { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import Card from '../../components/Card';
import { Save, Percent, DollarSign, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { settings, setSettings } = usePOS();
  const [formData, setFormData] = useState({
    tax: settings.tax || 10,
    globalDiscount: settings.globalDiscount || 0,
    currency: settings.currency || 'USD',
    storeName: settings.storeName || 'Modern POS Store',
    storeAddress: settings.storeAddress || '123 Main St, City, State 12345',
    storePhone: settings.storePhone || '(555) 123-4567'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSettings(formData);
    alert('Settings saved successfully!');
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Store Information */}
        <Card title="Store Information">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter store name"
              />
            </div>

            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Store Address
              </label>
              <textarea
                id="storeAddress"
                name="storeAddress"
                rows={3}
                value={formData.storeAddress}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter store address"
              />
            </div>

            <div>
              <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="storePhone"
                name="storePhone"
                value={formData.storePhone}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>

            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 w-full"
            >
              <Save className="h-4 w-4" />
              <span>Save Store Info</span>
            </button>
          </form>
        </Card>

        {/* Tax & Discount Settings */}
        <Card title="Tax & Discount Settings">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tax" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Percent className="h-4 w-4" />
                  <span>Tax Rate (%)</span>
                </div>
              </label>
              <input
                type="number"
                id="tax"
                name="tax"
                min="0"
                max="100"
                step="0.1"
                value={formData.tax}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter tax rate"
              />
              <p className="text-xs text-gray-500 mt-1">Applied to all transactions</p>
            </div>

            <div>
              <label htmlFor="globalDiscount" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <Percent className="h-4 w-4" />
                  <span>Global Discount (%)</span>
                </div>
              </label>
              <input
                type="number"
                id="globalDiscount"
                name="globalDiscount"
                min="0"
                max="100"
                step="0.1"
                value={formData.globalDiscount}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter global discount"
              />
              <p className="text-xs text-gray-500 mt-1">Default discount applied to transactions</p>
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Currency</span>
                </div>
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 w-full"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </form>
        </Card>
      </div>

      {/* Current Settings Preview */}
      <Card title="Current Settings Preview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <SettingsIcon className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Tax Configuration</h4>
            </div>
            <p className="text-2xl font-bold text-primary-600">{formData.tax}%</p>
            <p className="text-sm text-gray-600">Applied to all sales</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Percent className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Global Discount</h4>
            </div>
            <p className="text-2xl font-bold text-green-600">{formData.globalDiscount}%</p>
            <p className="text-sm text-gray-600">Default discount rate</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Currency</h4>
            </div>
            <p className="text-2xl font-bold text-blue-600">{formData.currency}</p>
            <p className="text-sm text-gray-600">System currency</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;