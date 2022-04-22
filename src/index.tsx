import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createGlobalStyle,ThemeProvider } from 'styled-components';
import {theme} from './theme/index'
import {BrowserRouter} from 'react-router-dom'
import {QueryClient,QueryClientProvider} from 'react-query'

const GlobalStyle = createGlobalStyle`
  *{
    margin:0;
    padding:0;
    color:${props => props.theme.white.darker};
  }
  body{
    background-color: ${props => props.theme.black.darker};
    overflow-x:hidden ;
    -ms-overflow-style: none
  }
  div{
    box-sizing: border-box;
  }
  li{
    list-style: none;
  }
  a{
    text-decoration: none;
    background-color: transparent;
    color:white;
  }
  ::-webkit-scrollbar { display: none; }
`
// API KEY =  "63a1eea84b460423d5a4822139eb4def"
const client = new QueryClient()
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
      <ThemeProvider theme={theme}>
      <GlobalStyle/>
      <App />
      </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
