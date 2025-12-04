import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as MobxProvider } from "mobx-react";
import "./index.css";
import App from "./App.tsx";

import * as mobxStores from "./store";

createRoot(document.getElementById("root")!).render(
	<MobxProvider {...mobxStores}>
		<StrictMode>
			<App />
		</StrictMode>
	</MobxProvider>,
);
