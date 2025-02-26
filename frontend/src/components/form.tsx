import { CalendarCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface FormData {
	destination: string;
	budget: string;
	startDate: string;
	duration: string;
	currency: string;
}

interface FormInterface {
	generateItinerary: (event: React.FormEvent<HTMLFormElement>) => void;
	handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	formData: FormData;
	loading: boolean;
}

function Form({
	generateItinerary,
	formData,
	handleInputChange,
	loading,
}: FormInterface) {
	return (
		<form onSubmit={generateItinerary} className="space-y-4 w-full">
			<div>
				<label
					className="block mb-1 text-sm font-medium"
					title="this field is required"
				>
					Destination <span className="text-red-500">*</span>
				</label>
				<Input
					type="text"
					name="destination"
					value={formData.destination}
					onChange={handleInputChange}
					className="w-full p-2 border rounded-md"
					placeholder="e.g., Paris, France"
					required
				/>
			</div>
			<div className="flex w-full gap-2">
				<div className="flex-1 ">
					<label
						className="block mb-1 text-sm font-medium"
						title="this field is required"
					>
						Budget (INR) <span className="text-red-500">*</span>
					</label>
					<Input
						type="number"
						name="budget"
						value={formData.budget}
						onChange={handleInputChange}
						className="w-full p-2 border rounded-md"
						placeholder="e.g., 3000"
						required
						min={0}
					/>
				</div>
				<div className="flex-1 gap-2">
					<label
						className="block mb-1 text-sm font-medium"
						title="this field is required"
					>
						Currency <span className="text-red-500">*</span>
					</label>
					<Input
						type="string"
						name="currency"
						value={formData.currency}
						onChange={handleInputChange}
						className="w-full p-2 border rounded-md"
						placeholder="e.g., INR, USD, EURO, YEN"
						required
					/>
				</div>
			</div>

			<div className="flex w-full gap-2">
				<div className="flex-1">
					<label
						className="block mb-1 text-sm font-medium"
						title="this field is required"
					>
						Start Date <span className="text-red-500">*</span>
					</label>
					<input
						type="date"
						name="startDate"
						value={formData.startDate}
						onChange={handleInputChange}
						className="w-full p-2 border rounded-md"
						required
					/>
				</div>

				<div className="flex-1">
					<label
						className="block mb-1 text-sm font-medium"
						title="this field is required"
					>
						Duration (days) <span className="text-red-500">*</span>
					</label>
					<Input
						type="number"
						name="duration"
						value={formData.duration}
						onChange={handleInputChange}
						className="w-full p-2 border rounded-md"
						placeholder="e.g., 5"
						min="1"
						max="30"
						required
					/>
				</div>
			</div>

			<Button
				type="submit"
				disabled={loading}
				variant={"default"}
				className="w-full cursor-pointer"
			>
				{loading ? (
					"Generating..."
				) : (
					<span className="flex gap-2">
						<CalendarCheck /> Generate Timeline
					</span>
				)}
			</Button>
		</form>
	);
}

export default Form;
