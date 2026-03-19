'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { FileText, User, MapPin, Phone, Mail, IdCard, Calendar, Hash, DollarSign, Building, Edit, Save, X, Info, File } from 'lucide-react';

interface ExtractedField {
  id: string;
  user_id: string;
  document_id: string;
  field_type: string;
  field_value: string;
  created_at: string;
}

interface Document {
  id: string;
  name: string;
  category: string;
  url: string;
  created_at: string;
}

interface IncomeData {
  year: string;
  amount: string;
}

interface ExtractedDataDisplayProps {
  userId: string;
  refreshTrigger: boolean;
}

export default function ExtractedDataDisplay({ userId, refreshTrigger }: ExtractedDataDisplayProps) {
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch extracted fields
        const { data: fieldsData, error: fieldsError } = await supabase
          .from('extracted_document_data')  
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (fieldsError) {
          console.error('Error fetching extracted fields:', fieldsError);
        } else {
          setExtractedFields(fieldsData || []);
        }
        
        // Fetch documents
        const { data: docsData, error: docsError } = await supabase
          .from('documents')
          .select('id, name, category, url, created_at')
          .eq('user_id', userId);
          
        if (docsError) {
          console.error('Error fetching documents:', docsError);
        } else {
          setDocuments(docsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId, refreshTrigger]);

  const getDocumentName = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    return doc ? doc.name : 'Unknown Document';
  };

  const getDocumentCategory = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    return doc ? doc.category : 'unknown';
  };

  const getDocumentUrl = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    return doc ? doc.url : '';
  };

  const getFieldIcon = (fieldType: string) => {
    switch (fieldType) {
      case 'name':
        return <User className="h-5 w-5" />;
      case 'address':
        return <MapPin className="h-5 w-5" />;
      case 'phone':
        return <Phone className="h-5 w-5" />;
      case 'email':
        return <Mail className="h-5 w-5" />;
      case 'aadhaar':
      case 'pan':
        return <IdCard className="h-5 w-5" />;
      case 'dob':
        return <Calendar className="h-5 w-5" />;
      case 'income':
        return <DollarSign className="h-5 w-5" />;
      case 'bank':
        return <Building className="h-5 w-5" />;
      default:
        return <Hash className="h-5 w-5" />;
    }
  };

  const getFieldLabel = (fieldType: string) => {
    switch (fieldType) {
      case 'name':
        return 'Full Name';
      case 'address':
        return 'Address';
      case 'phone':
        return 'Phone Number';
      case 'email':
        return 'Email Address';
      case 'aadhaar':
        return 'Aadhaar Number';
      case 'pan':
        return 'PAN Number';
      case 'dob':
        return 'Date of Birth';
      case 'gender':
        return 'Gender';
      case 'income':
        return 'Income Details';
      case 'bank':
        return 'Bank Details';
      case 'certificate_number':
        return 'Certificate Number';
      case 'date_of_issue':
        return 'Date of Issue';
      case 'date_of_expiry':
        return 'Date of Expiry';
      case 'issuing_authority':
        return 'Issuing Authority';
      default:
        return fieldType.charAt(0).toUpperCase() + fieldType.slice(1).replace(/_/g, ' ');
    }
  };

  const formatFieldValue = (fieldType: string, fieldValue: string) => {
    try {
      if (fieldType === 'income') {
        const incomeData = JSON.parse(fieldValue) as IncomeData[];
        if (Array.isArray(incomeData)) {
          return (
            <div className="space-y-2">
              <div className="text-sm font-medium text-[#102542ff]">Annual Income Details:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {incomeData.map((income, index) => (
                  <div key={index} className="bg-[rgba(16,37,66,0.05)] border border-[#e5e7eb] rounded-lg">
                    <div className="text-sm font-medium text-[#102542ff]">{income.year}</div>
                    <div className="text-lg font-bold text-[#f87060ff]">{income.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
      }
      return <span className="text-[#102542ff]">{fieldValue}</span>;
    } catch (e) {
      return <span className="text-[#102542ff]">{fieldValue}</span>;
    }
  };

  const startEditing = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setTempValue(field.field_value);
  };

  const cancelEditing = () => {
    setEditingFieldId(null);
    setTempValue('');
  };

  const saveField = async (fieldId: string) => {
    setSaving(fieldId);
    
    try {
      const { error } = await supabase
        .from('extracted_document_data')
        .update({ field_value: tempValue })
        .eq('id', fieldId);
        
      if (error) {
        console.error('Error updating field:', error);
        return;
      }
      
      // Update local state
      setExtractedFields(prev => 
        prev.map(field => 
          field.id === fieldId ? { ...field, field_value: tempValue } : field
        )
      );
      
      setEditingFieldId(null);
      setTempValue('');
    } catch (error) {
      console.error('Error saving field:', error);
    } finally {
      setSaving(null);
    }
  };

  const renderFieldInput = (field: ExtractedField) => {
    if (field.field_type === 'income') {
      return (
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="w-full p-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060ff] min-h-[100px] text-sm"
          placeholder="Enter income data as JSON array"
        />
      );
    }
    
    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        className="w-full p-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f87060ff] text-sm"
        placeholder={`Enter ${getFieldLabel(field.field_type).toLowerCase()}`}
      />
    );
  };

  // Group fields by document
  const fieldsByDocument: Record<string, ExtractedField[]> = {};
  extractedFields.forEach(field => {
    if (!fieldsByDocument[field.document_id]) {
      fieldsByDocument[field.document_id] = [];
    }
    fieldsByDocument[field.document_id].push(field);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f87060ff]"></div>
      </div>
    );
  }

  if (extractedFields.length === 0 && documents.length === 0) {
    return (
      <div className="bg-gray-200 rounded-xl p-8 text-center">
        <FileText className="h-16 w-16 text-[#f87060ff] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-[#102542ff] mb-2">No Data Found</h3>
        <p className="text-[#6b7280]">Upload documents to see extracted information here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="">
          {Object.keys(fieldsByDocument).length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-[#f87060ff] mx-auto mb-3" />
              <p className="text-[#6b7280]">No extracted information found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(fieldsByDocument).map(([documentId, fields]) => {
                const document = documents.find(d => d.id === documentId);
                return (
                  <div key={documentId} className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                    <div className="bg-[rgba(16,37,66,0.05)] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center">
                        <File className="h-5 w-5 text-[#102542ff] mr-3" />
                        <div>
                          <h3 className="font-semibold text-[#102542ff]">{document?.name || 'Unknown Document'}</h3>
                          <Badge variant="outline" className="mt-1 border-[#e5e7eb] text-[#6b7280]">
                            {document?.category || 'unknown'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-[#6b7280]">
                        {document?.created_at ? new Date(document.created_at).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field) => (
                          <div key={field.id} className="border border-[#e5e7eb] rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-[rgba(16,37,66,0.1)] text-[#102542ff] mr-3">
                                  {getFieldIcon(field.field_type)}
                                </div>
                                <h3 className="text-lg font-semibold text-[#102542ff]">
                                  {getFieldLabel(field.field_type)}
                                </h3>
                              </div>
                              {editingFieldId === field.id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => saveField(field.id)}
                                    disabled={saving === field.id}
                                    className="p-2 bg-[#f87060ff] cusror-pointer text-white rounded-lg hover:bg-[#e55a4aff] disabled:opacity-50"
                                  >
                                    {saving === field.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                      <Save className="h-4 w-4" />
                                    )}
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="p-2 bg-[#6b7280] cusror-pointer text-white rounded-lg hover:bg-[#4b5563]"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => startEditing(field)}
                                  className="p-2 bg-[#f87060ff] text-white cusror-pointer rounded-lg hover:bg-[#e55a4aff]"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            
                            <div className="mt-3">
                              {editingFieldId === field.id ? (
                                <div className="space-y-2">
                                  {renderFieldInput(field)}
                                  {field.field_type === 'income' && (
                                    <div className="text-xs text-[#6b7280] bg-[rgba(16,37,66,0.05)] p-2 rounded">
                                      <p className="font-medium">Format:</p>
                                      <p className="font-mono text-xs mt-1">[{"{\"year\":\"2021-2022\",\"amount\":\"₹42,000\"}"}]</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-[#102542ff]">
                                  {formatFieldValue(field.field_type, field.field_value)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}