import { Moon, Sun, Monitor } from "lucide-react";
import { lazy } from "react";
const Button = lazy(() => import("./button"));
import { useTheme } from "@/components/ui/theme-provider";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	const handleChange = () => {
		switch (theme) {
			case "light":
				setTheme("dark");
				break;
			case "dark":
				setTheme("system");
				break;
			case "system":
				setTheme("light");
				break;
			default:
				setTheme("system");
				break;
		}
	};

	return (
		<Button
			onClick={handleChange}
			variant={"outline"}
			className="cursor-pointer"
		>
			{theme === "light" && <Sun />}
			{theme === "dark" && <Moon />}
			{theme === "system" && <Monitor />}
			{theme}
		</Button>
	);
}
