import React, { useState, useEffect } from 'react';
import { Button, Input } from '@repo/ui';
import { apiClient } from "@shared/api/client";
import { useAlertStore } from "@shared/store/useAlertStore";
import { X, Trash2, Edit2, Save, Search } from 'lucide-react';

export const AiModelSettingsModal = ({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) => {
  const { openAlert } = useAlertStore();
  const [models, setModels] = useState<any[]>([]);
  const [editSeq, setEditSeq] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({
    aiType: 'OPENAI_GPT4O',
    aiModelNm: '',
    aiBaseUrl: 'https://api.openai.com',
    aiApiKey: '',
    aiTemperature: 0.7
  });

  const [availableRemoteModels, setAvailableRemoteModels] = useState<string[]>([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);

  const loadModels = () => {
    apiClient.axios.get('/api/ai/models').then((res: any) => setModels(res.data?.data || []));
  };

  useEffect(() => {
    if (isOpen) loadModels();
  }, [isOpen]);

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    let newBaseUrl = formData.aiBaseUrl;

    // 자동 Base URL 매핑
    if (newType === 'OLLAMA') {
      newBaseUrl = '';
    } else if (newType.includes('OPENAI')) {
      if (!newBaseUrl || newBaseUrl.includes('generative') || newBaseUrl.includes('anthropic')) {
        newBaseUrl = 'https://api.openai.com';
      }
    } else if (newType.includes('GEMINI')) {
      newBaseUrl = 'https://generativelanguage.googleapis.com';
    } else if (newType === 'CLAUDE') {
      newBaseUrl = 'https://api.anthropic.com';
    }

    setFormData({ ...formData, aiType: newType, aiBaseUrl: newBaseUrl, aiModelNm: '' });
    setAvailableRemoteModels([]); // 모델 리스트 초기화
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    let newType = formData.aiType;
    let newBaseUrl = formData.aiBaseUrl;

    if (newKey.startsWith('AIza')) {
      newType = 'GEMINI';
      newBaseUrl = 'https://generativelanguage.googleapis.com';
    } else if (newKey.includes('-ant-')) {
      newType = 'CLAUDE';
      newBaseUrl = 'https://api.anthropic.com';
    } else if (newKey.startsWith('sk-')) {
      if (newType !== 'AZURE_OPENAI') {
        newType = 'OPENAI';
        if (!newBaseUrl || newBaseUrl.includes('generative') || newBaseUrl.includes('anthropic')) {
          newBaseUrl = 'https://api.openai.com';
        }
      }
    }

    setFormData((prev: any) => ({ ...prev, aiApiKey: newKey, aiType: newType, aiBaseUrl: newBaseUrl }));
  };

  const fetchRemoteModels = async () => {
    if (!formData.aiApiKey) {
      openAlert({ message: "API Key를 먼저 입력해주세요." });
      return;
    }

    setIsFetchingModels(true);
    setAvailableRemoteModels([]);

    try {
      if (formData.aiType?.includes("OPENAI")) {
        const baseUrl = formData.aiBaseUrl || 'https://api.openai.com';
        const url = new URL('/v1/models', baseUrl).toString();
        const res = await fetch(url, { headers: { Authorization: `Bearer ${formData.aiApiKey}` } });
        if (!res.ok) throw new Error("API 요청 실패");
        const data = await res.json();
        const modelNames = data.data.map((m: any) => m.id).sort();
        setAvailableRemoteModels(modelNames);
        if (modelNames.length > 0 && !modelNames.includes(formData.aiModelNm)) {
           setFormData((prev: any) => ({ ...prev, aiModelNm: modelNames[0] }));
        }
      } else if (formData.aiType?.includes("GEMINI")) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${formData.aiApiKey}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("API 요청 실패");
        const data = await res.json();
        const modelNames = data.models.map((m: any) => m.name.replace('models/', ''));
        setAvailableRemoteModels(modelNames);
        if (modelNames.length > 0 && !modelNames.includes(formData.aiModelNm)) {
           setFormData((prev: any) => ({ ...prev, aiModelNm: modelNames[0] }));
        }
      } else {
        openAlert({ message: "해당 AI 제공자는 모델 자동 조회를 지원하지 않거나 CORS 정책으로 인해 브라우저 직접 조회가 차단된 제공자입니다. 모델명을 하단에 직접 입력해주세요." });
      }
    } catch (e) {
      console.error(e);
      openAlert({ message: "모델 조회에 실패했습니다. API Key가 잘못되었거나 Base URL을 확인해주세요." });
    } finally {
      setIsFetchingModels(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editSeq) {
        await apiClient.axios.put(`/api/ai/models/${editSeq}`, formData);
      } else {
        await apiClient.axios.post('/api/ai/models', formData);
      }
      setEditSeq(null);
      setFormData({ aiType: 'OPENAI_GPT4O', aiModelNm: '', aiBaseUrl: 'https://api.openai.com', aiApiKey: '', aiTemperature: 0.7 });
      setAvailableRemoteModels([]);
      loadModels();
      onRefresh();
    } catch (err) {
      openAlert({ message: "모델 저장에 실패했습니다." });
    }
  };

  const handleDelete = (seq: number) => {
    openAlert({
      message: '정말 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await apiClient.axios.delete(`/api/ai/models/${seq}`);
          loadModels();
          onRefresh();
        } catch (err) {
          openAlert({ message: "모델 삭제에 실패했습니다." });
        }
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={e => e.stopPropagation()}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">사용자 AI 모델(Connection) 관리</h2>
          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); onClose(); }} className="text-gray-500 hover:text-black">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-2">
          {models.length === 0 ? <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">등록된 모델이 없습니다. 새 모델을 추가해보세요.</p> : null}
          {models.map(m => (
            <div key={m.connectionSeq} className="border border-gray-200 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 gap-2">
              <div className="w-full sm:w-auto overflow-hidden">
                <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                  {m.aiModelNm}
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{m.aiType}</span>
                </p>
                <p className="text-xs text-gray-500 truncate w-full">{m.aiBaseUrl}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="h32" onClick={() => { setEditSeq(m.connectionSeq); setFormData(m); setAvailableRemoteModels([]); }}>
                  <Edit2 className="h-3" />수정
                </Button>
                <Button variant="destructive" size="h32" onClick={() => handleDelete(m.connectionSeq)}>
                  <Trash2 className="h-3" />삭제
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Form */}
        <div className="mt-4 border-t border-gray-200 pt-5">
          <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2">
            {editSeq ? <Edit2 className="w-4 h-4 text-primary" /> : <Save className="w-4 h-4 text-primary" />}
            {editSeq ? '모델 수정' : '새 모델 추가'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

            {/* API Key (Top) */}
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">API Key</label>
              <Input type="password" value={formData.aiApiKey || ''} onChange={handleApiKeyChange} placeholder="sk-... 또는 AIza..." className="bg-white border-gray-300" />
            </div>

            {/* Provider */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">AI 제공자 (Provider)</label>
              <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                value={formData.aiType || 'OPENAI_GPT4O'}
                onChange={handleProviderChange}>
                <option value="OPENAI">OpenAI</option>
                <option value="GEMINI">Google Gemini</option>
                <option value="AZURE_OPENAI">Azure OpenAI</option>
                <option value="CLAUDE">Anthropic Claude</option>
                <option value="OLLAMA">Ollama (로컬 LLM)</option>
              </select>
            </div>

            {/* Base URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700">Base URL (API 엔드포인트)</label>
              <Input value={formData.aiBaseUrl || ''} onChange={e => setFormData({...formData, aiBaseUrl: e.target.value})} placeholder="https://api.openai.com" className="bg-white border-gray-300" maxLength={255} />
            </div>

            {/* Dynamic Model Dropdown */}
            <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
              <div className="flex justify-between items-end mb-1">
                <label className="text-xs font-semibold text-gray-700">모델명 (Model ID)</label>
                <Button type="button" variant="outline" className="h-7 text-xs px-3 shadow-sm border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100" onClick={fetchRemoteModels} disabled={isFetchingModels || !formData.aiApiKey}>
                  <Search className="w-3 h-3 mr-1" />
                  {isFetchingModels ? '불러오는 중...' : '입력한 키로 사용 가능한 모델 조회'}
                </Button>
              </div>

              {availableRemoteModels.length > 0 ? (
                <select className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                  value={formData.aiModelNm || ''}
                  onChange={e => setFormData({...formData, aiModelNm: e.target.value})}>
                  <option value="">-- 스크롤하여 조회된 모델을 선택하세요 --</option>
                  {availableRemoteModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <Input value={formData.aiModelNm || ''} onChange={e => setFormData({...formData, aiModelNm: e.target.value})} placeholder="직접 입력 (예: gpt-4o)" className="bg-white border-gray-300" maxLength={100} />
              )}
              <p className="text-[10px] text-gray-500 mt-1">API Key를 먼저 입력하고 우측 조회 버튼을 누르면 원격에서 사용 가능한 모델 목록({formData.aiType})을 실시간으로 불러옵니다.</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {editSeq &&
              <Button variant="outline" onClick={() => {
                setEditSeq(null);
                setFormData({ aiType: 'OPENAI_GPT4O', aiModelNm: '', aiBaseUrl: 'https://api.openai.com', aiApiKey: '', aiTemperature: 0.7 });
                setAvailableRemoteModels([]);
              }}>
                취소
              </Button>
            }
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />{editSeq ? '변경사항 저장' : '등록'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
