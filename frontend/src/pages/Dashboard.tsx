import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "lucide-react";
import { axiosInstance } from "../utils/axios";
import Features from "../components/features";
import { Timeline } from "../components/ui/timeline";
import Form from "../components/form";
import { H4, Muted, Small } from "../components/ui/Typography";
import { Button } from "@/components/ui/button";

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

	const [itinerary, setItinerary] = useState<Itinerary | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
		if (cache) {
			setLoading(true);
			setTimeout(() => {
				setLoading(false);
				setItinerary(JSON.parse(cache));
			}, 1000);
			return;
		}

		setLoading(true);
		setError(null);

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
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
		}
	};

	const generateTimeline = () => {
		const itineraies: TimelineEntry[] = [];
		itinerary?.daily_itinerary.forEach((day) => {
			itineraies.push({
				title: `Day ${day.day}`,
				content: (
					<div key={day.day} className="p-4 border rounded-md">
						<h4 className="font-medium">{day.date}</h4>
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
						<Button className="mt-2 text-sm text-right" variant={"secondary"}>
							Daily Budget: {formData.currency}
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
