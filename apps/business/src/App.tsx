import { I18nProvider, initI18n } from "@repo/i18n";
import { ThemeProvider } from "@repo/ui";
import { AppRouter } from "@shared/router";
import { resources } from "@shared/locales/resources";

//다국어 초기화
initI18n(resources);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="partner-screen-mode">
      <I18nProvider>
        <AppRouter />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
