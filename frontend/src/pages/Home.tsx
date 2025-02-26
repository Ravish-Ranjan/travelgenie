import { H1, Muted } from "@/components/ui/Typography";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	return (
		<div className="flex-1 p-8 ">
			<BackgroundBeams className="-z-10" />
			<div className="container flex flex-col items-center justify-center gap-2 mt-8 h-96 sm:mt-12">
				<H1>Your Travel Wishes Granted. Instantly.</H1>
				<Muted className="text-xl">
				Wish. Pack. Go.
				</Muted>
				<div className="flex gap-2 my-2">
					<Button
						variant="outline"
						onClick={() => navigate("/page/dashboard")}
					>
						Go to Dashboard
					</Button>
				</div>
			</div>
		</div>
	);
}
