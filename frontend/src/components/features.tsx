// weather day wise
// itienary photo/pdf

import { FamousAttractions, Mall, Transports } from "./featurecomponents";

export default function Features({
	name,
	location_url,
}: {
	name: string;
	location_url: [number, number];
}) {
	return (
		<div className="w-full flex gap-2 items-center flex-wrap">
			<Mall
				link={`https://www.google.com/maps/search/malls+near+${name}+${location_url[0]},${location_url[1]}`}
			/>
			<Transports name={name} location_url={location_url} />
			<FamousAttractions
				link={`https://www.google.com/maps/search/tourist+attractions+near+${name}+${location_url[0]},${location_url[1]}`}
			/>
		</div>
	);
}
