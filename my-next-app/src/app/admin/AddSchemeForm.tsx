'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X } from 'lucide-react';

interface AddSchemeFormProps {
  onSchemeAdded: () => void;
  scheme?: any; 
  isEditing?: boolean;
}

export default function AddSchemeForm({ onSchemeAdded, scheme = null, isEditing = false }: AddSchemeFormProps) {
  const [formData, setFormData] = useState({
    title: scheme?.title || '',
    description: scheme?.description || '',
    category: scheme?.category || '',
    state: scheme?.state || '', 
    eligibility: scheme?.eligibility || '',
    benefits: scheme?.benefits || '',
    application_process: scheme?.application_process || '',
    required_documents: scheme?.required_documents || '',
    official_website: scheme?.official_website || '',
    contact_info: scheme?.contact_info || '',
    status: scheme?.status || 'active',
    benefit_amount: scheme?.benefit_amount || '',
    last_date_to_apply: scheme?.last_date_to_apply || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      let result;
      
      if (isEditing && scheme) {
        console.log('Updating scheme with ID:', scheme.id);
        console.log('Form data:', formData);
        
        result = await supabase
          .from('schemes')
          .update(formData)
          .eq('id', scheme.id);
      } else {
        console.log('Inserting new scheme');
        console.log('Form data:', formData);
        
        result = await supabase
          .from('schemes')
          .insert([formData]);
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error('Supabase error:', error);
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ 
          type: 'success', 
          text: isEditing ? 'Scheme updated successfully!' : 'Scheme added successfully!' 
        });
        
        if (!isEditing) {
          setFormData({
            title: '',
            description: '',
            category: '',
            state: '', 
            eligibility: '',
            benefits: '',
            application_process: '',
            required_documents: '',
            official_website: '',
            contact_info: '',
            status: 'active',
            benefit_amount: '',
            last_date_to_apply: ''
          });
        }
        
        onSchemeAdded();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!scheme || !isEditing) return;
    
    if (window.confirm('Are you sure you want to delete this scheme? This action cannot be undone.')) {
      setIsSubmitting(true);
      setMessage({ type: '', text: '' });
      
      try {
        console.log('Deleting scheme with ID:', scheme.id);
        
        const { error } = await supabase
          .from('schemes')
          .delete()
          .eq('id', scheme.id);
        
        if (error) {
          console.error('Supabase error:', error);
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ type: 'success', text: 'Scheme deleted successfully!' });
          onSchemeAdded();
        }
      } catch (error: any) {
        console.error('Unexpected error:', error);
        setMessage({ type: 'error', text: 'An unexpected error occurred' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#102542ff]">
          {isEditing ? 'Edit Scheme' : 'Add New Scheme'}
        </h2>
        <button 
          onClick={() => onSchemeAdded()}
          className="text-[#6b7280] cusror-pointer  hover:text-[#f87060ff] transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-xl ${
          message.type === 'success' ? 'bg-[rgba(16,150,90,0.1)] text-[#10965a]' : 
          message.type === 'error' ? 'bg-[rgba(248,112,96,0.1)] text-[#f87060ff]' : ''
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Scheme Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            required
          >
            <option value="">Select a category</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Housing">Housing</option>
            <option value="Employment">Employment</option>
            <option value="Social Welfare">Social Welfare</option>
            <option value="Women & Child">Women & Child</option>
            <option value="Senior Citizens">Senior Citizens</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            placeholder="e.g., Maharashtra, Karnataka"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Benefit Amount</label>
          <input
            type="text"
            name="benefit_amount"
            value={formData.benefit_amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            placeholder="e.g., ₹10,000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Last Date to Apply</label>
          <input
            type="date"
            name="last_date_to_apply"
            value={formData.last_date_to_apply}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Eligibility Criteria</label>
          <textarea
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Benefits</label>
          <textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Application Process</label>
          <textarea
            name="application_process"
            value={formData.application_process}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Required Documents</label>
          <textarea
            name="required_documents"
            value={formData.required_documents}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Official Website</label>
          <input
            type="url"
            name="official_website"
            value={formData.official_website}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Contact Information</label>
          <input
            type="text"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#102542ff] mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#e5e7eb] rounded-xl focus:ring-[#f87060ff] focus:border-[#f87060ff]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#f87060ff]  cusror-pointer hover:bg-[#e55a4aff] text-white font-medium rounded-xl transition-colors disabled:opacity-70 w-full sm:w-auto"
            >
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#102542ff] cusror-pointer hover:bg-[#0a1933ff] text-white font-medium rounded-xl transition-colors disabled:opacity-70 w-full sm:w-auto"
          >
            {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Scheme' : 'Add Scheme')}
          </button>
        </div>
      </form>
    </div>
  );
}