import { Bot, X, Send, User, Settings2, Wrench, Paperclip, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent, CardFooter, Input } from '@repo/ui';
import { apiClient } from "@shared/api/client";
import { AiModelSettingsModal } from './AiModelSettingsModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAiChatStore, type Message } from '@shared/store/useAiChatStore';
import { useAlertStore } from '@shared/store/useAlertStore';

// 에러 바운더리 유지
class ChatErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-6 right-6 z-[9999] p-4 bg-white border border-red-500 rounded-lg text-red-500 text-sm overflow-auto max-h-[500px] w-96 shadow-2xl">
          <h3 className="font-bold mb-2">UI 렌더링 에러 발생</h3>
          <pre className="whitespace-pre-wrap font-mono text-xs bg-red-50 p-2 rounded">{this.state.error?.toString()}</pre>
          <Button type="button" className="mt-4" onClick={() => this.setState({hasError: false})}>다시 시도</Button>
        </div>
      );
    }
    return this.props.children;
  }
}

const AiChatAgentInner = () => {
  const {
    isOpen, setIsOpen,
    isExpanded, setIsExpanded,
    messages, setMessages,
    pendingContext, setPendingContext,
    selectedModel, setSelectedModel,
    resetChat
  } = useAiChatStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { openAlert } = useAlertStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const reloadModels = () => {
    apiClient.axios.get('/api/ai/models')
      .then(res => {
        const models = res.data?.data || [];
        setAvailableModels(models);

        if (models.length > 0) {
          // 현재 선택된 모델이 유효한지 확인 (localStorage에 저장된 예전 ID일 수 있음)
          const isValid = models.some((m: any) => String(m.connectionSeq) === selectedModel);

          if (selectedModel === '0' || !isValid) {
            setSelectedModel(String(models[0].connectionSeq));
          }
        } else {
          // 등록된 모델이 하나도 없는 경우 폴백
          if (selectedModel !== '0') setSelectedModel('0');
        }
      })
      .catch(err => console.error("모델 목록 로드 실패:", err));
  };

  useEffect(() => {
    if (isOpen && availableModels.length === 0) {
      reloadModels();
    }
  }, [isOpen]);

  // 1. 파일 업로드 핸들러 수정
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', content: `📎 업로드된 문서: ${file.name}` }]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiClient.axios.post('/api/ai/agent/analyze', formData);

      const analysis = res.data?.data;
      if (analysis) {
        setPendingContext({
          fileToken: analysis.fileToken,
          systemSeq: analysis.systemSeq,
          docSeq: analysis.docSeq,
          fileName: file.name
        });

        const botMessageId = (Date.now() + 2).toString();
        setMessages(prev => [...prev, {
          id: botMessageId,
          role: 'assistant',
          content: analysis.message || `📄 분석을 완료했습니다. 시스템에 등록해 드릴까요?`
        }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: ` 분석 실패: ${err.message}` }]);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 새 대화 시작 (초기화)
  const handleResetChat = () => {
    openAlert({
      title: "새 대화 시작",
      message: "기존 대화 이력을 초기화하고 새 대화를 시작하시겠습니까?",
      confirmText: "확인",
      cancelText: "취소",
      onConfirm: () => {
        resetChat();
      }
    });
  };

  // 2. 메시지 전송 핸들러 수정
  const sendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userText = chatInput;
    setChatInput('');

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const botMessageId = (Date.now() + 1).toString();
      let isFirstChunk = true;

      let payloadMessage = userText;
      if (pendingContext) {
        payloadMessage += `\n\n(내부 참조: 현재 진행 중인 파일 토큰은 "${pendingContext.fileToken}", 시스템 시퀀스는 "${pendingContext.systemSeq}", 문서 번호는 "${pendingContext.docSeq}"이다. 사용자가 긍정하면 이 정보를 사용하여 registerJobProgress를 호출해.)`;
      }

      const recentMessages = messages.slice(-5).filter(m => m.role !== 'system');
      const historyStr = recentMessages.length > 0
        ? recentMessages.map(m => `[${m.role === 'user' ? '사용자' : 'AI'}]: ${m.content}`).join('\\n')
        : '';

      await apiClient.axios.post('/api/ai/chat', {
        message: payloadMessage,
        aiCode: selectedModel,
        history: historyStr
      }, {
        timeout: 0,
        onDownloadProgress: (progressEvent: any) => {
          const xhr = progressEvent.event?.target;
          if (xhr && xhr.responseText) {
            let fullText = '';
            const lines = xhr.responseText.split(/\r?\n/);
            let isFirstDataInEvent = true;

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i];
              if (line.startsWith('data:')) {
                let payload = line.substring(5).trim();
                if (!isFirstDataInEvent) fullText += '\\n';
                fullText += payload;
                isFirstDataInEvent = false;
              } else if (line === '') {
                isFirstDataInEvent = true;
              }
            }
            fullText = fullText.replace(/\\n/g, '\n');

            if (fullText) {
              if (fullText.includes("등록되었습니다") || fullText.includes("완료되었습니다")) {
                setPendingContext(null);
              }

              if (isFirstChunk) {
                setMessages(prev => [...prev, { id: botMessageId, role: 'assistant', content: fullText }]);
                isFirstChunk = false;
                setIsLoading(false);
              } else {
                setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, content: fullText } : msg));
              }
            }
          }
        }
      });
    } catch (error: any) {
      console.error('AI Chat Error:', error);
      setIsLoading(false);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: `오류 발생: ${error.message}` }]);
    }
  };

  return (
    <div
      className={`fixed z-50 flex flex-col items-end transition-all duration-300 ${isExpanded ? 'inset-0 bg-black/50 p-4' : 'bottom-[54px] right-6'}`}
      onClick={() => isExpanded && setIsExpanded(false)}
    >
      {isOpen && (
        <Card
          className={`shadow-2xl flex flex-col overflow-hidden border border-gray-200 bg-white transition-all duration-300 origin-bottom-right ${isExpanded ? 'w-full h-full max-w-5xl mx-auto rounded-xl' : 'w-80 sm:w-96 h-[550px] mb-4'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <CardHeader className="p-3 sm:p-4 bg-primary text-primary-foreground flex flex-row items-center justify-between shadow-sm min-h-[64px] shrink-0 w-full overflow-hidden">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-1 sm:gap-2 shrink-0">
                <Bot className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline shrink-0">AI Assistant</span>
              </CardTitle>
              <div className="flex items-center gap-1 bg-black/20 rounded-md px-1 sm:px-2 py-1 flex-1 min-w-0 overflow-hidden">
                <Button variant="ghost" size="icon" className="h-6 w-6 m-0 p-0 text-white hover:bg-white/20 shrink-0" onClick={() => setIsSettingsOpen(true)}>
                  <Settings2 className="w-4 h-4 opacity-90 shrink-0" />
                </Button>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-transparent text-xs font-medium outline-none cursor-pointer text-white w-full min-w-0 truncate [&>option]:text-black"
                >
                  {availableModels.length === 0 && <option value="0">사내 모델 (Ollama)</option>}
                  {availableModels.map(model => (
                    <option key={model.connectionSeq} value={String(model.connectionSeq)}>
                      {model.aiModelNm} ({model.aiType})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Button variant="ghost" size="icon" title="새 대화 시작" className="text-primary-foreground hover:bg-white/20 h-8 w-8 rounded-full shrink-0" onClick={handleResetChat}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 h-8 w-8 rounded-full shrink-0" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 h-8 w-8 rounded-full shrink-0" onClick={() => { setIsOpen(false); setIsExpanded(false); }}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 min-h-0" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-3">
                <div className="bg-primary/10 p-4 rounded-full"><Bot className="w-8 h-8 text-primary" /></div>
                <p className="text-sm">어떤 도움이 필요하신가요?</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white border border-gray-200 text-primary'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 whitespace-pre-wrap leading-relaxed rounded-2xl text-sm break-words flex flex-col gap-2 ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                    {m.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: (props) => <h1 className="text-base font-bold my-1" {...props} />,
                          h2: (props) => <h2 className="text-sm font-bold my-1 text-primary" {...props} />,
                          p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: (props) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                          ol: (props) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                          code: ({inline, ...props}: any) =>
                            inline ? <code className="bg-gray-100 text-red-500 px-1 py-0.5 rounded text-xs" {...props} />
                                   : <pre className="bg-gray-800 text-gray-100 p-3 rounded-md overflow-x-auto text-xs my-2"><code {...props} /></pre>
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    ) : ( m.content )}
                    {m.role === 'system' ? (
                       <span className="text-xs italic opacity-70 italic">{m.content}</span>
                    ) : null}
                    {m.toolInvocations?.map((tool: any) => (
                      <div key={tool.toolCallId} className="flex flex-col gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 p-2 rounded-md mt-1 w-full max-w-full">
                        <div className="flex items-center gap-1 font-medium text-primary"><Wrench className="w-3 h-3 shrink-0" /><span>도구 사용됨: {tool.toolName}</span></div>
                        {tool.state === 'result' ? <div className="text-green-600">완료되었습니다.</div> : <div className="animate-pulse">실행 중...</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-primary flex items-center justify-center shrink-0"><Bot className="w-4 h-4" /></div>
                <div className="p-3 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 items-center h-10 w-16 justify-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 bg-white border-t border-gray-100 shrink-0 flex flex-col gap-2">
            {/* 파일 컨텍스트 Chip (입력창 바로 위) */}
            {pendingContext && (
              <div className="w-full flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-full shadow-sm">
                  <Paperclip className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[11px] font-semibold text-primary truncate max-w-[200px]">
                    {pendingContext.fileName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingContext(null);
                      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', content: '파일 참조 컨텍스트가 해제되었습니다.' }]);
                    }}
                    className="ml-1 p-0.5 hover:bg-primary/10 rounded-full text-primary transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full gap-2 items-center">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.txt,.md,.json,.csv,.xlsx,.xls,.doc,.docx,.hwp" />
              <Button type="button" variant="ghost" size="icon" className="w-10 h-10 shrink-0 text-gray-400 hover:bg-gray-100 hover:text-primary rounded-full transition-colors" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    // 한글 등 IME 입력 중 Enter 시 중복 전송 및 잔여 글자 남음 방지
                    if (e.nativeEvent.isComposing) return;

                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="메시지를 입력하세요..."
                className="flex-1 border-gray-300 focus-visible:ring-primary rounded-full bg-gray-50 h-10 px-4 min-w-0"
              />
              <Button type="submit" size="icon" disabled={isLoading || !chatInput.trim()} className="w-10 h-10 shrink-0 hover:bg-primary/90 text-white rounded-full bg-primary flex items-center justify-center">
                <Send className="w-4 h-4 shrink-0" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center transition-transform hover:scale-105 shrink-0">
          <Bot className="w-7 h-7 text-white shrink-0" />
        </Button>
      )}
      {isSettingsOpen && <AiModelSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onRefresh={reloadModels} />}
    </div>
  );
};

export const AiChatAgent = () => (
  <ChatErrorBoundary>
    <AiChatAgentInner />
  </ChatErrorBoundary>
);
