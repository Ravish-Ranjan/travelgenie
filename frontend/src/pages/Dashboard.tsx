import { useEffect, useState, lazy } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import { Timeline } from "../components/ui/timeline";
import { H4, Muted, Small } from "../components/ui/Typography";
const Button = lazy(() => import("@/components/ui/button"));
const Features = lazy(() => import("../components/features"));
const Form = lazy(() => import("../components/form"));
import axios from "axios";

const TravelPlanner = () => {
	const [formData, setFormData] = useState({
		destination: "",
		budget: "5000",
		startDate: "",
		duration: "5",
		currency: "INR",
	});

	interface Itinerary {
		destination: string;
		total_budget: number;
		start_date: string;
		duration: number;
		budget_breakdown: {
			accommodation: number;
			activities: number;
			food: number;
			transportation: number;
			misc: number;
		};
		daily_itinerary: {
			day: number;
			date: string;
			activities: {
				time: string;
				activity: string;
				location: string;
				location_url: [number, number];
				estimated_cost: number;
			}[];
			daily_budget: number;
		}[];
	}
	type TimelineEntry = {
		title: string;
		content: React.ReactNode;
	};
	interface weatherI {
		description: string;
		icons: string;
		temperature: number;
	}

	const [itinerary, setItinerary] = useState<Itinerary | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [weather, setWeather] = useState<weatherI[] | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target as HTMLInputElement;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const generateItinerary = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const cache = localStorage.getItem(JSON.stringify(formData));
		setLoading(true);
		setError(null);
		if (cache) {
			setLoading(true);
			setTimeout(() => {
				setLoading(false);
				setItinerary(JSON.parse(cache));
			}, 1000);
			return;
		}

		try {
			const response = await axiosInstance.post(
				"/generate-itinerary",
				formData
			);

			if (response.status !== 200) {
				throw new Error("Failed to generate itinerary");
			}

			const data = await response.data;
			setItinerary(data);
			localStorage.setItem(
				JSON.stringify(formData),
				JSON.stringify(data)
			);
			const weather = await getWeatherForecast(Number(formData.duration));
			setWeather(weather);
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	async function getWeatherForecast(days: number) {
		// First, get coordinates for the city
		const geoResponse = await axios.get(
			`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
				formData.destination
			)}&count=1`
		);

		if (!geoResponse.data.results?.[0]) {
			throw new Error("City not found");
		}

		const { latitude, longitude } = geoResponse.data.results[0];

		// Get weather forecast
		const weatherResponse = await axios.get(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weathercode&timezone=auto`
		);

		const weatherCodes: Record<number, string> = {
			0: "Clear sky",
			1: "Mainly clear",
			2: "Partly cloudy",
			3: "Overcast",
			45: "Foggy",
			51: "Light drizzle",
			53: "Moderate drizzle",
			55: "Dense drizzle",
			61: "Slight rain",
			63: "Moderate rain",
			65: "Heavy rain",
			80: "Slight rain showers",
			81: "Moderate rain showers",
			82: "Violent rain showers",
		};

		const ret = weatherResponse.data.daily.time
			.slice(0, days)
			.map((_, index: number) => ({
				temperature: Math.round(
					weatherResponse.data.daily.temperature_2m_max[index]
				),
				description:
					weatherCodes[
						weatherResponse.data.daily.weathercode[index]
					] || "Normal",
				icon:
					weatherResponse.data.daily.weathercode[index] <= 3
						? "sun"
						: "cloud",
			}));
		return ret;
	}

	const generateTimeline = () => {
		const itineraies: TimelineEntry[] = [];
		itinerary?.daily_itinerary.forEach((day) => {
			itineraies.push({
				title: `Day ${day.day}`,
				content: (
					<div key={day.day} className="p-4 border rounded-md">
						<h4 className="font-medium flex justify-between">
							<span>{day.date}</span>
							<span>
								{weather && weather[day.day - 1]?.temperature}{"*C "}
								{weather && weather[day.day - 1]?.description}{" "}
							</span>
						</h4>
						<div className="mt-2 space-y-2">
							{day.activities.map((activity, index) => (
								<div
									key={index}
									className="grid grid-cols-[100px,1fr,auto] gap-2"
								>
									<div className="text-gray-600">
										{activity.time}
									</div>
									<div>
										<div>{activity.activity}</div>
										<a
											href={`https://www.google.com/maps/place/${activity.location.replace(
												" ",
												"+"
											)}/@${activity.location_url[0]},${
												activity.location_url[1]
											},17z`}
											target="_blank"
											title="See place on map"
											className="text-sm text-sky-500 flex gap-2 hover:underline"
										>
											{activity.location}
										</a>
									</div>
									<div className="text-right">
										<Features
											name={activity.location}
											location_url={activity.location_url}
										/>
										<Small className="mt-2">
											{formData.currency}{" "}
											{activity.estimated_cost}
										</Small>
									</div>
									<hr />
								</div>
							))}
						</div>
						<Button
							className="mt-2 text-sm text-right"
							variant={"secondary"}
						>
							Daily Budget: {formData.currency}{" "}
							{day.daily_budget}
						</Button>
					</div>
				),
			});
		});
		return itineraies;
	};

	useEffect(() => {
		const today = new Date();
		setFormData((prevFormData) => ({
			...prevFormData,
			startDate: today.toISOString().split("T")[0],
		}));
	}, [setFormData]);

	return (
		<div className="p-4 mx-auto flex flex-col items-center">
			<Card className="mb-6 container max-w-4xl">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="w-6 h-6" />
						Travel Timeline Generator
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form
						formData={formData}
						generateItinerary={generateItinerary}
						handleInputChange={handleInputChange}
						loading={loading}
					/>
				</CardContent>
			</Card>

			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{itinerary && (
				<Card className="container h-auto">
					<CardHeader>
						<CardTitle>
							<H4>Your Travel Itinerary</H4>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{/* short info */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Small>Destination</Small>
									<Muted>{itinerary.destination}</Muted>
								</div>
								<div>
									<Small className="font-medium">
										Total Budget
									</Small>
									<Muted>
										{formData.currency}{" "}
										{itinerary.total_budget}
									</Muted>
								</div>
								<div>
									<Small className="font-medium">
										Start Date
									</Small>
									<Muted>{itinerary.start_date}</Muted>
								</div>
								<div>
									<Small className="font-medium">
										Duration
									</Small>
									<Muted>{itinerary.duration} days</Muted>
								</div>
							</div>
							<hr />
							{/* budget breakdown */}
							<div>
								<H4 className="mb-2 font-medium">
									Budget Breakdown
								</H4>
								<div className="grid grid-cols-2 gap-2">
									<Small className="flex items-baseline gap-2">
										Accommodation:{" "}
										<Muted>
											{formData.currency}{" "}
											{
												itinerary.budget_breakdown
													.accommodation
											}
										</Muted>
									</Small>
									<Small className="flex items-baseline gap-2">
										Activities:
										<Muted>
											{formData.currency}{" "}
											{
												itinerary.budget_breakdown
													.activities
											}
										</Muted>
									</Small>
									<Small className="flex items-baseline gap-2">
										Food:
										<Muted>
											{formData.currency}{" "}
											{itinerary.budget_breakdown.food}
										</Muted>
									</Small>
									<Small className="flex items-baseline gap-2">
										Transportation:
										<Muted>
											{formData.currency}{" "}
											{
												itinerary.budget_breakdown
													.transportation
											}
										</Muted>
									</Small>
									<Small className="flex items-baseline gap-2">
										Miscellaneous:
										<Muted>
											{formData.currency}{" "}
											{itinerary.budget_breakdown.misc}
										</Muted>
									</Small>
								</div>
							</div>
							<hr />
							<div>
								<H4 className="mb-2 font-medium">
									Daily Itinerary
								</H4>
								<div className="space-y-4">
									<Timeline data={generateTimeline()} />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default TravelPlanner;
