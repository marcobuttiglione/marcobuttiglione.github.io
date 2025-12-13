import alessiImg from '../assets/paper_img/Alessi.png';
import buttiglione2025661Img from '../assets/paper_img/Buttiglione2025661.png';
import falcone2025668Img from '../assets/paper_img/Falcone2025668.png';
import patti2024368Img from '../assets/paper_img/Patti2024368.png';
import buttiglione2024536Img from '../assets/paper_img/BUTTIGLIONE2024536.png';
import piazzolla2024Img from '../assets/paper_img/PIAZZOLLA2024.png';

export interface PublicationMetadata {  
	image?: ImageMetadata;
	video?: string;
	code?: string;
	featured?: boolean;
	extraText?: string;
}

export const publicationMetadata: Record<string, PublicationMetadata> = {
	"DETC2025-168422": {
		image: alessiImg,
		featured: true,
		extraText: "Best Paper Award",
		// video: "https://www.youtube.com/watch?v=example",
		// code: "https://github.com/example/repo"
	},
	"Buttiglione2025661": {
		image: buttiglione2025661Img,
        featured: true,
	},
	"Falcone2025668": {
		image: falcone2025668Img,
	},
	"Patti2024368": {
		image: patti2024368Img,
        featured: true,
        video: "https://www.youtube.com/watch?v=6d3-Trpk7lA",
	},
	"Buttiglione2024536": {
		image: buttiglione2024536Img,
        video: "https://www.youtube.com/watch?v=PSc5dPDgTFM",
        code: "https://github.com/marcobuttiglione/Thoracoscopic-Training-VR",
	},
	"Piazzolla2024": {
		image: piazzolla2024Img,
	}
};
