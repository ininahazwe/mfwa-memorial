// ============================================
// APPLICATION ADMIN PRINCIPALE
// ============================================
// Assemble Refine + Ant Design + Firebase + Routes

import { Refine, Authenticated } from '@refinedev/core';
import { 
  ThemedLayoutV2, 
  ThemedSiderV2, 
  useNotificationProvider, 
  ErrorComponent,
  RefineThemes,
} from '@refinedev/antd';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import routerBindings, { 
  NavigateToResource, 
  UnsavedChangesNotifier 
} from '@refinedev/react-router-v6';
import { ConfigProvider, App as AntdApp, theme } from 'antd';

// Providers
import { firestoreDataProvider } from './providers/firestoreDataProvider';
import { authProvider } from './providers/authProvider';

// Pages
import { LoginPage } from './pages/login';

// Resources - Journalistes
import { JournalistList } from './resources/journalists/list';
import { JournalistCreate } from './resources/journalists/create';
import { JournalistEdit } from './resources/journalists/edit';

// Resources - Pays
import { CountryList } from './resources/countries/list';
import { CountryCreate } from './resources/countries/create';
import { CountryEdit } from './resources/countries/edit';

// Styles Ant Design
import '@refinedev/antd/dist/reset.css';

// ============================================
// COMPOSANT TITRE SIDEBAR
// ============================================

const SidebarTitle = () => (
  <div style={{ 
    padding: '16px', 
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '18px',
    fontWeight: 300,
    letterSpacing: '0.05em',
  }}>
    Mémoire <span style={{ color: '#c4a77d' }}>Vive</span>
  </div>
);

// ============================================
// APPLICATION
// ============================================

const App = () => {
  return (
    <BrowserRouter>
      {/* Configuration du thème Ant Design (dark) */}
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            // Couleur principale (accent doré)
            colorPrimary: '#c4a77d',
            // Fonds
            colorBgContainer: '#141414',
            colorBgElevated: '#1a1a1a',
            colorBgLayout: '#0a0a0a',
            // Bordures arrondies
            borderRadius: 6,
            // Police
            fontFamily: '"DM Sans", sans-serif',
          },
        }}
      >
        <AntdApp>
          <Refine
            // ----------------------------------------
            // Providers
            // ----------------------------------------
            dataProvider={firestoreDataProvider}
            authProvider={authProvider}
            routerProvider={routerBindings}
            notificationProvider={useNotificationProvider}
            
            // ----------------------------------------
            // Resources (collections Firestore)
            // ----------------------------------------
            resources={[
              {
                name: 'journalists',
                list: '/journalists',
                create: '/journalists/create',
                edit: '/journalists/edit/:id',
                meta: { 
                  label: 'Journalistes',
                  icon: '📰',
                },
              },
              {
                name: 'countries',
                list: '/countries',
                create: '/countries/create',
                edit: '/countries/edit/:id',
                meta: { 
                  label: 'Pays',
                  icon: '🌍',
                },
              },
            ]}
            
            // ----------------------------------------
            // Options
            // ----------------------------------------
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              {/* ====================================== */}
              {/* Routes protégées (nécessitent auth)   */}
              {/* ====================================== */}
              <Route
                element={
                  <Authenticated
                    key="authenticated"
                    fallback={<Outlet />}
                  >
                    <ThemedLayoutV2
                      Sider={() => (
                        <ThemedSiderV2 
                          Title={() => <SidebarTitle />}
                          render={({ items }) => (
                            <>
                              {items}
                              {/* Lien vers le site public */}
                              <div style={{ 
                                padding: '16px',
                                borderTop: '1px solid rgba(255,255,255,0.06)',
                                marginTop: 'auto',
                              }}>
                                <a 
                                  href="/" 
                                  target="_blank"
                                  style={{ 
                                    color: '#8a8a85', 
                                    fontSize: '12px',
                                    textDecoration: 'none',
                                  }}
                                >
                                  ↗ Voir le site public
                                </a>
                              </div>
                            </>
                          )}
                        />
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                {/* Redirection par défaut */}
                <Route index element={<NavigateToResource resource="journalists" />} />
                
                {/* Routes Journalistes */}
                <Route path="/journalists">
                  <Route index element={<JournalistList />} />
                  <Route path="create" element={<JournalistCreate />} />
                  <Route path="edit/:id" element={<JournalistEdit />} />
                </Route>
                
                {/* Routes Pays */}
                <Route path="/countries">
                  <Route index element={<CountryList />} />
                  <Route path="create" element={<CountryCreate />} />
                  <Route path="edit/:id" element={<CountryEdit />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              
              {/* ====================================== */}
              {/* Route publique : Login                */}
              {/* ====================================== */}
              <Route path="/login" element={<LoginPage />} />
            </Routes>
            
            {/* Avertissement si modifications non sauvegardées */}
            <UnsavedChangesNotifier />
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
