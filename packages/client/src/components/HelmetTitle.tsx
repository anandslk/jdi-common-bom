import { Helmet } from "react-helmet-async";
import { CONFIG } from "src/config-global";

export const HelmetTitle = ({ title, metaData }: IHelmetTitle) => (
  <Helmet>
    <title> {`${title} - ${CONFIG.appName}`}</title>

    {metaData && (
      <>
        <meta name="description" content={metaData.description} />
        <meta name="keywords" content={metaData.keywords} />
      </>
    )}
  </Helmet>
);

interface IHelmetTitle {
  title: string;
  metaData?: {
    description: string;
    keywords: string;
  };
}
