import { NotFound, ThemeProvider } from "@repo/ui";
import { AppRouter } from "@shared/router";
import { I18nProvider, initI18n } from "@repo/i18n";
import { resources } from "@shared/locales/resources";
import { useConnectionStore } from "@shared/store/useConnectionStore";

//다국어 초기화
initI18n(resources);

function App() {
  const isDown = useConnectionStore((s) => s.isDown);
  const lastError = useConnectionStore((s) => s.lastError);

  // axios 의 status:0 fallback 메시지는 statusLabel("NETWORK ERROR") 과 중복되므로 무시
  const hasUsefulMessage =
    lastError?.message && lastError.message !== "Network Error";

  return (
    <ThemeProvider defaultTheme="light" storageKey="partner-screen-mode">
      <I18nProvider>
        {isDown ? (
          <NotFound
            title={hasUsefulMessage ? lastError!.message : "서버에 연결할 수 없습니다"}
            description={hasUsefulMessage ? undefined : "잠시 후 다시 시도해주세요."}
            status={lastError?.status}
            errorCode={lastError?.code}
            showReload
          />
        ) : (
          <AppRouter />
        )}
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
