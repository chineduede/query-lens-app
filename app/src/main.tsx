import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from 'aws-amplify/auth'
import App from "./App.tsx";
import "./index.css";
import outputs from "../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);
const existingConfig = Amplify.getConfig();

void fetchAuthSession().then((session) => {
  const token = session.tokens?.accessToken.toString();
  Amplify.configure({
    ...existingConfig,
    API: {
      ...existingConfig.API,
      REST: outputs.custom.API,
    },
  }, {
    API: {
      REST: {
        headers: async () => ({
          Authorization: `Bearer ${token}`,
        }),
      },
    },
  });
})


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);
