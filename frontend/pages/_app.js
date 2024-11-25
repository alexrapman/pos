// frontend/pages/_app.js
import 'tailwindcss/tailwind.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OrderNotifications } from '../components/notifications/OrderNotifications';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ToastContainer />
            <OrderNotifications />
        </QueryClientProvider>
    );
}

export default MyApp;