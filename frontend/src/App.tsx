import Footer from "./components/footer";
import Nav from "./components/nav";
import { ThemeProvider } from "./components/ui/theme-provider";
import TravelPlanner from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
				<Nav />
				<Routes>
					<Route path="/" index element={<Home />} />
					<Route path="page/dashboard" element={<TravelPlanner />} />
				</Routes>
				<Footer />
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
