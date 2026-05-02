import CorporateTemplate from "../templates/CorporateTemplate";
import MinimalistTemplate from "../templates/MinimalistTemplate";
import CreativeTemplate from "../templates/CreativeTemplate";
import DarkTemplate from "../templates/DarkTemplate";
import DesignerTemplate from "../templates/DesignerTemplate";
import StartupTemplate from "../templates/StartupTemplate";
import ProfessionalTemplate from "../templates/ProfessionalTemplate";
import ArtisticTemplate from "../templates/ArtisticTemplate";
import CyberpunkTemplate from "../templates/CyberpunkTemplate";
import MaterialTemplate from "../templates/MaterialTemplate";

const templateMap = {
  minimalist: MinimalistTemplate,
  corporate: CorporateTemplate,
  creative: CreativeTemplate,
  dark: DarkTemplate,
  designer: DesignerTemplate,
  startup: StartupTemplate,
  professional: ProfessionalTemplate,
  artistic: ArtisticTemplate,
  cyberpunk: CyberpunkTemplate,
  material: MaterialTemplate,
};

export default function PortfolioLayout({ data, mode = "public" }) {
  const Template = templateMap[data?.user?.templateId || data?.profile?.template_id] || MinimalistTemplate;
  return <Template data={data} mode={mode} />;
}