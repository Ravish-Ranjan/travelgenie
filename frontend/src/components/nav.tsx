import { CableCar } from "lucide-react";
import { H4 } from "@/components/ui/Typography";
import { ModeToggle } from "./ui/toggle-theme";
import { useNavigate } from "react-router-dom";

function Nav() {
	const navigate = useNavigate()
	return (
		<div className="flex items-center justify-between w-full h-16 gap-4 p-4" style={{backgroundColor:"#ffffff11"}}>
			<div
				className="flex items-center gap-2 cursor-pointer"
				title="go to homepage"
				onClick={() => navigate("/")}
			>
				<CableCar strokeWidth={2} />
				<H4>TripGenie</H4>
			</div>
			<div className="flex items-center gap-2">
				<ModeToggle />
			</div>
		</div>
	);
}

export default Nav;
