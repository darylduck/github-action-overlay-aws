import "./BuildStatus.css";

export interface BuildStatusLogoProps {
  animationDuration: number;
  buildLogoUrl: string;
  width: number;
  height: number;
}

const BuildStatusLogo = ({ animationDuration, buildLogoUrl, width, height }: BuildStatusLogoProps): JSX.Element => {
  console.log(animationDuration);

  return (
    <div className="build-status" style={{
      backgroundImage: `url(${buildLogoUrl})`,
      backgroundSize: `${width}px ${height}px`,
      animationDuration: `${animationDuration}ms`
    }}></div>
  );
};

export default BuildStatusLogo;
