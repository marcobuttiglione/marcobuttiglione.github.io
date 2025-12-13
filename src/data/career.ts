export interface CareerEntry {
	company: string;
	role: string;
	startDate: string;
	endDate: string;
	location: string;
	type?: string;
	description?: string;
}

export const careerData: CareerEntry[] = [
	{
		company: "Politecnico di Milano",
		role: "Teaching Assistant",
		startDate: "Sep 2024",
		endDate: "Present",
		location: "Milano, Lombardia, Italia",
		type: "Contract",
		description: "Assisted in lab sessions and student support for Computer Graphics (Vulkan, Master’s degree course in English) and Laboratorio di Rappresentazione Digitale (Bachelor’s degree course, 3D CAD modeling for fashion accessories)."
	},
	{
		company: "Politecnico di Milano",
		role: "PhD Researcher",
		startDate: "Sep 2024",
		endDate: "Present",
		location: "Milano, Lombardia, Italia",
		type: "Full-time",
		description: ""
	},
	{
		company: "Politecnico di Milano",
		role: "Research Fellow",
		startDate: "May 2024",
		endDate: "Sep 2024",
		location: "Milano, Lombardia, Italia",
		type: "Contract",
		description: "Developed a simulation framework based on Extended Position-Based Dynamics (XPBD) to enhance the accessibility and interactivity of anatomical Digital Twins for applications in extended reality and surgical planning."
	},
	{
		company: "Rewind Studios",
		role: "Game Developer",
		startDate: "Oct 2022",
		endDate: "Present",
		location: "Milano, Lombardia, Italia",
		type: "Freelance",
		description: "Directing an indie team for the development of Paradox!, a 2D puzzle platformer, overseeing its design and game mechanics."
	},
	{
		company: "Wideverse",
		role: "Frontend Web Developer",
		startDate: "Jan 2021",
		endDate: "Sep 2021",
		location: "Bari, Puglia, Italia",
		description: "Developed a CRM portal using ReactJS for the civil registry office of the Italian Public Administration. Developed of a 3D web configurator using Babylon.js for a company in the outdoor blinds sector."
	}
];
