import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolInvocations?: any[];
};

interface PendingContext {
  fileToken: string;
  systemSeq: string;
  docSeq: string;
  fileName: string;
}

interface AiChatState {
  isOpen: boolean;
  isExpanded: boolean;
  messages: Message[];
  pendingContext: PendingContext | null;
  selectedModel: string;
  
  setIsOpen: (isOpen: boolean) => void;
  setIsExpanded: (isExpanded: boolean) => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setPendingContext: (context: PendingContext | null) => void;
  setSelectedModel: (model: string) => void;
  resetChat: () => void;
}

export const useAiChatStore = create<AiChatState>()(
  persist(
    (set) => ({
      isOpen: false,
      isExpanded: false,
      messages: [],
      pendingContext: null,
      selectedModel: '0',

      setIsOpen: (isOpen) => set({ isOpen }),
      setIsExpanded: (isExpanded) => set({ isExpanded }),
      setMessages: (messagesOrFn) => set((state) => ({
        messages: typeof messagesOrFn === 'function' ? messagesOrFn(state.messages) : messagesOrFn
      })),
      setPendingContext: (pendingContext) => set({ pendingContext }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      resetChat: () => set({ messages: [], pendingContext: null }),
    }),
    {
      name: 'ai-chat-storage',
      storage: createJSONStorage(() => localStorage),
      // 필요한 것만 저장 (UI 상태 제외하고 메시지 위주로 저장 가능)
      partialize: (state) => ({ 
        messages: state.messages, 
        selectedModel: state.selectedModel,
        pendingContext: state.pendingContext 
      }),
    }
  )
);
