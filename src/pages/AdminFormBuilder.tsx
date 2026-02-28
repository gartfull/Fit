import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { FormField, FieldType, FormSchema } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Type, Mail, Hash, KeyRound, AlignLeft, 
  ChevronDown, CheckSquare, CircleDot, ListPlus, 
  Calendar, Upload, Minus, Code, Columns,
  Plus, Trash2, ArrowUp, ArrowDown, Save, Send
} from 'lucide-react';
import { cn } from '../lib/utils';

const FIELD_TYPES: { type: FieldType; label: string; icon: React.ElementType }[] = [
  { type: 'row', label: 'Row Container', icon: Columns },
  { type: 'text', label: 'Single Line Text', icon: Type },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'password', label: 'Password', icon: KeyRound },
  { type: 'textarea', label: 'Text Area', icon: AlignLeft },
  { type: 'dropdown', label: 'Dropdown', icon: ChevronDown },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio Buttons', icon: CircleDot },
  { type: 'multiselect', label: 'Multiple Select', icon: ListPlus },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'section', label: 'Section Break', icon: Minus },
  { type: 'html', label: 'Custom HTML', icon: Code },
];

export const AdminFormBuilder = () => {
  const { clients, assignFormToClient, forms, addForm, updateForm } = useAppContext();
  
  const [formTitle, setFormTitle] = useState('Новая анкета');
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  
  const [assignClientId, setAssignClientId] = useState<string>('');
  
  // To track where to add the next field
  const [targetContainer, setTargetContainer] = useState<{ parentId: string, colIndex: number } | null>(null);

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type} field`,
      placeholder: '',
      required: false,
      options: ['Option 1', 'Option 2'],
      htmlContent: '<p>Custom HTML content</p>',
      dbName: `field_${Date.now()}`,
      rowsCount: 3,
      columns: type === 'row' ? [[]] : undefined
    };

    if (targetContainer) {
      setFields(prev => {
        const addRecursive = (list: FormField[]): FormField[] => {
          return list.map(f => {
            if (f.id === targetContainer.parentId && f.type === 'row' && f.columns) {
              const newCols = [...f.columns];
              newCols[targetContainer.colIndex] = [...newCols[targetContainer.colIndex], newField];
              return { ...f, columns: newCols };
            }
            if (f.type === 'row' && f.columns) {
              return { ...f, columns: f.columns.map(c => addRecursive(c)) };
            }
            return f;
          });
        };
        return addRecursive(prev);
      });
      setTargetContainer(null); // Reset after adding
    } else {
      setFields([...fields, newField]);
    }
    setSelectedFieldId(newField.id);
  };

  const updateFieldRecursive = (list: FormField[], id: string, updates: Partial<FormField>): FormField[] => {
    return list.map(f => {
      if (f.id === id) {
        return { ...f, ...updates };
      }
      if (f.type === 'row' && f.columns) {
        return { ...f, columns: f.columns.map(c => updateFieldRecursive(c, id, updates)) };
      }
      return f;
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(prev => updateFieldRecursive(prev, id, updates));
  };

  const removeFieldRecursive = (list: FormField[], id: string): FormField[] => {
    return list.filter(f => f.id !== id).map(f => {
      if (f.type === 'row' && f.columns) {
        return { ...f, columns: f.columns.map(c => removeFieldRecursive(c, id)) };
      }
      return f;
    });
  };

  const removeField = (id: string) => {
    setFields(prev => removeFieldRecursive(prev, id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  };

  const moveField = (index: number, direction: 'up' | 'down', parentList: FormField[], parentId?: string, colIndex?: number) => {
    const newList = [...parentList];
    if (direction === 'up' && index > 0) {
      [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    } else if (direction === 'down' && index < newList.length - 1) {
      [newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
    }

    if (!parentId) {
      setFields(newList);
    } else {
      setFields(prev => {
        const updateCols = (list: FormField[]): FormField[] => {
          return list.map(f => {
            if (f.id === parentId && f.type === 'row' && f.columns && colIndex !== undefined) {
              const newCols = [...f.columns];
              newCols[colIndex] = newList;
              return { ...f, columns: newCols };
            }
            if (f.type === 'row' && f.columns) {
              return { ...f, columns: f.columns.map(c => updateCols(c)) };
            }
            return f;
          });
        };
        return updateCols(prev);
      });
    }
  };

  const handleAssign = () => {
    if (!assignClientId) {
      alert('Выберите клиента');
      return;
    }
    if (fields.length === 0) {
      alert('Форма пуста');
      return;
    }

    const formSchema: FormSchema = {
      id: editingFormId || `form-${Date.now()}`,
      title: formTitle,
      fields
    };

    assignFormToClient(assignClientId, formSchema);
    alert('Форма успешно назначена клиенту!');
    setAssignClientId('');
  };

  const handleSaveForm = () => {
    if (fields.length === 0) {
      alert('Форма пуста');
      return;
    }
    
    if (editingFormId) {
      updateForm(editingFormId, {
        id: editingFormId,
        title: formTitle,
        fields
      });
      alert('Форма обновлена!');
    } else {
      const newFormId = `form-${Date.now()}`;
      addForm({
        id: newFormId,
        title: formTitle,
        fields
      });
      setEditingFormId(newFormId);
      alert('Форма сохранена!');
    }
  };

  const renderFieldInput = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
      case 'date':
      case 'file':
        return <Input type={field.type === 'file' ? 'file' : field.type === 'date' ? 'date' : 'text'} placeholder={field.placeholder} disabled className="bg-slate-50" />;
      case 'textarea':
        return <textarea className="w-full rounded-2xl border-transparent bg-slate-50 px-4 py-2 text-sm" placeholder={field.placeholder} disabled rows={field.rowsCount || 3} />;
      case 'dropdown':
      case 'multiselect':
        return (
          <select className="w-full rounded-2xl border-transparent bg-slate-50 px-4 py-2 text-sm" disabled>
            <option>{field.placeholder || 'Select option'}</option>
            {field.options?.map((opt, i) => <option key={i}>{opt}</option>)}
          </select>
        );
      case 'radio':
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input type={field.type} disabled className="rounded text-[#E2B49A] focus:ring-[#E2B49A]" />
                <span className="text-sm text-slate-600">{opt}</span>
              </div>
            ))}
          </div>
        );
      case 'section':
        return <hr className="border-t border-slate-200 my-4" />;
      case 'html':
        return <div className="p-4 bg-slate-50 rounded-2xl text-sm" dangerouslySetInnerHTML={{ __html: field.htmlContent || '' }} />;
      default:
        return null;
    }
  };

  const renderField = (field: FormField, index: number, parentList: FormField[], parentId?: string, colIndex?: number) => {
    if (field.type === 'row') {
      return (
        <div 
          key={field.id}
          onClick={(e) => { e.stopPropagation(); !isPreview && setSelectedFieldId(field.id); }}
          className={cn(
            "p-4 rounded-2xl bg-white transition-all mb-4",
            !isPreview && "cursor-pointer border-2",
            !isPreview && selectedFieldId === field.id ? "border-[#E2B49A] shadow-md" : "border-transparent shadow-sm hover:border-[#E2B49A]/30"
          )}
        >
          {!isPreview && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Row Container ({field.columns?.length || 1} cols)</span>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); moveField(index, 'up', parentList, parentId, colIndex); }} disabled={index === 0}>
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); moveField(index, 'down', parentList, parentId, colIndex); }} disabled={index === parentList.length - 1}>
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); removeField(field.id); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          
          <div className={cn("grid gap-4", `grid-cols-${field.columns?.length || 1}`)} style={{ gridTemplateColumns: `repeat(${field.columns?.length || 1}, minmax(0, 1fr))` }}>
            {field.columns?.map((col, cIdx) => (
              <div key={cIdx} className={cn("min-h-[100px] p-2 rounded-xl", !isPreview && "border border-dashed border-slate-200 bg-slate-50/50")}>
                {col.map((f, fIdx) => renderField(f, fIdx, col, field.id, cIdx))}
                
                {!isPreview && (
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-slate-400 hover:text-[#E2B49A] hover:bg-[#F4E7E1]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTargetContainer({ parentId: field.id, colIndex: cIdx });
                    }}
                  >
                    {targetContainer?.parentId === field.id && targetContainer?.colIndex === cIdx ? 'Выберите поле слева...' : '+ Добавить поле'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div 
        key={field.id}
        onClick={(e) => { e.stopPropagation(); !isPreview && setSelectedFieldId(field.id); }}
        className={cn(
          "p-6 rounded-2xl bg-white transition-all mb-4",
          !isPreview && "cursor-pointer border-2",
          !isPreview && selectedFieldId === field.id ? "border-[#E2B49A] shadow-md" : "border-transparent shadow-sm hover:border-[#E2B49A]/30"
        )}
      >
        {!isPreview && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{field.type}</span>
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); moveField(index, 'up', parentList, parentId, colIndex); }} disabled={index === 0}>
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); moveField(index, 'down', parentList, parentId, colIndex); }} disabled={index === parentList.length - 1}>
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); removeField(field.id); }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {field.type !== 'section' && field.type !== 'html' && (
          <label className="block text-sm font-medium text-slate-800 mb-2">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        {renderFieldInput(field)}
      </div>
    );
  };

  // Find selected field recursively
  const findField = (list: FormField[], id: string): FormField | undefined => {
    for (const f of list) {
      if (f.id === id) return f;
      if (f.type === 'row' && f.columns) {
        for (const col of f.columns) {
          const found = findField(col, id);
          if (found) return found;
        }
      }
    }
    return undefined;
  };

  const selectedField = selectedFieldId ? findField(fields, selectedFieldId) : undefined;

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-wide text-slate-800">Конструктор анкет</h1>
          <p className="text-slate-500 mt-2">Создание динамических форм и назначение клиентам</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2 bg-white p-1 rounded-full shadow-sm border border-[#E2B49A]/20">
            <select 
              className="bg-transparent border-none text-sm focus:ring-0 pl-3 pr-8 py-1 max-w-[200px] truncate"
              value={editingFormId || ''}
              onChange={e => {
                const formId = e.target.value;
                if (!formId) {
                  setEditingFormId(null);
                  setFormTitle('Новая анкета');
                  setFields([]);
                  setSelectedFieldId(null);
                } else {
                  const form = forms.find(f => f.id === formId);
                  if (form) {
                    setEditingFormId(form.id);
                    setFormTitle(form.title);
                    setFields(form.fields);
                    setSelectedFieldId(null);
                  }
                }
              }}
            >
              <option value="">+ Новая анкета</option>
              {forms.map(f => (
                <option key={f.id} value={f.id}>{f.title}</option>
              ))}
            </select>
            <Button size="sm" variant="ghost" onClick={handleSaveForm} className="rounded-full text-[#E2B49A] hover:text-[#E2B49A] hover:bg-[#F4E7E1]">
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
          </div>
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? 'Редактор' : 'Предпросмотр'}
          </Button>
          <div className="flex items-center space-x-2 bg-white p-1 rounded-full shadow-sm border border-[#E2B49A]/20">
            <select 
              className="bg-transparent border-none text-sm focus:ring-0 pl-3 pr-8 py-1"
              value={assignClientId}
              onChange={e => setAssignClientId(e.target.value)}
            >
              <option value="">Выберите клиента...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Button size="sm" onClick={handleAssign} className="rounded-full">
              <Send className="w-4 h-4 mr-2" />
              Назначить
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Sidebar - Field Types */}
        {!isPreview && (
          <Card className="w-64 shrink-0 overflow-y-auto">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-sans font-medium text-slate-500 uppercase tracking-wider">Доступные поля</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {FIELD_TYPES.map(ft => (
                <button
                  key={ft.type}
                  onClick={() => addField(ft.type)}
                  className="w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-[#F4E7E1] hover:text-[#E2B49A] rounded-xl transition-colors"
                >
                  <ft.icon className="w-4 h-4 mr-3 stroke-[1.5]" />
                  {ft.label}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Center - Canvas */}
        <Card className="flex-1 overflow-y-auto bg-slate-50/50" onClick={() => setTargetContainer(null)}>
          <CardHeader className="bg-white sticky top-0 z-10 border-b border-slate-100">
            {isPreview ? (
              <h2 className="text-2xl font-serif text-center">{formTitle}</h2>
            ) : (
              <Input 
                value={formTitle} 
                onChange={e => setFormTitle(e.target.value)} 
                className="text-xl font-serif font-medium bg-transparent border-none focus-visible:ring-0 px-0 h-auto"
              />
            )}
          </CardHeader>
          <CardContent className="p-6">
            {fields.length === 0 ? (
              <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                Добавьте поля из левой панели
              </div>
            ) : (
              fields.map((field, index) => renderField(field, index, fields))
            )}
          </CardContent>
        </Card>

        {/* Right Sidebar - Properties */}
        {!isPreview && selectedField && (
          <Card className="w-80 shrink-0 overflow-y-auto">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-sans font-medium text-slate-500 uppercase tracking-wider">Настройки поля</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {selectedField.type === 'row' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">Количество колонок (1-6)</label>
                  <Input 
                    type="number" 
                    min={1} 
                    max={6} 
                    value={selectedField.columns?.length || 1} 
                    onChange={e => {
                      const count = Math.min(6, Math.max(1, parseInt(e.target.value) || 1));
                      const currentCols = selectedField.columns || [];
                      let newCols = [...currentCols];
                      if (count > currentCols.length) {
                        for (let i = currentCols.length; i < count; i++) {
                          newCols.push([]);
                        }
                      } else if (count < currentCols.length) {
                        newCols = newCols.slice(0, count);
                      }
                      updateField(selectedField.id, { columns: newCols });
                    }} 
                  />
                </div>
              )}

              {selectedField.type !== 'section' && selectedField.type !== 'html' && selectedField.type !== 'row' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">Label</label>
                    <Input value={selectedField.label} onChange={e => updateField(selectedField.id, { label: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">DB Name Attribute</label>
                    <Input value={selectedField.dbName || ''} onChange={e => updateField(selectedField.id, { dbName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500">Placeholder</label>
                    <Input value={selectedField.placeholder || ''} onChange={e => updateField(selectedField.id, { placeholder: e.target.value })} />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="required"
                      checked={selectedField.required || false}
                      onChange={e => updateField(selectedField.id, { required: e.target.checked })}
                      className="rounded text-[#E2B49A] focus:ring-[#E2B49A]"
                    />
                    <label htmlFor="required" className="text-sm text-slate-700">Обязательное поле</label>
                  </div>
                </>
              )}

              {selectedField.type === 'textarea' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">Rows count (3-10)</label>
                  <Input 
                    type="number" 
                    min={3} 
                    max={10} 
                    value={selectedField.rowsCount || 3} 
                    onChange={e => updateField(selectedField.id, { rowsCount: parseInt(e.target.value) || 3 })} 
                  />
                </div>
              )}

              {(selectedField.type === 'dropdown' || selectedField.type === 'radio' || selectedField.type === 'checkbox' || selectedField.type === 'multiselect') && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-xs font-medium text-slate-500">Options</label>
                  {selectedField.options?.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Input 
                        value={opt} 
                        onChange={e => {
                          const newOptions = [...(selectedField.options || [])];
                          newOptions[i] = e.target.value;
                          updateField(selectedField.id, { options: newOptions });
                        }}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          const newOptions = [...(selectedField.options || [])];
                          newOptions.splice(i, 1);
                          updateField(selectedField.id, { options: newOptions });
                        }}
                        disabled={(selectedField.options?.length || 0) <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      const newOptions = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                      updateField(selectedField.id, { options: newOptions });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить опцию
                  </Button>
                </div>
              )}

              {selectedField.type === 'html' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500">HTML Content</label>
                  <textarea 
                    className="w-full rounded-2xl border-transparent bg-[#F5F2EB] px-4 py-2 text-sm focus:ring-[#E2B49A] font-mono"
                    rows={6}
                    value={selectedField.htmlContent || ''}
                    onChange={e => updateField(selectedField.id, { htmlContent: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
