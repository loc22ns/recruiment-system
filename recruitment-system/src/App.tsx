import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider, Spin } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { store, persistor } from '@/app/store';
import router from '@/routes';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <Spin size="large" />
          </div>
        }
        persistor={persistor}
      >
        <ConfigProvider locale={viVN}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
