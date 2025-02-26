import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function FamousAttractions({ link }: { link: string }) {
	return (
		<a href={link} target="_blank">
			<Button variant={"outline"}>View Famous Attractions</Button>
		</a>
	);
}

export function Transports({
	name,
	location_url,
}: {
	name: string;
	location_url: [number, number];
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"outline"}>Transport Options</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<a
						target="_blank"
						href={`https://www.google.com/maps/search/public+transport+bus+near+${name}+${location_url[0]},${location_url[1]}`}
					>
						<Button variant={"link"}>Bus</Button>
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<a
						target="_blank"
						href={`https://www.google.com/maps/search/public+transport+metro+near+${name}+${location_url[0]},${location_url[1]}`}
					>
						<Button variant={"link"}>Metro</Button>
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<a
						target="_blank"
						href={`https://www.google.com/maps/search/public+transport+train+near+${name}+${location_url[0]},${location_url[1]}`}
					>
						<Button variant={"link"}>Train</Button>
					</a>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function Mall({ link }: { link: string }) {
	return (
		<a href={link} target="_blank">
			<Button variant={"outline"}>Malls NearBy</Button>
		</a>
	);
}
