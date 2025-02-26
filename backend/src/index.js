import express, { urlencoded } from "express";
import handler from "./routers/api.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.post("/api/generate-itinerary", handler);

if (process.env.NODE_ENV !== "development") {
	app.use(express.static(path.join(__dirname, "../../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(
			path.join(__dirname, "../../frontend", "dist", "index.html")
		);
	});
}

app.listen(port, () => {
	console.log(`SERVER : server started at port ${port}`);
});
