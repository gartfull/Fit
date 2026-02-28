import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FormSchema, FormField } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { CheckCircle2, Send } from 'lucide-react';
import { cn } from '../lib/utils';

export const ClientFormViewer = ({ form }: { form: FormSchema }) => {
  const { currentClientId, submitClientForm } = useAppContext();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (fieldId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const current = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...current, option] };
      } else {
        return { ...prev, [fieldId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  const getAllFields = (fields: FormField[]): FormField[] => {
    let all: FormField[] = [];
    for (const f of fields) {
      all.push(f);
      if (f.type === 'row' && f.columns) {
        for (const col of f.columns) {
          all = all.concat(getAllFields(col));
        }
      }
    }
    return all;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClientId) return;

    const allFields = getAllFields(form.fields);
    
    // Basic validation for required fields
    const missingRequired = allFields.filter(f => f.required && !answers[f.id] && f.type !== 'row');
    if (missingRequired.length > 0) {
      alert(`Пожалуйста, заполните обязательные поля: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    
    // Map answers to dbName if available
    const finalAnswers: Record<string, any> = {};
    Object.entries(answers).forEach(([key, value]) => {
      const field = allFields.find(f => f.id === key);
      if (field) {
        const finalKey = field.dbName || field.label || key;
        finalAnswers[finalKey] = value;
      }
    });

    setTimeout(() => {
      submitClientForm(currentClientId, form.id, finalAnswers);
      setSubmitted(true);
      setIsSubmitting(false);
    }, 800);
  };

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto mt-12 text-center p-8">
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-serif text-slate-800">Анкета успешно отправлена!</h2>
          <p className="text-slate-500">Ваш тренер получит уведомление и скоро свяжется с вами.</p>
        </CardContent>
      </Card>
    );
  }

  const renderField = (field: FormField) => {
    if (field.type === 'row') {
      return (
        <div className={cn("grid gap-6 mb-6", `grid-cols-1 md:grid-cols-${field.columns?.length || 1}`)} style={{ gridTemplateColumns: `repeat(${field.columns?.length || 1}, minmax(0, 1fr))` }}>
          {field.columns?.map((col, cIdx) => (
            <div key={cIdx} className="space-y-6">
              {col.map(f => (
                <div key={f.id} className="space-y-2">
                  {f.type !== 'section' && f.type !== 'html' && f.type !== 'row' && (
                    <label className="block text-sm font-medium text-slate-800 ml-1">
                      {f.label} {f.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  )}
                  {renderField(f)}
                </div>
              ))}
            </div>
          ))}
        </div>
      );
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
      case 'date':
      case 'file':
        return (
          <Input 
            type={field.type === 'file' ? 'file' : field.type === 'date' ? 'date' : field.type} 
            placeholder={field.placeholder} 
            required={field.required}
            value={answers[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <textarea 
            className="w-full rounded-2xl border-transparent bg-[#F5F2EB] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A] transition-all resize-y" 
            placeholder={field.placeholder} 
            required={field.required}
            rows={field.rowsCount || 3}
            value={answers[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
          />
        );
      case 'dropdown':
      case 'multiselect':
        return (
          <select 
            className="w-full rounded-2xl border-transparent bg-[#F5F2EB] px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B49A] transition-all"
            required={field.required}
            multiple={field.type === 'multiselect'}
            value={answers[field.id] || (field.type === 'multiselect' ? [] : '')}
            onChange={e => {
              if (field.type === 'multiselect') {
                const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                handleChange(field.id, values);
              } else {
                handleChange(field.id, e.target.value);
              }
            }}
          >
            <option value="" disabled>{field.placeholder || 'Выберите вариант...'}</option>
            {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-3 mt-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name={field.id}
                  value={opt}
                  required={field.required}
                  checked={answers[field.id] === opt}
                  onChange={e => handleChange(field.id, e.target.value)}
                  className="w-4 h-4 text-[#E2B49A] border-slate-300 focus:ring-[#E2B49A]" 
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-3 mt-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  value={opt}
                  checked={(answers[field.id] || []).includes(opt)}
                  onChange={e => handleCheckboxChange(field.id, opt, e.target.checked)}
                  className="w-4 h-4 rounded text-[#E2B49A] border-slate-300 focus:ring-[#E2B49A]" 
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'section':
        return <hr className="border-t border-[#E2B49A]/20 my-8" />;
      case 'html':
        return <div className="prose prose-sm max-w-none text-slate-600 my-4" dangerouslySetInnerHTML={{ __html: field.htmlContent || '' }} />;
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-md border-white/50 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-8 border-b border-[#E2B49A]/10">
        <CardTitle className="text-3xl font-serif text-slate-800">{form.title}</CardTitle>
        <CardDescription className="text-slate-500 mt-2">Пожалуйста, заполните все обязательные поля</CardDescription>
      </CardHeader>
      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map(field => (
            <div key={field.id} className="space-y-2">
              {field.type !== 'section' && field.type !== 'html' && field.type !== 'row' && (
                <label className="block text-sm font-medium text-slate-800 ml-1">
                  {field.label} {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {renderField(field)}
            </div>
          ))}
          
          <div className="pt-6 border-t border-[#E2B49A]/10 flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto rounded-full px-8">
              {isSubmitting ? 'Отправка...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Отправить анкету
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
